const calculateTotalScored = (questionArray=[]) => {
    let total = 0;
    for (let i = 0; i < questionArray.length; i++) {
      const answers = questionArray[i].answers;
      const selectedAnswerArray = answers.filter((answer) => {
        return answer.selected == true;
      });
      const correctAnswerArray = answers.filter((answer) => {
        return answer.isCorrect == true;
      });
      const selectedAnswer = selectedAnswerArray[0];
      const correctAnswer = correctAnswerArray[0];
      if (selectedAnswer) {
        if (correctAnswer.option == selectedAnswer.option) {
          total++;
        }
      }
    }
    return total;
  };


  export default calculateTotalScored;