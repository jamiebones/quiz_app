const generateScripts = (questionArray = []) => {
  //loop through the question array and generate
  let scriptArray = [];
  for (let i = 0; i < questionArray.length; i++) {
    const currentQuestion = questionArray[i];
    const question = currentQuestion.question;
    const answers = currentQuestion.answers;
    const explanation = currentQuestion.explanation;
    const questionNumber = i + 1;
    const selectedAnswerArray = answers.filter(
      (answer) => answer.selected == true
    );
    let selectedOption = "You did not select an answer.";
    if (selectedAnswerArray.length > 0) {
      selectedOption = selectedAnswerArray[0].option;
    }
    const correctAnswerArray = answers.filter(
      (answer) => answer.isCorrect == true
    );
    let correctOption = correctAnswerArray[0].option;

    let questionObject = {
      number: questionNumber,
      selectedOption,
      correctOption,
      explanation,
      question,
    };

    scriptArray.push(questionObject);
  }
  return scriptArray;
};

export default generateScripts;
