import ExamSchedule from "./examSchedule";
import ExamTaken from "./examTaken";
import QuestionModel from "./question";
import User from "./user";
import Exam from "./exam";
import DigitalAsset from "./digitalAsset";
import SpellingQuestion from "./spellingQuestion";
import QuantitativeQuestion from "./quantitativeQuestion";
import EssayExamQuestion from "./essayExamQuestion";

export default {
  ExamSchedule,
  ExamTaken,
  Question: QuestionModel.questionModel,
  User,
  Exam,
  DigitalAsset,
  SpellingQuestion,
  QuantitativeQuestion,
  EssayExamQuestion,
};
