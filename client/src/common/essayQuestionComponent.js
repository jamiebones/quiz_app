import React, { useState, useRef } from "react";
import styled from "styled-components";
import VideoComponent from "../common/videoComponent";
import AudioComponent from "../common/audioComponent";
import ImageComponent from "../common/imageComponent";
import settings from "../config";

const baseUrl = settings.API_URL;
const EssayComponentStyles = styled.div`
  .number {
    font-size: 20px;
  }
  .div-panel {
    border: 1px solid #c0c0c0;
    padding: 20px;
    margin-bottom: 20px;
  }
  .question-panel {
    display: flex;
  }
  .question-divs {
    margin-left: 40px;
    font-size: 20px;
  }
  .media {
    margin-left: 40px;
  }

  .clue {
    font-size: 16px;
    color: #082b79;
  }

  input {
    border-top-style: hidden;
    border-right-style: hidden;
    border-left-style: hidden;
    border-bottom-style: groove;
    border-bottom: 2px solid black;
    width: 50%;
    background: none;
  }

  .no-outline:focus {
    outline: none;
    padding: 10px;
  }
  .clue {
    font-size: 20px;
    margin: 20px 0px;
  }
  .hideMe {
    display: none;
  }
  @media only screen and (max-width: 600px) {
    input {
      width: 100%;
    }
  }
`;

const setHtml = (html) => {
  return { __html: html };
};

const EssayExamQuestionComponent = ({
  data: {
    number,
    question,
    clue,
    mediaUrl,
    mediaType,
    index,
    textBox: { value },
    onChangeText,
  },
}) => {
  const onTextAnswerChange = (e, index) => {
    const text = e.target.value;
    onChangeText({ value: text, index });
  };

  return (
    <EssayComponentStyles>
      <div className="card div-panel" id={`${index + 1}`}>
        <div className="question-panel">
          <div className="number">{number}.</div>
          <div
            className="question-divs"
            dangerouslySetInnerHTML={setHtml(question)}
          />
        </div>
        {mediaType && (
          <div className="media">
            {mediaType === "video" && (
              <VideoComponent src={`${baseUrl}/${mediaUrl}`} type={mediaType} />
            )}
            {mediaType === "audio" && (
              <AudioComponent src={`${baseUrl}/${mediaUrl}`} type={mediaType} />
            )}

            {mediaType === "image" && (
              <ImageComponent src={`${baseUrl}/${mediaUrl}`} />
            )}
          </div>
        )}

        <input
          type="text"
          className="no-outline"
          placeholder="type your answer here...."
          value={value}
          onChange={(e) => onTextAnswerChange(e, index)}
        />

        <div className="clue">
          {clue && (
            <p className="clue">
              Question clue:{" "}
              <b>
                <i>{clue}</i>
              </b>
            </p>
          )}
        </div>
      </div>
    </EssayComponentStyles>
  );
};

export default EssayExamQuestionComponent;
