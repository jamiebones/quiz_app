import React from "react";
import styled from "styled-components";
import state from "../applicationState";
import { useRecoilValue, useRecoilState } from "recoil";
import store from "store";

const QuestionNumberDivStyles = styled.div`
  margin-top: 40px;
  .container-num{
    display: flex;
    flex-direction: column;
    justify-contents: center;
  }
  .div-number {
    width: 60px;
    height: 60px;
    cursor: pointer;
    display: flex;
    font-size: 20px;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .numberDiv {
    display: flex;
    flex-wrap: wrap;
  }

  .answered {
    background-color: green;
    margin: 2px;
  }
  .notAnswered {
    background-color: black;
    margin: 2px;
  }

  .skipped {
    background-color: red;
    margin: 2px;
  }

  .code {
    height: 100px;
    width: 100px;
    margin: 5px;
    color: white;
  }

  .numberCode {
    border: 2px solid #c0c0c0;
    width: 50%;
    padding: 5px;
    float: right;
    background-color: #0a1b1b;
  }
  .numberCode p {
    align-self: center;
    font-size: 16px;
    color: #fff;
    padding-left: 30px;
  }

  .colorAnswered {
    background-color: green;
  }

  .colorNotAnswered {
    background-color: black;
  }
  .colorVisited {
    background-color: red;
  }
  .colorDiv {
    display: flex;
  }
`;

const QuestionsNumberDiv = () => {
  //GET THE TOTAL QUESTIONS HERE
  const questionsFromState = useRecoilValue(state.questionsState);
  const skipped = useRecoilValue(state.skippedQuestionsState);
  const [, setCurrentIndex] = useRecoilState(state.currentIndexState);

  const questionsFromStore = store.get("examQuestions");

  let questions = questionsFromState.length > 0 ? questionsFromState : questionsFromStore;
  

  //get the others from store


  const handleOnClick = (index) => {
    store.set("currentIndex", index);
    setCurrentIndex(index);
  };
  return (
    <QuestionNumberDivStyles>
      <div className="container-num">
      <div className="numberDiv">
        {questions &&
          questions.map(({ answers }, index) => {
            let hasAnswered = false;
            answers.map(({ selected }) => {
              if (selected === true) {
                hasAnswered = true;
              }
            });
            if (hasAnswered) {
              return (
                <div
                  className="div-number answered"
                  key={index}
                  onClick={() => handleOnClick(index)}
                >
                  {1 + index}
                </div>
              );
            } else {
              //skipped array

              const skipNumber = skipped.some((value) => {
                return +value == +index;
              });
              if (skipNumber) {
                //the question was skipped
                return (
                  <div
                    className="div-number skipped"
                    key={index}
                    onClick={() => handleOnClick(index)}
                  >
                    {1 + index}
                  </div>
                );
              }
              return (
                <div
                  className="div-number notAnswered"
                  key={index}
                  onClick={() => handleOnClick(index)}
                >
                  {1 + index}
                </div>
              );
            }
          })}
      </div>
      <div className="numberCode">
        <div className="colorDiv">
          <div className="code colorAnswered"></div>

          <p>Answered</p>
        </div>

        <div className="colorDiv">
          <div className="code colorNotAnswered"></div>
          <p>Not answered</p>
        </div>
        <div className="colorDiv">
          <div className="code colorVisited"></div>
          <p>Visited</p>
        </div>
      </div>
      </div>
    </QuestionNumberDivStyles>
  );
};

export default QuestionsNumberDiv;
