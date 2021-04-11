import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ExamTakenSchema = new Schema({
  examDetails: Object,
  timeExamStarted: Date,
  canidateDetails: Object,
  examStarted: Boolean,
  examFinished: Boolean,
  questionType: String,
  timeExamEnded: {
    type: Date,
    required: false,
  },
  score: {
    type: Number,
    required: false,
  },
  scripts: {
    type: Array,
    required: false,
    default: [],
  },
});

export default mongoose.model("examTaken", ExamTakenSchema);
