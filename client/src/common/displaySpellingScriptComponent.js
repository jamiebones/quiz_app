import React from "react";
import styled from "styled-components";
import moment from "moment";

const DisplaySpellingQuizScriptComponentStyles = styled.div`
  p {
    font-size: 18px;
  }
  .question {
    font-size: 16px;
  }
  span {
    padding-left: 50px;
  }
  .question-panel {
    font-size: 18px;
    margin-bottom: 0px;
    padding-bottom: 0px;
    span {
      letter-spacing: 20px;
      padding: 3px 30px;
    }
  }
  .question-divs {
    padding-left: 20px;
  }
  .details {
    background-color: #0b2f27;
    color: #fff;
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
  .space-well {
    letter-spacing: 20px;
  }
`;

const DisplaySpellingScriptComponent = ({ scripts }) => {
  return (
    <DisplaySpellingQuizScriptComponentStyles>
      <div className="row">
        <div className="col-md-12">
          {
            scripts && (
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
                <div className="row">
                  <div className="col-md-8 offset-md-2 card">
                    {scripts.scripts.map(
                      (
                        { number, clue, word, answeredWord, correctWord },
                        index
                      ) => {
                        return (
                          <div key={index}>
                            <div className="question-panel">
                              <p>
                                {number + 1}).
                                <span>{word}</span>
                              </p>
                            </div>

                            {answeredWord.toUpperCase() ===
                            correctWord.toUpperCase() ? (
                              <p>
                                <span>
                                  your answer :
                                  <span className="text-success space-well">
                                    {answeredWord}
                                  </span>
                                  <span
                                    style={{ fontSize: 20 + "px" }}
                                    className="float-right text-success"
                                  >
                                    &#10004;
                                  </span>
                                </span>
                                <br />
                                <span>Clue : {clue}</span>
                              </p>
                            ) : (
                              <p>
                                <React.Fragment>
                                  <span>
                                    your answer :{" "}
                                    <span className="text-danger space-well">
                                      {answeredWord}
                                    </span>
                                    <span
                                      style={{ fontSize: 20 + "px" }}
                                      className="float-right text-danger"
                                    >
                                      &#10006;
                                    </span>
                                  </span>
                                  <br />
                                  <span >
                                    right answer :{" "}
                                    <span className="space-well text-success">
                                      {correctWord}
                                    </span>
                                  </span>
                                  <br />
                                  <span>clue: {clue}</span>
                                </React.Fragment>
                              </p>
                            )}

                            <hr />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </React.Fragment>
            )
            /* end of scripts matter here */
          }
        </div>
      </div>
    </DisplaySpellingQuizScriptComponentStyles>
  );
};

export default DisplaySpellingScriptComponent;
