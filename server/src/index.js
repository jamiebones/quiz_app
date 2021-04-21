import cors from "cors";
import express from "express";
import schema from "./schema";
import resolvers from "./resolvers";
import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from "apollo-server-express";
import models from "./models";
import http from "http";
import config from "./config";
import uploadFile from "./middleware/uploadFile";
import path from "path";
import cluster from "cluster";
import os from "os";
const morgan = require("morgan");

if ( cluster.isMaster ){
  const cpuCount = os.cpus().length;
  for ( let i =0; i < cpuCount; i++ ){
    cluster.fork();
  }
} else{
  //run our server start up here
  StartUpServer();
}

cluster.on("exit", (worker) => {
  console.log(`i just died. ${worker.id} is no more`)
  cluster.fork();
})



async function StartUpServer() {
  const app = express();
  app.use(cors());
  app.use(express.static(path.join(__dirname, "../uploads")));
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined", { stream: config.winston.stream }));
  }

  //REST Route for uploading files
  app.post("/api/uploadFile", uploadFile);

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError(err) {
      if (err instanceof AuthenticationError) {
        console.log("err", err);
        return err.message;
      }
      if (err instanceof UserInputError) {
        return new Error("Input not in the correct order");
      }
      if (err.message.startsWith("Database Error")) {
        return new Error("Internal server error");
      }
      console.log("this is an error", err);
      return err;
      //return new Error("There was an error");
    },
    context: async ({ req, connection }) => {
      const user = config.isAuth(req);
      const secret = config.keys.secret;

      if (connection) {
        console.log("connection started here please");
        return { models, secret, req, user };
      }

      if (req) {
        return {
          user,
          models,
          secret,
          req,
        };
      }
    },
    playground: {
      settings: {
        "editor.theme": "light",
      },
    },
  });

  await config.startup();
  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    config.winston.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
    res.status(err.status || 500);
  });

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
