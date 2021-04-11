import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SpellingQuestionSchema = new Schema(
  {
    word: String,
    correctWord: String,
    clue: { type: String, required: false },
    createdAt: Date,
    examId: String,
    examinationType: String,
  },
  { timestamps: true }
);

export default mongoose.model("spellingQuestion", SpellingQuestionSchema);
