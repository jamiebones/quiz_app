import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ExamScheduleSchema = new Schema({
  numberofQuestions: Number,
  examinationName: String,
  examTypeID: String,
  examTypeName: String,
  active: Boolean,
  examinationDuration: Number,
  questionType: String,
  questions: {
    type: Array,
    required: false,
    default: [],
  },
});

export default mongoose.model("examSchedule", ExamScheduleSchema);
