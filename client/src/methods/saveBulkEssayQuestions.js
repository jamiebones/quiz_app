//: is the character that seperates the possible answers array

const saveBulkEssayQuestions = (excelArray, examId, examinationType) => {
  //build the question and return the array data
  let questionsArray = [];
  for (let i = 0; i < excelArray.length; i++) {
    let currentArray = excelArray[i];
    let questionObject = {};
    //loop through the second array
    for (let j = 0; j < currentArray.length; j++) {
      const arrayValue = currentArray[j];
      switch (j) {
        case 0:
          questionObject.question = arrayValue.trim();
          break;
        case 1:
          //lets split the positive answers array here
          const splitValueByAsterik = arrayValue.split(":");
          questionObject.possibleAnswers = splitValueByAsterik;
          break;
        case 2:
          questionObject.clue = arrayValue;
          break;
      }
    }
    //check if we have a question that we want to save
    if (questionObject.question && questionObject.possibleAnswers.length > 0) {
      questionObject.examId = examId;
      questionObject.type = "short answer exam";
      questionObject.examinationType = examinationType;
      questionsArray.push(questionObject);
    }
  }
  return { type: "result", payloadValue: questionsArray };
};

export default saveBulkEssayQuestions;
