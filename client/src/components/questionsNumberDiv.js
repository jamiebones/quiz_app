import React from "react";
import styled from "styled-components";
import { useExamDetails } from "../context"
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
    height: 50px;
    width: 50px;
    margin: 5px;
    color: white;
  }

  .numberCode {
    border: 2px solid #c0c0c0;
    width: 100%;
    padding: 5px;
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
    background-color: #0a1b1b;
  }
  .numberCode p {
    font-size: 16px;
    color: #fff;
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
    flex-direction: column;
    align-items: center;
 
  }
`;

const QuestionsNumberDiv = () => {
  //GET THE TOTAL QUESTIONS HERE
  const { skippedQuestion: skipped, setCurrentIndex, examQuestions } = useExamDetails()
  const questionsFromStore = store.get("examQuestions");
  let questions = examQuestions?.length > 0 ? examQuestions : questionsFromStore;
  

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
