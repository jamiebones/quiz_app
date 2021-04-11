import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import state from "../applicationState";
import styled from "styled-components";

import store from "store";

const QuestionComponentStyles = styled.div`
  .question {
    font-size: 20px;
  }

  .question span {
    margin-right: 15px;
  }

  .questionDiv {
    padding: 20px;
    margin-top: 100px;
  }
  .radioDiv {
    padding: 20px;
  }
  .radioLabel {
    padding: 10px;
    cursor: pointer;
  }
  radio {
    cursor: pointer;
  }

  .question-divs {
    padding-left: 10px;
    cursor: pointer;
    font-size: 20px;
  }

  .question-panel {
    display: flex;
    padding: 10px;
    font-size: 16px;
  }
  hr {
    border-width: 5px;
  }
`;

const QuestionComponent = () => {
  const [quizQuestions, setQuestions] = useRecoilState(state.questionsState);

  let currentQuestionFromState = useRecoilValue(state.currentQuestionState);

  let questionsFromStore = store.get("examQuestions");

  let indexFromStore = store.get("currentIndex");
  let indexFromState = useRecoilValue(state.currentIndexState);

  let questionNumber = indexFromState ? indexFromState : indexFromStore;

  let currentQuestion = currentQuestionFromState
    ? currentQuestionFromState
    : questionsFromStore[questionNumber];
  let question = currentQuestion;
  const handleAnswerSelected = (selectedIndex) => {
    //loop through questions and replace the
    //replace the one that there is an answer
    let questionFromStoreOrState =
      quizQuestions.length > 0 ? quizQuestions : questionsFromStore;

    let presentQuestion = questionFromStoreOrState[questionNumber];
    let answersArray = [];
    for (let i = 0; i < presentQuestion.answers.length; i++) {
      let answerObj = presentQuestion.answers[i];
      if (i == selectedIndex) {
        let selectedAnswerObject = {};
        selectedAnswerObject.selected = true;
        selectedAnswerObject.isCorrect = answerObj.isCorrect;
        selectedAnswerObject.option = answerObj.option;
        answersArray.push(selectedAnswerObject);
        continue;
      }
      answersArray.push(answerObj);
    }
    let copyOfCurrentQuestion = { ...presentQuestion };
    let copyOfQuizQuestions = [...questionFromStoreOrState];
    copyOfCurrentQuestion.answers = answersArray;
    copyOfQuizQuestions[questionNumber] = copyOfCurrentQuestion;
    setQuestions(copyOfQuizQuestions);
    store.set("examQuestions", copyOfQuizQuestions);
  };

  //useBeforeunload(() => "You'll lose your data!");
  const setHtml = (html) => {
    return { __html: html };
  };

  return (
    <QuestionComponentStyles>
      <div className="questionDiv">
        <div className="question-panel">
          <div>{1 + +questionNumber}).</div>
          <div
            className="question-divs"
            dangerouslySetInnerHTML={setHtml(question && question.question)}
          />
        </div>
        <hr />
        <div className="radioDiv">
          {question &&
            question.answers &&
            question.answers.length > 0 &&
            question.answers.map(({ option, selected }, index) => {
              return (
                <React.Fragment key={index}>
                  <input
                    type="radio"
                    id={option}
                    name="answers"
                    value={option}
                    checked={selected ? true : false}
                    onChange={() => handleAnswerSelected(index)}
                  />
                  <label
                    className="radioLabel"
                    htmlFor={option}
                    onChange={() => handleAnswerSelected(index)}
                  >
                    {option}
                  </label>
                  <br></br>
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </QuestionComponentStyles>
  );
};

export default QuestionComponent;
