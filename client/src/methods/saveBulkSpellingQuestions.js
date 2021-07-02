const saveBulkSpellingQuestions = (excelArray, examId, examinationType) => {
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
          questionObject.word = arrayValue;
          break;
        case 1:
          questionObject.correctWord = arrayValue;
        case 2:
          questionObject.clue = arrayValue;
          break;
      }
    }
    //check if the word has asterisks
    if (questionObject.word.indexOf("*") != -1) {
      questionObject.examId = examId;
      questionObject.examinationType = examinationType;
      questionObject.createdAt = new Date();
      questionsArray.push(questionObject);
    }
  }
  return { type: "result", payload: questionsArray };
};

export default saveBulkSpellingQuestions;
