import React from "react";
import styled from "styled-components";

const ShowQuestionStyles = styled.div`
  .div-question-main {
    display: flex;
    justify-content: space-between;
    height: 200px;
    align-items: center;
  }

  .div-question {
    flex-grow: 2;
  }

  .div-answers {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex-grow: 1;
    border: 2px solid black;
    padding: 10px;
    width: 20vw;
  }
  .correctAnswer {
    border: 1px solid green;
    padding: 10px;
  }
  .action-button {
    margin-left: 10px;
  }
`;

const ShowQuestionComponent = ({ question, components }) => {
  const setHtml = (html) => {
    return { __html: html };
  };
  return (
    <ShowQuestionStyles>
      <hr />
      <div className="div-question-main">
        <div className="div-question">
          <div
            className=""
            dangerouslySetInnerHTML={setHtml(question.question)}
          />

          <p>Explanation: {question && question.explanation}</p>
        </div>
        <div className="div-answers">
          {question &&
            question.answers.map(({ option, isCorrect }, index) => {
              return (
                <p key={index} className={isCorrect ? "correctAnswer" : ""}>
                  {option}
                </p>
              );
            })}
        </div>

        <div
          className="btn-group"
          role="group"
          aria-label="Button group for edit and delete"
        >
          {components.length > 0 &&
            components.map((component, index) => {
              return (
                <React.Fragment key={index + 6655575}>
                  {component}
                </React.Fragment>
              );
            })}
        </div>
      </div>
      <hr />
    </ShowQuestionStyles>
  );
};

export default ShowQuestionComponent;
