export default {
  Query: {
    getexamSchedule: async (_, { examScheduleId }, { models }) => {
      const examSchedule = await models.ExamSchedule.findOne({
        _id: examScheduleId,
      });
      return examSchedule;
    },
    activeExamination: async (_, {}, { models }) => {
      const activeSchedule = await models.ExamSchedule.find({
        active: true,
      });
      return activeSchedule;
    },
    getExamScheduleByType: async (_, { examTypeId }, { models }) => {
      const examSchedules = await models.ExamSchedule.find({
        examTypeID: examTypeId,
      });
      return examSchedules;
    },
    getActiveExamSchedule: async (_, {}, { models }) => {
      const examSchedules = await models.ExamSchedule.find({ active: true });
      return examSchedules;
    },
    getAllExamSchedule: async (_, {}, { models }) => {
      const query = models.ExamSchedule.find({});
      query.sort({examTypeName: -1 })
      const allExamSchedules = await query.exec();
      return allExamSchedules;
    },
    examScheduleDetails: async (_, { scheduleId }, { models }) => {
      const schedule = await models.ExamSchedule.findOne({ _id: scheduleId });
      return schedule;
    },
  },
  Mutation: {
    createSpellingExamSchedule: async (_, { input }, { models }) => {
      try {
        const newSchedule = models.ExamSchedule(input);
        await newSchedule.save();
        return newSchedule;
      } catch (error) {
        console.log("the errorfrom the console is:", error);
        throw new Error(error.message);
      }
    },
    createMultipleExamSchedule: async (_, { input }, { models }) => {
      try {
        const newSchedule = models.ExamSchedule(input);
        await newSchedule.save();
        return newSchedule;
      } catch (error) {
        console.log("the errorfrom the console is:", error);
        throw new Error(error.message);
      }
    },
    createEssayExamSchedule: async (_, { input }, { models }) => {
      try {
        const newSchedule = models.ExamSchedule(input);
        await newSchedule.save();
        return newSchedule;
      } catch (error) {
        console.log("the errorfrom the console is:", error);
        throw new Error(error.message);
      }
    },
    changeExamStatus: async (_, { examId, status }, { models }) => {
      try {
        const findSchedule = await models.ExamSchedule.findById(examId);
        if (!findSchedule) {
          return {
            message: "could not find the the examination",
            type: "CouldNotFindExamination",
          };
        }
        //check if the questions is complete
        const questionsNumber = findSchedule && findSchedule.questions.length;
        const totalQuestion = findSchedule && findSchedule.numberofQuestions;
        if (+questionsNumber != +totalQuestion) {
          return {
            message: `Please complete the question in the examination. Total questions in exam: ${totalQuestion}. Entered questions: ${questionsNumber}`,
            type: "CouldNotFindExamination",
          };
        }
        await models.ExamSchedule.updateOne(
          { _id: examId },
          {
            active: status,
          }
        );
        return {
          message: "Examination was made active.",
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    editExamSchedule: async (
      _,
      { examScheduleId, examSchedule },
      { models }
    ) => {
      try {
        const {
          numberOfQuestion,
          examName,
          active,
          examDuration,
          questions,
          examTypeId,
          examTypeName,
        } = examSchedule;
        await models.ExamSchedule.updateOne(
          { _id: examScheduleId },
          {
            numberofQuestions: numberOfQuestion,
            examinationName: examName,
            active,
            examinationDuration: examDuration,
            questions,
            examTypeID: examTypeId,
            examTypeName,
          }
        );
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    deleteExamSchedule: async (_, { examScheduleId }, { models }) => {
      try {
        await models.ExamSchedule.findByIdAndRemove(examScheduleId);
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    addQuestionsToExam: async (
      _,
      { questionsArray, scheduleId },
      { models }
    ) => {
      try {
        await models.ExamSchedule.updateOne(
          { _id: scheduleId },
          {
            $set: {
              questions: questionsArray,
            },
          }
        );

        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    addEssayQuestionsToExam: async (
      _,
      { questionsArray, scheduleId },
      { models }
    ) => {
      try {
        await models.ExamSchedule.updateOne(
          { _id: scheduleId },
          {
            $set: {
              questions: questionsArray,
            },
          }
        );

        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    addSpellingQuestionsToExam: async (
      _,
      { questionsArray, scheduleId },
      { models }
    ) => {
      try {
        await models.ExamSchedule.updateOne(
          { _id: scheduleId },
          {
            $set: {
              questions: questionsArray,
            },
          }
        );

        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  ActiveExamDetails: {
    __resolveType(obj) {
      if (obj.type) {
        return "Error";
      }
      if (obj.message) {
        return "ActiveExamSuccessful";
      }
    },
  },
  QuestionTypes: {
    __resolveType(obj) {
      if (obj.answers) {
        return "Question";
      }
      if (obj.word) {
        return "SpellingQuestion";
      }
      if (obj.possibleAnswers) {
        return "EssayExamQuestion";
      }
    },
  },
};
