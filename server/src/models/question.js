import mongoose from "mongoose";
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    question: String,
    answers: [
      {
        option: String,
        isCorrect: Boolean,
        selected: Boolean,
      },
    ],
    questionImageUrl: { type: String, required: false },
    examinationType: String,
    examId: String,
    explanation: { type: String, required: false },
    createdAt: Date
  },
  { timestamps: true }
);
QuestionSchema.index({ question: 1 });

const QuestionModel = mongoose.model("question", QuestionSchema);

export default {
  questionModel: QuestionModel,
  questionSchema: QuestionSchema,
};
