import { expressApp, apolloServer } from "./startup";
import configIndex from "./config";
import cluster from "cluster";
import os from "os";


const { initDataBase } = configIndex;

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
  await initDataBase();

  const app = expressApp();
  apolloServer(app);

  process.on("uncaughtException", function (err) {
    console.log("Uncaught Error: ", err);
  });
}
