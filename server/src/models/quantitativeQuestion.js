import mongoose from "mongoose";
const Schema = mongoose.Schema;

const QuantitativeQuestionSchema = new Schema(
  {
    questionInstruction: String,
    questionUrl: String,
    answersImageUrl: Array,
    correctAnswerImage: String,
    createdAt: Date,
    examId: String,
    examinationType: String,
  },
  { timestamps: true }
);

export default mongoose.model("quantitativeSchema", QuantitativeQuestionSchema);
