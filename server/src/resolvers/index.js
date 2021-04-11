import QuestionResolvers from "./question";
import { GraphQLDateTime } from "graphql-iso-date";
import ExamResolvers from "./exam";
import ExamTakenResolvers from "./examTaken";
import ExamScheduleResolvers from "./examSchedule";
import UserResolvers from "./user";
import DigitalAssetResolver from "./digitalAsset";
import SpellingQuestionResolver from "./spellingQuestion"
const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  QuestionResolvers,
  ExamResolvers,
  ExamTakenResolvers,
  ExamScheduleResolvers,
  UserResolvers,
  DigitalAssetResolver,
  SpellingQuestionResolver
];
