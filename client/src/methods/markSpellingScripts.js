const calculateTotalScored = (questionArray) => {
  let total = 0;
  let buildScriptArray = [];
  for (let i = 0; i < questionArray.length; i++) {
    const { clue, word, correctWord, wordArray, number } = questionArray[i];
    let currentWord = "";
    for (let i = 0; i < wordArray.length; i++) {
      const currentObject = wordArray[i];
      currentWord += currentObject.value;
    }
    //build our script here
    const script = {
      number,
      clue,
      word,
      answeredWord: currentWord,
      correctWord,
    };
    buildScriptArray.push(script);
    if (currentWord.toUpperCase() === correctWord.toUpperCase()) {
      total += 1;
    }
  }
  return { total, scripts: buildScriptArray };
};

export default calculateTotalScored;
