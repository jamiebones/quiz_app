import React from "react";
import styled from "styled-components";
import moment from "moment";

const DisplayQuizScriptComponentStyles = styled.div`
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
    display: flex;
    font-size: 16px;
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
`;

const setHtml = (html) => {
  return { __html: html };
};

const DisplayScriptComponent = ({ scripts }) => {
  return (
    <DisplayQuizScriptComponentStyles>
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
                {scripts.scripts.map(
                  (
                    {
                      number,
                      selectedOption,
                      correctOption,
                      explanation,
                      question,
                    },
                    index
                  ) => {
                    let gotTheAnswer;

                    if (selectedOption) {
                      if (selectedOption == correctOption) {
                        gotTheAnswer = true;
                      }
                    }
                    return (
                      <div key={index}>
                        <div className="question-panel">
                          <div>{number}).</div>
                          <div
                            className="question-divs"
                            dangerouslySetInnerHTML={setHtml(question)}
                          />
                        </div>

                        {gotTheAnswer ? (
                          <p>
                            <span className="text-success">
                              {correctOption}
                              <span style={{ fontSize: 30 + "px" }}>
                                &#10004;
                              </span>
                            </span>
                            <br />
                            <span>{explanation}</span>
                          </p>
                        ) : (
                          <p>
                            {selectedOption ? (
                              <React.Fragment>
                                <span className="text-danger">
                                  selected answer : {selectedOption}
                                  <span style={{ fontSize: 30 + "px" }}>
                                    &#10006;
                                  </span>
                                </span>
                                <br />
                                <span className="text-success">
                                  correct answer : {correctOption}
                                </span>
                                <br />
                                <span>{explanation}</span>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <span>
                                  you did not select any option{" "}
                                  <span
                                    className="text-danger"
                                    style={{ fontSize: 20 + "px" }}
                                  >
                                    &#10006;
                                  </span>
                                </span>
                                <br />
                                <span className="text-success">
                                  correct answer : {correctOption}
                                </span>
                                <br />
                                <span>{explanation}</span>
                              </React.Fragment>
                            )}
                          </p>
                        )}

                        <hr />
                      </div>
                    );
                  }
                )}
              </React.Fragment>
            )
            /* end of scripts matter here */
          }
        </div>
      </div>
    </DisplayQuizScriptComponentStyles>
  );
};

export default DisplayScriptComponent;
