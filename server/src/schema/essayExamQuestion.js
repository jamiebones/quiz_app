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
    deleteMedia(questionId: ID!, mediaUrl: String!): Boolean
    editEssayQuestion(input: EssayExamQuestionInput2!): Boolean
    #addEssayQuestionsToExam
  }

  type EssayExamQuestion {
    type: String!
    question: String!
    clue: String
    possibleAnswers: [String]
    mediaUrl: String
    examId: ID
    examinationType: String!
    createdAt: Date
    mediaType: String
    id: ID!
  }

  input EssayExamQuestionInput {
    type: String!
    question: String!
    clue: String
    possibleAnswers: [String]
    examId: ID!
    examinationType: String
    mediaType: String
    mediaUrl: String
    mediaFile:Upload
    
  }

  input EssayExamQuestionInput2 {
    id: ID!
    question: String!
    clue: String
    possibleAnswers: [String]
    mediaType: String
    mediaFile:Upload
  }

  type EssayQuestionsTotal {
    questions: [EssayExamQuestion!]!
    totalQuestion: String!
  }

  input EssayQuestionScriptInput {
    number: Int!
    question: String!
    clue: String
    possibleAnswers: [String]
    mediaType: String
    mediaUrl: String
    isCorrect: Boolean
    yourAnswer: String
    
  }


  type EssayQuestionScript {
    number: Int!
    question: String!
    yourAnswer: String
    clue: String
    possibleAnswers: [String]
    mediaType: String
    mediaUrl: String
    isCorrect: Boolean
  }
`;
