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
    ScriptTypes: [
      "ScriptQuestion",
      "SpellingScriptQuestion",
      "EssayQuestionScript",
    ],
  },
});

const port = process.env.PORT || 8000;

let uploadLink;
if (process.env.NODE_ENV === "production") {
  uploadLink = createUploadLink({
    //uri: `http://localhost`,
    uri: `http://${window.location.hostname}/graphql`, // Apollo Server is served from port 4000
    headers: {
      "keep-alive": "true",
    },
  });
} else {
  uploadLink = createUploadLink({
    uri: "http://localhost:9000/graphql", // Apollo Server is served from port 4000
    headers: {
      "keep-alive": "true",
    },
  });
}

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
const cleanTypeName = new ApolloLink((operation, forward) => {
  
  const omitTypename = (key, value) =>
    key === "__typename" ? undefined : value;
    //hasupload shows that the sent mutation contain an image
  if (operation.variables && !operation.getContext().hasUpload) {
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename
    );
  }
  return forward(operation);
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([cleanTypeName, errorLink, authLink, uploadLink]),
});

export default client;
