import {
  InMemoryCache,
  ApolloClient,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import store from "store";

const cache = new InMemoryCache({
  possibleTypes: {
    UserDetailsResult: ["User", "Error"],
    ActiveExamDetails: ["ActiveExamSuccessful", "Error"],
    ExamTakenDetails: ["ExamTakenSuccess", "Error"],
    QuestionTypes: ["SpellingQuestion", "Question", "EssayExamQuestion"],
    ScriptTypes: ["ScriptQuestion", "SpellingScriptQuestion"],
  },
});

const port = process.env.PORT || 8000;

let httpLink = new HttpLink({ uri: `http://localhost:${port}/graphql` });

const uploadLink = createUploadLink({
  uri: "http://localhost:8000/graphql", // Apollo Server is served from port 4000
  headers: {
    "keep-alive": "true",
  },
});

// if (process.env.NODE_ENV === "production") {
//   httpLink = new HttpLink({
//     uri: `https://${window.location.hostname}:${port}/graphql`,
//   });
// }

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) => {
      console.log(`[GraphQL Errors ] Message: ${message} Path: ${path}`);
    });
  }

  if (networkError) {
    console.log([
      `[network error] Message: ${networkError.message} Operation: ${operation.operationName}`,
    ]);
  }
});

const authLink = setContext((_, { headers, ...rest }) => {
  const token = store.get("authToken");
  const context = {
    ...rest,
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
  return context;
});

//this is to remove __typename field from the mutation

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([errorLink, authLink, uploadLink]),
});

export default client;
