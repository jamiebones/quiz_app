import { gql } from "apollo-server-express";
import ExamScheduleSchema from "./examSchedule";
import ExamTakenSchema from "./examTaken";
import UserSchema from "./user";
import QuestionSchema from "./question";
import ExamSchema from "./exam";
import DigitalAssetSchema from "./digitalAsset";
import SpellingQuestionSchema from "./spellingQuestion";

const linkSchema = gql`
  scalar Date
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  ExamScheduleSchema,
  ExamTakenSchema,
  UserSchema,
  QuestionSchema,
  ExamSchema,
  DigitalAssetSchema,
  SpellingQuestionSchema,
];
