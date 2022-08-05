import { expressApp, apolloServer } from "./startup";
import configIndex from "./config";
import http from "http";
import cluster from "cluster";
import os from "os";


const { initDataBase } = configIndex;

if (cluster.isMaster) {
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
  await initDataBase();

  const app = expressApp();
  const server = apolloServer();

  server.applyMiddleware({ app, path: "/graphql" });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: 9000 }, () => {
    console.log("Apollo Server on http://localhost:9000/graphql");
  });
  process.on("uncaughtException", function (err) {
    console.log("Uncaught Error: ", err);
  });
}
