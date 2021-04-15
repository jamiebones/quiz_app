import methods from "../methods";

export default {
  Query: {
    autoGenEssayQuestions: async (_, { examId, number }, { models }) => {
      const questions = await models.EssayExamQuestion.aggregate([
        { $match: { examId: examId } },
        { $sample: { size: number } },
      ]);

      let mapArray = [];
      if (questions.length > 0) {
        questions.map((question) => {
          let questionMap = { ...question };
          questionMap.id = question._id;
          mapArray.push(questionMap);
        });
      }
      return mapArray;
    },
    getAnyEssayQuestion: async (parent, {}, { models }) => {
      const question = await models.EssayExamQuestion.findOne();
      return question;
    },
    getEssayQuestions: async (parent, { number }, { models }) => {
      let numberToReturn = +number;
      const questions = await models.EssayExamQuestion.aggregate([
        { $sample: { size: numberToReturn } },
      ]);
      return questions;
    },
    getAllEssayQuestions: async (parent, { offset, examId }, { models }) => {
      const query = models.EssayExamQuestion.find({ examId: examId });
      const totalQuestion = await models.EssayExamQuestion.find({
        examId,
      }).countDocuments();
      //query.sort({ createdAt: -1 });
      query.skip(offset);
      query.limit(20);
      const questions = await query.exec();
      return {
        questions,
        totalQuestion,
      };
    },
  },
  Mutation: {
    deleteEssayQuestion: async (parent, { questionId }, { models }) => {
      try {
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    saveEssayQuestion: async (parent, { input }, { models }) => {
      const {
        type,
        question,
        clue,
        possibleAnswers,
        examId,
        examinationType,
        mediaType,
        mediaFile,
      } = input;

      if (mediaFile) {
        //we have an uploaded file
        try {
          const { createReadStream, filename } = await mediaFile;
          const stream = createReadStream();
          let pathObj = await methods.uploadFile({
            stream,
            filename,
          });
          //let us save the stuff in the
          console.log("path location is ", pathObj);
          const essayQuestion = new models.EssayExamQuestion({
            type,
            question,
            clue,
            possibleAnswers,
            mediaUrl: pathObj,
            examId,
            examinationType,
            createdAt: new Date(),
            mediaType: mediaType,
          });
          await essayQuestion.save();
          return true;
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      } else {
        try {
          const essayQuestion = new models.EssayExamQuestion({
            type,
            question,
            clue,
            possibleAnswers,
            examId,
            examinationType,
            createdAt: new Date(),
          });
          await essayQuestion.save();
          return true;
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      }
    },
  },
};
