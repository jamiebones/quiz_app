import React from "react";
import styled from "styled-components";
import moment from "moment";
import ImageComponent from "./imageComponent";
import settings from "../config";
const baseUrl = settings.API_URL;

const DisplayEssayScriptStyles = styled.div`
  p {
    font-size: 18px;
  }
  .question {
    font-size: 16px;
  }

  .question-panel {
    display: flex;
    flex-wrap: wrap;
    font-size: 18px;
    font-size: 18px;
    margin-bottom: 0px;
    color: #fff;
    padding: 10px;
    background-color: #0b5d51;
    span {
      padding: 3px 30px;
    }
  }
  .question-divs {
    padding-left: 20px;
  }
  .details {
    background-color: #fefeff;
    color: #343a40;
    padding: 30px;
  }
  .text-name {
    color: #7abbff !important;
  }
  .spanDetails {
    float: right;
    font-weight: bold;
    color: #7c23f3;
  }
  .score {
    font-size: 35px;
    text-align: center;
  }
  .answer {
  }
  .possible-span {
    padding: 10px;
  }
  .left {
    padding-left: 50px;
  }
`;

const setHtml = (html) => {
  return { __html: html };
};

const DisplayEssayScriptComponent = ({ scripts }) => {
  return (
    <DisplayEssayScriptStyles>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {scripts && (
            <React.Fragment>
              <div className="details">
                <h2 className="text-center text-name">
                  <b>{scripts.examDetails.examinationName.toUpperCase()}</b>
                </h2>

                <p>
                  Time started :
                  <span className="spanDetails">
                    {moment(scripts.timeExamStarted).format(
                      "dddd, MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>
                </p>
                <p>
                  Time ended :
                  <span className="spanDetails">
                    {moment(scripts.timeExamEnded).format(
                      "dddd, MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>
                </p>
                <p>
                  Exam Duration :{" "}
                  <span className="spanDetails">
                    {scripts.examDetails.duration}
                  </span>
                </p>

                <p>
                  Time Taken :
                  <span className="spanDetails">
                    {moment(scripts.timeExamEnded).diff(
                      moment(scripts.timeExamStarted),
                      "minutes"
                    )}
                  </span>
                </p>
              </div>
              <p className="score">
                Score :
                <span>
                  {scripts.score} /{scripts.examDetails.numberOfQuestions}
                </span>
              </p>
              <hr />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 offset-md-2 card">
          {scripts &&
            scripts.scripts &&
            scripts.scripts.map(
              (
                {
                  number,
                  question,
                  yourAnswer,
                  clue,
                  possibleAnswers,
                  mediaType,
                  mediaUrl,
                  isCorrect,
                },
                index
              ) => {
                return (
                  <div key={index}>
                    <div className="question-panel">
                      <div>{number}).</div>
                      <div
                        className="question-divs"
                        dangerouslySetInnerHTML={setHtml(question)}
                      />
                    </div>

                    {isCorrect === true ? (
                      <p className="answer">
                        <span>
                          your answer :
                          <span className="text-success space-well">
                            {yourAnswer === "" ? "did not answer" : yourAnswer}
                          </span>
                          <span
                            style={{ fontSize: 20 + "px" }}
                            className="float-right text-success"
                          >
                            &#10004;
                          </span>
                        </span>
                        <br />
                      </p>
                    ) : (
                      <p className="answer">
                        <React.Fragment>
                          <span>
                            your answer :{" "}
                            <span className="text-danger space-well">
                              {yourAnswer === ""
                                ? "did not answer"
                                : yourAnswer}
                            </span>
                            <span
                              style={{ fontSize: 20 + "px" }}
                              className="float-right text-danger"
                            >
                              &#10006;
                            </span>
                          </span>
                          <br />
                        </React.Fragment>
                      </p>
                    )}
                    <p className="left">
                      Possible answers :
                      {possibleAnswers.map((ans) => {
                        return (
                          <span className="possible-span">
                            <b>
                              <i>{ans}</i>
                            </b>
                            ,{" "}
                          </span>
                        );
                      })}
                    </p>
                    {clue && (
                      <p className="left">
                        Clue :{" "}
                        <b>
                          <i>{clue}</i>
                        </b>
                      </p>
                    )}
                    <p>
                      {mediaType === "image" && (
                        <ImageComponent src={`${baseUrl}/${mediaUrl}`} />
                      )}
                    </p>

                    <hr />
                  </div>
                );
              }
            )}
        </div>
      </div>
    </DisplayEssayScriptStyles>
  );
};

export default DisplayEssayScriptComponent;
