import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getexamSchedule(examScheduleId: ID!): ExamSchedule
    getExamScheduleByType(examTypeId: ID!): [ExamSchedule]
    examScheduleDetails(scheduleId: ID!): ExamSchedule
    getAllExamSchedule: [ExamSchedule!]
    getActiveExamSchedule: [ExamSchedule]
    activeExamination: [ExamSchedule!]!
  }

  extend type Mutation {
    createMultipleExamSchedule(input: MultipleExamScheduleInput!): ExamSchedule
    createSpellingExamSchedule(input: SpellingExamScheduleInput!): ExamSchedule
    createEssayExamSchedule(input: EssayExamScheduleInput!): ExamSchedule
    addEssayQuestionsToExam(
      questionsArray: [EssayQuestionInputTypeForExamSchedule!]
      scheduleId: ID!
    ): Boolean
    addQuestionsToExam(
      questionsArray: [QuestionInput2!]
      scheduleId: ID!
    ): Boolean
    addSpellingQuestionsToExam(
      questionsArray: [SpellingQuestionInput2!]
      scheduleId: ID!
    ): Boolean
    editExamSchedule(
      examScheduleId: ID!
      examSchedule: MultipleExamScheduleInput!
    ): ExamSchedule
    deleteExamSchedule(examScheduleId: ID!): Boolean
    changeExamStatus(examId: ID!, status: Boolean!): ActiveExamDetails!
  }

  union ActiveExamDetails = ActiveExamSuccessful | Error
  union QuestionTypes = SpellingQuestion | Question | EssayExamQuestion

  input MultipleExamScheduleInput {
    numberofQuestions: Int!
    examinationName: String!
    active: Boolean
    examinationDuration: Int!
    questions: [QuestionInput]
    examTypeID: ID!
    examTypeName: String!
    questionType: String!
  }

  input SpellingExamScheduleInput {
    numberofQuestions: Int!
    examinationName: String!
    active: Boolean
    examinationDuration: Int!
    questions: [SpellingQuestionInput]
    examTypeID: ID!
    examTypeName: String!
    questionType: String!
  }

  input EssayExamScheduleInput {
    numberofQuestions: Int!
    examinationName: String!
    active: Boolean
    examinationDuration: Int!
    questions: [EssayExamQuestionInput]
    examTypeID: ID!
    examTypeName: String!
    questionType: String!
  }

  type Error {
    message: String!
    type: String!
  }

  type ExamSchedule {
    id: ID!
    numberofQuestions: Int!
    examinationName: String!
    active: Boolean
    examinationDuration: Int!
    questions: [QuestionTypes]
    questionType: String!
    examTypeID: ID!
    examTypeName: String!
  }

  type ActiveExamSuccessful {
    message: String!
  }
`;
