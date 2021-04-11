import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAssetsByType(type: String!): [DigitalAsset]
  }

  extend type Mutation {
    saveAsset(
      fileName: String!
      assetType: String!
      description: String!
      fileType: String!
    ): DigitalAsset
    deleteAsset(fileId: ID!, fileName: String!): Boolean
  }

  type DigitalAsset {
    fileName: String!
    assetType: String!
    description: String!
    fileType: String!
    id: ID!
  }
`;
