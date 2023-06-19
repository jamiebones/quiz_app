import typeDefs from "../schema";
import resolvers from "../resolvers";
import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from "apollo-server-express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { execute, subscribe } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

import models from "../models";
import config from "../config";

const createApolloServer = async function (app) {
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
    context: { text: "I am Context" },
  });

  const serverCleanup = useServer(
    { schema, execute, subscribe },
    subscriptionServer
  );

  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    csrfPrevention: true,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              serverCleanup.dispose();
            },
          };
        },
      },
    ],
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

  await server.start();

  server.applyMiddleware({
    app,
  });

  httpServer.listen({ port: 9000 }, () => {
    console.log("Apollo Server on http://localhost:9000/graphql");
  });
};

export default createApolloServer;
