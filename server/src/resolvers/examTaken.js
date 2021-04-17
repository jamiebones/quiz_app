var lodash = require("lodash");

export default {
  Query: {
    getExamResults: async (_, { examScheduleId }, { models }) => {
      const results = await models.ExamTaken.find({
        "examDetails.examinationId": examScheduleId,
        examFinished: true,
      });
      return results;
    },
    getAllCanidateExam: async (parent, {}, {}) => {},
    getExamOfCanidate: async (parent, { examId }, { models }) => {
      const result = await models.ExamTaken.findOne({ _id: examId });
      return result;
    },
  },
  Mutation: {
    startExam: async (_, { examDetails }, { models }) => {
      //check if the person has an examination running already
      examDetails.examDetails.timeExamStarted = new Date();
      const questionType = examDetails.questionType;
      const findExamRunning = await models.ExamTaken.find({
        "examDetails.examinationId": examDetails.examDetails.examinationId,
        examFinished: false,
      });

      if (findExamRunning.length > 0) {
        return {
          message: "You already have an examination running",
          type: "ExaminationRunning",
        };
      }
      const newExam = models.ExamTaken(examDetails);
      const doc = await newExam.save();

      return {
        message: "Exam started",
        type: "ExamStarted",
        examId: doc._id.toString(),
        questionType,
      };
    },
    examEnded: async (_, { submissionDetails }, { models }) => {
      //check if the person has an examination running already
      const { examTakenId, score, scripts } = submissionDetails;

      await models.ExamTaken.updateOne(
        { _id: examTakenId },
        {
          examFinished: true,
          timeExamEnded: new Date(),
          score,
          scripts,
        }
      );

      return true;
    },
    spellingExamEnded: async (_, { submissionDetails }, { models }) => {
      //check if the person has an examination running already
      const { examTakenId, score, scripts } = submissionDetails;
      await models.ExamTaken.updateOne(
        { _id: examTakenId },
        {
          examFinished: true,
          timeExamEnded: new Date(),
          score,
          scripts,
        }
      );

      return true;
    },
    essayExamEnded: async (_, { submissionDetails }, { models }) => {
      //check if the person has an examination running already
      const { examTakenId, score, scripts } = submissionDetails;
      await models.ExamTaken.updateOne(
        { _id: examTakenId },
        {
          examFinished: true,
          timeExamEnded: new Date(),
          score,
          scripts,
        }
      );

      return true;
    },
  },
  ExamTakenDetails: {
    __resolveType(obj) {
      if (obj.examId) {
        return "ExamTakenSuccess";
      }
      if (obj.type) {
        return "Error";
      }
    },
  },
  ScriptTypes: {
    __resolveType(obj) {
      if (obj.correctOption) {
        return "ScriptQuestion";
      } else if (obj.word) {
        return "SpellingScriptQuestion";
      } else {
        return "EssayQuestionScript";
      }
    },
  },
};
