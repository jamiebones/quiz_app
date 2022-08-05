import schema from "../schema";
import resolvers from "../resolvers";
import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from "apollo-server-express";
import models from "../models";
import config from "../config";

const createApolloServer = function (app) {
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

  return server;
};

export default createApolloServer;
