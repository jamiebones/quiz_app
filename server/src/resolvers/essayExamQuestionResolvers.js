import methods from "../methods";
import path from "path";
import fs from "fs";

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
      query.sort("-createdAt");
      const questions = await query.exec();
      return {
        questions,
        totalQuestion,
      };
    },
  },
  Mutation: {
    saveBulkEssayQuestion: async (_, args, { models }) => {
      try {
        const { input } = args;
        const uploadResult = await models.EssayExamQuestion.insertMany(input);
        return uploadResult.length;
      } catch (error) {
        console.log(error);
        throw new Error(`Database Error`);
      }
    },
    editEssayQuestion: async (parent, { input }, { models }) => {
      try {
        const {
          id,
          question,
          clue,
          possibleAnswers,
          mediaType,
          mediaFile,
        } = input;
        if (mediaFile) {
          const { createReadStream, filename } = await mediaFile;
          const stream = createReadStream();
          let pathObj = await methods.uploadFile({
            stream,
            filename,
          });

          const filter = { _id: id };
          const update = {
            question,
            clue,
            possibleAnswers,
            mediaType,
            mediaUrl: pathObj,
          };
          await models.EssayExamQuestion.findOneAndUpdate(filter, update);
          return true;
        } else {
          const filter = { _id: id };
          const update = {
            question,
            clue,
            possibleAnswers,
          };
          await models.EssayExamQuestion.findOneAndUpdate(filter, update);
          return true;
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    deleteEssayQuestion: async (parent, { questionId }, { models }) => {
      try {
        const questionToDelete = await models.EssayExamQuestion.findOne({
          _id: questionId,
        });
        if (!questionToDelete) {
          throw new Error("the question you want to delete does not exist");
        }
        //check if we have a media url and delete that
        const mediaUrl = questionToDelete.mediaUrl;
        //construct the path we want to use to delete the file
        const filePath = path.resolve("./uploads") + "/" + mediaUrl;
        //delete the file
        fs.unlinkSync(filePath);
        //delete the question entry here
        await models.EssayExamQuestion.findByIdAndRemove(questionId);
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    deleteMedia: async (parent, { questionId, mediaUrl }, { models }) => {
      try {
        const question = await models.EssayExamQuestion.findOne({
          _id: questionId,
        });
        if (!question) {
          throw new Error("the question does not exist");
        }

        //construct the path we want to use to delete the file
        const filePath = path.resolve("./uploads") + "/" + mediaUrl;
        //delete the file
        fs.unlinkSync(filePath);
        //delete the question entry here
        //update the question here
        question.mediaType = "";
        question.mediaUrl = "";
        await question.save();
        return true;
      } catch (error) {
        console.log(error);
        throw error;
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
          console.log("filename", filename, "createReadStream", createReadStream)
          const stream = createReadStream();
          let pathObj = await methods.uploadFile({
            stream,
            filename,
          });
          //let us save the stuff in the
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
          return essayQuestion;
          
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
