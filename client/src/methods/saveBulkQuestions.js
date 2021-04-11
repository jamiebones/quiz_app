import * as XLSX from "xlsx";

//question: String,
// answers: [
//   {
//     option: String,
//     isCorrect: Boolean,
//     selected: Boolean
//   },
// ],
// questionImageUrl: { type: String, required: false },
// examinationType: String,
// examId: String,
// explanation: { type: String, required: false }

//answers is an array
//answer is graded 1 to 4

//

const saveBulkQuestions = (excelArray, examId, examinationType) => {
  //build the question and return the array data
  let questionsArray = [];
  let errorArray = [];
  for (let i = 0; i < excelArray.length; i++) {
    let currentArray = excelArray[i];
    let answersArray = [];
    let questionObject = {};
    //loop through the second array
    for (let j = 0; j < currentArray.length; j++) {
      const arrayValue = currentArray[j];
      let answerObject = {};
      const correctAnswer = currentArray[5];

      switch (j) {
        case 0:
          questionObject.question =
            arrayValue != "undefined" ? "<p>" + arrayValue + "</p>" : "<p></p>";
          break;
        case 1:
          answerObject.option = arrayValue;
          answerObject.selected = false;
          if (+correctAnswer == 1) {
            answerObject.isCorrect = true;
          } else {
            answerObject.isCorrect = false;
          }
          answersArray.push(answerObject);
          break;

        case 2:
          answerObject.option = arrayValue;
          answerObject.selected = false;
          if (+correctAnswer == 2) {
            answerObject.isCorrect = true;
          } else {
            answerObject.isCorrect = false;
          }
          answersArray.push(answerObject);

          break;

        case 3:
          answerObject.option = arrayValue;
          answerObject.selected = false;
          if (+correctAnswer == 3) {
            answerObject.isCorrect = true;
          } else {
            answerObject.isCorrect = false;
          }
          answersArray.push(answerObject);
          break;
        case 4:
          answerObject.option = arrayValue;
          answerObject.selected = false;
          if (+correctAnswer == 4) {
            answerObject.isCorrect = true;
          } else {
            answerObject.isCorrect = false;
          }
          answersArray.push(answerObject);
          break;

        case 6:
          //the answer object;
          questionObject.explanation =
            arrayValue != "undefined" ? arrayValue.trim() : "";
          break;
      }
    }
    //add the questions and the answers here
    //check if a question has an answer or not

    const findAnswers = answersArray.filter((ans) => {
      return ans.isCorrect == true;
    });
    if (findAnswers.length == 0) {
      //we have an error in this question
      errorArray.push(questionObject.question);
    }
    questionObject.answers = answersArray;
    questionObject.questionImageUrl = "";
    questionObject.examId = examId;
    questionObject.examinationType = examinationType;
    questionsArray.push(questionObject);
  }
  if (errorArray.length > 0) {
    return {
      type: "error",
      payload: errorArray,
    };
  }
  return { type: "result", payload: questionsArray };
};

export const SheetToArray = (sheet) => {
  var result = [];
  var row;
  var rowNum;
  var colNum;
  var range = XLSX.utils.decode_range(sheet["!ref"]);
  for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    row = [];
    for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
      var nextCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
      if (typeof nextCell === "undefined") {
        row.push(void 0);
      } else row.push(nextCell.w);
    }
    result.push(row);
  }
  return result;
};

export default { saveBulkQuestions, SheetToArray };
