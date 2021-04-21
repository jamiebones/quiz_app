import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    autoGenQuestions(examId: ID! number: Int!): [Question!]
    getAnyQuestion: Question
    getQuestions(number: String): [Question!]
    getAllQuestions(offset: Int, examId: String): QuestionsTotal
    getExamQuestions(
      examId: String!
      cursor: String
      limit: Int
    ): QuestionConnection
  }

  extend type Mutation {
    addImageToQuestion(questionId: ID!, imageUrl: String!): Boolean!
    saveBulkQuestion(input: [QuestionInput]): String! #number here is the total number of questions saved
    editQuestion(input: QuestionInput!, questionId: ID!): Boolean!
    deleteQuestion(questionId: ID!): Boolean!
    submitQuestion(input: QuestionInput!): Boolean!
  }

  type Question {
    id: ID!
    question: String!
    answers: [Answers!]
    questionImageUrl: String
    examinationType: String!
    examId: ID
    explanation: String
    createdAt: Date
  }
  type Answers {
    option: String
    isCorrect: Boolean
    selected: Boolean
  }
  input AnswersInput {
    option: String
    isCorrect: Boolean
    selected: Boolean
  }
  input QuestionInput {
    question: String!
    answers: [AnswersInput!]
    questionImageUrl: String
    examinationType: String!
    examId: String
    explanation: String
  }
  input QuestionInput2 {
    question: String!
    answers: [AnswersInput!]
    questionImageUrl: String
    examinationType: String!
    examId: String
    explanation: String
    id: ID!
  }

  
  type QuestionConnection {
    edges: [Question!]!
    pageInfo: PageInfo!
  }
  type ScriptQuestion {
    number: Int!
    selectedOption: String
    correctOption: String
    explanation: String
    question: String
  }
  
  input ScriptQuestionInput {
    number: Int
    selectedOption: String
    correctOption: String
    explanation: String
    question: String
  }
  

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
    totalCount: String
  }

  type QuestionsTotal {
    questions: [Question!]!
    totalQuestion: String!
  }
`;
