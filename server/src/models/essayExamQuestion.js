import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EssayExamQuestionSchema = new Schema(
  {
    type: String,
    question: String,
    clue: { required: false, type: String },
    possibleAnswers: {
      type: Array,
      required: false,
    },
    mediaUrl: { type: String, required: false },
    mediaType: {
      type: String,
      required: false,
    },
    createdAt: Date,
    examId: String,
    examinationType: String,
  },
  { timestamps: true }
);

export default mongoose.model("essayExamQuestion", EssayExamQuestionSchema);
