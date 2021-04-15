import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    autoGenEssayQuestions(examId: ID!, number: Int!): [EssayExamQuestion!]
    getAnyEssayQuestion: EssayExamQuestion
    getEssayQuestions(number: String): [EssayExamQuestion!]
    getAllEssayQuestions(offset: Int, examId: String): EssayQuestionsTotal
  }

  extend type Mutation {
    saveEssayQuestion(input: EssayExamQuestionInput!): Boolean
    deleteEssayQuestion(questionId: ID!): Boolean
  }

  type EssayExamQuestion {
    type: String!
    question: String!
    clue: String
    possibleAnswers: [String]
    mediaUrl: String
    examId: ID!
    examinationType: String
    createdAt: Date
    mediaType: String
  }

  input EssayExamQuestionInput {
    type: String!
    question: String!
    clue: String
    possibleAnswers: [String]
    examId: ID!
    examinationType: String
    mediaType: String
    mediaFile: Upload
  }

  type EssayQuestionsTotal {
    questions: [EssayExamQuestion!]!
    totalQuestion: String!
  }
`;
