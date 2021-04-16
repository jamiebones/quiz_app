import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getExamOfCanidate(examId: ID!): ExamTaken
    getSpellingExamOfCanidate(examId: ID!): ExamTaken
    getAllCanidateExam(username: String!): [ExamTaken!]
    getExamResults(examScheduleId: ID!): [ExamTaken]
  }

  extend type Mutation {
    startExam(examDetails: ExamTakenInput!): ExamTakenDetails!
    examEnded(submissionDetails: ExamFinishedInput!): Boolean!
    spellingExamEnded(submissionDetails: SpellingExamFinishedInput!): Boolean!
    essayExamEnded(submissionDetails: EssayExamFinishedInput!): Boolean!
  }

  union ExamTakenDetails = ExamTakenSuccess | Error
  union ScriptTypes = ScriptQuestion | SpellingScriptQuestion

  type ExamTakenSuccess {
    type: String
    message: String!
    examId: String!
    questionType: String
  }

  input ExamTakenInput {
    examDetails: ExamDetailsInput!
    timeExamStarted: Date!
    canidateDetails: CandidateDetailsInput!
    examStarted: Boolean!
    examFinished: Boolean!
    questionType: String
  }

  input ExamFinishedInput {
    examTakenId: ID!
    examFinished: Boolean!
    timeExamEnded: Date
    score: Int
    scripts: [ScriptQuestionInput]
  }

  input SpellingExamFinishedInput {
    examTakenId: ID!
    examFinished: Boolean!
    timeExamEnded: Date
    score: Int
    scripts: [SpellingQuestionScriptInput]
  }

  input EssayExamFinishedInput {
    examTakenId: ID!
    examFinished: Boolean!
    timeExamEnded: Date
    score: Int
    scripts: [EssayQuestionScriptInput]
  }

  type ExamTaken {
    id: ID!
    examDetails: ExamDetails!
    timeExamStarted: Date!
    canidateDetails: CandidateDetails!
    examStarted: Boolean!
    examFinished: Boolean!
    timeExamEnded: Date
    score: Int
    scripts: [ScriptTypes]
    questionType: String
  }

 
  input ExamDetailsInput {
    examinationName: String!
    examinationId: ID!
    numberOfQuestions: Int!
    duration: Int!
  }

  type ExamDetails {
    examinationName: String!
    examinationId: ID!
    numberOfQuestions: String!
    duration: Int!
  }
  type CandidateDetails {
    username: String
    name: String
  }

  input CandidateDetailsInput {
    username: String
    name: String
  }
`;
