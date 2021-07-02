const toCursorHash = (string) => Buffer.from(string).toString("base64");

const fromCursorHash = (string) => {
  if (!string) return;

  return Buffer.from(string, "base64").toString("ascii");
};
export default {
  Query: {
    autoGenSpellingQuestions: async (_, { examId, number }, { models }) => {
      const questions = await models.SpellingQuestion.aggregate([
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
    getAnySpellingQuestion: async (parent, {}, { models }) => {
      const question = await models.SpellingQuestion.findOne();
      return question;
    },

    getSpellingQuestions: async (parent, { number }, { models }) => {
      let numberToReturn = +number;
      const questions = await models.SpellingQuestion.aggregate([
        { $sample: { size: numberToReturn } },
      ]);
      return questions;
    },

    getExamSpellingQuestions: async (
      parent,
      { cursor, examId, limit = 3 },
      { models }
    ) => {},
    getAllSpellingQuestions: async (parent, { offset, examId }, { models }) => {
      const query = models.SpellingQuestion.find({ examId: examId });
      const totalQuestion = await models.SpellingQuestion.find({
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
    editSpellingQuestion: async (parent, { input, questionId }, { models }) => {
      try {
        const {
          word,
          correctWord,
          clue,
          examinationType,
          examId,
        } = input;
        await models.SpellingQuestion.updateOne(
          { _id: questionId },
          {
            word,
            correctWord,
            clue,
            examinationType,
            examId
          }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    submitSpellingQuestion: async (parent, args, { models }) => {
      const newQuestion = new models.SpellingQuestion(args.input);
      await newQuestion.save();
      return true;
    },
    deleteSpellingQuestion: async (parent, { questionId }, { models }) => {
      try {
        await models.SpellingQuestion.findByIdAndRemove(questionId);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    saveBulkSpellingQuestion: async (_, args, { models }) => {
      try {
        const { input } = args;
        const uploadResult = await models.SpellingQuestion.insertMany(input);
        return uploadResult.length;
      } catch (error) {
        console.log(error);
        throw new Error(`Database Error`);
      }
    },
  },
};
