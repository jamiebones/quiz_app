const calculateTotalScored = (questionArray) => {
  let total = 0;
  let buildScriptArray = [];
  for (let i = 0; i < questionArray.length; i++) {
    const {
      number,
      question,
      clue,
      mediaUrl,
      mediaType,
      possibleAnswers,
      textBox: { value },
    } = questionArray[i];
    let isCorrect = false;
    for (let i = 0; i < possibleAnswers.length; i++) {
      //check if we have the value in the possible answers array
      if (!value) {
        break;
      }
      const currentAnswer = possibleAnswers[i];
      if (value.toLowerCase() === currentAnswer.toLowerCase()) {
        total += 1;
        isCorrect = true;
      }
    }
    //build our script here
    const script = {
      number,
      question,
      clue,
      mediaUrl,
      mediaType,
      possibleAnswers,
      yourAnswer: value,
      isCorrect
    };
    buildScriptArray.push(script);
  }
  return { total, scripts: buildScriptArray };
};

export default calculateTotalScored;
