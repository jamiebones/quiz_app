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
  
`;

const ShowSpellingComponent = ({ question }) => {
  return (
    <ShowQuestionStyles>
      <hr />
      <div className="div-question-main">
        <div className="div-question">
          <p>{question.word}</p>
        </div>
      </div>
      <hr />
    </ShowQuestionStyles>
  );
};

export default ShowSpellingComponent;
