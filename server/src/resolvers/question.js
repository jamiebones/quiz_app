const toCursorHash = (string) => Buffer.from(string).toString("base64");

const fromCursorHash = (string) => {
  if (!string) return;

  return Buffer.from(string, "base64").toString("ascii");
};
export default {
  Query: {
    autoGenQuestions: async (_, { examId, number }, { models }) => {
      console.log("examId || number", examId, number);
      const questions = await models.Question.aggregate([
        { $match: { examId: examId } },
        { $sample: { size: number } },
      ]);
      
      let mapArray = [];
      if (questions.length > 0) {
        questions.map((question) => {
          let questionMap = { ...question };
          questionMap.id = question._id;
          mapArray.push( questionMap );
          
        });
      }
      console.log("questions", mapArray);
      return mapArray;
    },
    getAnyQuestion: async (parent, {}, { models }) => {
      const question = await models.Question.findOne();
      return question;
    },

    getQuestions: async (parent, { number }, { models }) => {
      let numberToReturn = +number;
      const questions = await models.Question.aggregate([
        { $sample: { size: numberToReturn } },
      ]);
      return questions;
    },

    getExamQuestions: async (
      parent,
      { cursor, examId, limit = 3 },
      { models }
    ) => {
      const query = models.Question.find({ examId: examId });
      query.sort({ createdAt: -1 });
      query.limit(limit + 2);
      cursor && query.where("createdAt").lt(fromCursorHash(cursor));
      const questions = await query.exec();
      const hasNextPage = questions.length > limit;
      const edges = hasNextPage ? questions.slice(0, -1) : questions;
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor:
            edges.length > 0 &&
            toCursorHash(edges[edges.length - 1].createdAt.toString()),
        },
      };
    },
    getAllQuestions: async (parent, { offset, examId }, { models }) => {
      const query = models.Question.find({ examId: examId });
      const totalQuestion = await models.Question.find({
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
    saveBulkQuestion: async (_, args, { models }) => {
      try {
        const { input } = args;
        const uploadResult = await models.Question.insertMany(input);
        return uploadResult.length;
      } catch (error) {
        console.log(error);
        throw new Error(`Database Error`);
      }
    },
    addImageToQuestion: async (
      parent,
      { questionId, imageUrl },
      { models }
    ) => {
      try {
        const question = await models.Question.findById(questionId);
        question.imageUrl = imageUrl;
        await question.save();
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    editQuestion: async (parent, { input, questionId }, { models }) => {
      try {
        const {
          question,
          answers,
          questionImageUrl,
          examinationType,
          examId,
          explanation,
        } = input;
        await models.Question.updateOne(
          { _id: questionId },
          {
            question,
            answers,
            questionImageUrl,
            examinationType,
            examId,
            explanation,
          }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    submitQuestion: async (parent, args, { models }) => {
      const newQuestion = new models.Question(args.input);
      await newQuestion.save();
      return true;
    },
    deleteQuestion: async (parent, { questionId }, { models }) => {
      try {
        await models.Question.findByIdAndRemove(questionId);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
