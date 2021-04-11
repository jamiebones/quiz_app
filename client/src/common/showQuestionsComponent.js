import React from "react";
import styled from "styled-components";

const ShowQuestionStyles = styled.div`
  .question-div {
    padding: 2px;
    cursor: pointer;
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
`;

const ShowQuestionComponent = ({ question }) => {
  const setHtml = (html) => {
    return { __html: html };
  };
  return (
    <ShowQuestionStyles>
      <hr />
      <div className="div-question-main">
        <div className="div-question">
          <div
            className="question-div"
            dangerouslySetInnerHTML={setHtml(question.question)}
          />
        </div>
      </div>
      <hr />
    </ShowQuestionStyles>
  );
};

export default ShowQuestionComponent;
