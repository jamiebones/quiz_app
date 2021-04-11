import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    autoGenSpellingQuestions(examId: ID!, number: Int!): [SpellingQuestion!]
    getAnySpellingQuestion: SpellingQuestion
    getSpellingQuestions(number: String): [SpellingQuestion!]
    getAllSpellingQuestions(offset: Int, examId: String): SpellingQuestionsTotal
    getExamSpellingQuestions(
      examId: String!
      cursor: String
      limit: Int
    ): SpellingQuestionConnection
  }

  extend type Mutation {
    editSpellingQuestion(
      input: SpellingQuestionInput!
      questionId: ID!
    ): Boolean!
    deleteSpellingQuestion(questionId: ID!): Boolean!
    submitSpellingQuestion(input: SpellingQuestionInput!): Boolean!
    saveBulkSpellingQuestion(input: [SpellingQuestionInput]): String!
  }

  type SpellingQuestion {
    id: ID!
    word: String
    correctWord: String
    clue: String
    examinationType: String!
    examId: ID
    createdAt: Date
  }

  input SpellingQuestionInput {
    word: String!
    correctWord: String!
    clue: String
    examinationType: String!
    examId: ID
    createdAt: Date
  }

  input SpellingQuestionInput2 {
    word: String!
    correctWord: String!
    clue: String
    examinationType: String!
    examId: ID
    createdAt: Date
    id: ID
  }

  input SpellingQuestionScriptInput {
    number: Int!
    clue: String
    word: String!
    answeredWord: String!
    correctWord: String!
  }

  type SpellingScriptQuestion {
    number: Int!
    clue: String
    word: String!
    answeredWord: String!
    correctWord: String!
  }

  type SpellingQuestionConnection {
    edges: [Question!]!
    pageInfo: PageInfo!
  }

  type SpellingQuestionsTotal {
    questions: [SpellingQuestion!]!
    totalQuestion: String!
  }
`;
