import { expressApp, apolloServer } from "./startup/index.js";
import configIndex from "./config/index.js";
import cluster from "cluster";
import os from "os";

const { initDataBase, createAdminUser } = configIndex;

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  //run our server start up here
  StartUpServer();
}

cluster.on("exit", (worker) => {
  console.log(`i just died. ${worker.id} is no more`);
  cluster.fork();
});

async function StartUpServer() {
  //start the database
  try {
    await initDataBase();

    await createAdminUser();
    //initialize the express app
    const app = expressApp();
    const { server, httpServer } = await apolloServer(app);
    server.applyMiddleware({
      app,
    });

    httpServer.listen({ port: 9000 }, () => {
      console.log("Apollo Server on http://localhost:9000/graphql");
    });

    process.on("uncaughtException", function (err) {
      console.log("Uncaught Error: ", err);
    });
  } catch (error) {
    console.log("error on start-up ", error);
  }
}
