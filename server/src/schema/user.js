import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    loginUser(username: String!, password: String!): UserDetailsResult
    #users: [User!]
    #user(id: ID!): User
    usersByStatus(status: Boolean!, offset: Int!): UserQueryResult!
  }

  extend type Mutation {
    changePassword(username: String!, newPassword: String!): Boolean!
    changeUserStatus(id: ID!, active: Boolean!): Boolean!
    createUser(
      username: String!
      password: String!
      userType: String!
      name: String!
      active: Boolean!
    ): UserDetailsResult!
  }

  union UserDetailsResult = User | Error

  type User {
    id: ID!
    username: String!
    password: String!
    userType: String!
    active: Boolean
    name: String
    token: String
  }

  type UserQueryResult {
    users: [User]
    totalUsersByStatus: Int
  }
`;
