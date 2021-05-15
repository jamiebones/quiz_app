import React, { useState, useEffect } from "react";
import SelectExaminationComponent from "../common/selectExaminationComponent";
import { useLazyQuery } from "@apollo/client";
import { GetExaminationResult } from "../graphql/queries";
import Loading from "../common/loading";
import moment from "moment";
import { useHistory } from "react-router-dom";
import methods from "../methods";
import styled from "styled-components";

const ViewExamResultStyles = styled.div`
  .div-selected {
    padding: 20px 0;
    font-size: 20px;
  }
  .exam-details {
    font-size: 20px;
    margin-bottom: 40px;
    padding: 20 0px;
    span {
      float: right;
    }
  }
`;

const ViewExamResult = () => {
  const [examObj, setExamObj] = useState(null);
  const [examScheduleObj, setExamScheduleObj] = useState(null);
  const [errors, setErrors] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [nodata, setNoData] = useState(null);
  const [processing, setProcessing] = useState(false);

  const history = useHistory();

  const [resultQuery, resultQueryData] = useLazyQuery(GetExaminationResult, {
    variables: {
      examScheduleId: examScheduleObj && examScheduleObj.examScheduleId,
    },
  });

  useEffect(() => {
    if (resultQueryData.called && resultQueryData.loading) {
      setProcessing(!processing);
    }
    if (resultQueryData.error) {
      setErrors(resultQueryData.error);
      setProcessing(!processing);
    }

    if (resultQueryData.data) {
      const data = resultQueryData.data.getExamResults;

      if (data.length > 0) {
        setExamResults(data);
        setNoData(false);
      } else {
        setNoData(true);
        setExamResults([]);
      }
      setProcessing(false);
    }
  }, [resultQueryData.loading, resultQueryData.data, resultQueryData.error]);

  const handleExamChange = ({ examId, examName }) => {
    setExamObj({ examId, examName });
  };

  const handleExamScheduleChange = ({ examScheduleId, examScheduleName }) => {
    setExamScheduleObj({
      examScheduleId,
      examScheduleName,
    });
    resultQuery();
  };

  const showScriptPage = ({
    id,
    timeExamStarted,
    examDetails,
    canidateDetails,
    timeExamEnded,
    score,
    scripts,
    questionType,
  }) => {
    switch (questionType) {
      case "multiple choice questions":
        history.push(`/view_canidate_script`, {
          scripts: {
            id,
            timeExamStarted,
            examDetails,
            canidateDetails,
            timeExamEnded,
            score,
            scripts,
          },
        });
        break;

      case "spelling examination":
        history.push(`/view_canidate_spelling_script`, {
          scripts: {
            id,
            timeExamStarted,
            examDetails,
            canidateDetails,
            timeExamEnded,
            score,
            scripts,
          },
        });
        break;
        case "short answer exam":
          history.push(`/view_canidate_essay_script`, {
            scripts: {
              id,
              timeExamStarted,
              examDetails,
              canidateDetails,
              timeExamEnded,
              score,
              scripts,
            },
          });
          break;

      default:
        break;
    }
  };

  return (
    <ViewExamResultStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3 className="text-center text-primary">View Examination Result </h3>
          <SelectExaminationComponent
            examFunc={handleExamChange}
            examTypeFunc={handleExamScheduleChange}
          />

          <div className="div-selected">
            {examObj && (
              <p>Examination Type: {examObj.examName.toUpperCase()}</p>
            )}

            {examScheduleObj && (
              <p>
                Examination Schedule :{" "}
                {examScheduleObj.examScheduleName.toUpperCase()}
              </p>
            )}
            <hr />
          </div>
          <div className="exam-details">
            {examResults.length > 0 && (
              <React.Fragment>
                <p>
                  Examination Name :{" "}
                  <span>
                    {examResults[0].examDetails.examinationName.toUpperCase()}
                  </span>
                </p>
                <p>
                  Duration :{" "}
                  <span>
                    {methods.Utils.ConvertMinutesToHours(
                      examResults[0].examDetails.duration
                    )}
                  </span>
                </p>
                <p>
                  Number of Questions :{" "}
                  <span>{examResults[0].examDetails.numberOfQuestions}</span>
                </p>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 offset-md-2">
          {processing && (
            <div className="text-center">
              <Loading />
            </div>
          )}

          {errors && (
            <div className="text-center">
              <p className="text-center lead text-danger">{errors.message}</p>
            </div>
          )}

          {nodata && (
            <p className="text-center lead">
              no result for the selected examination
            </p>
          )}

          {examResults.length > 0 && (
            <div className="table-responsive card">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">S/N</th>
                    <th scope="col">Canidate Details</th>
                    <th scope="col">Score</th>
                    <th scope="col">Time Spent</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {examResults.map(
                    (
                      {
                        id,
                        timeExamStarted,
                        examDetails,
                        canidateDetails: { username, name },
                        timeExamEnded,
                        score,
                        scripts,
                        questionType,
                      },
                      index
                    ) => {
                      return (
                        <tr key={id}>
                          <td>
                            <p>{index + 1}</p>
                          </td>
                          <td>
                            <p>Name: {name.toUpperCase()}</p>
                            <p>Username: {username}</p>
                          </td>

                          <td>
                            <p>Score: {score}</p>
                          </td>

                          <td>
                            <p>
                              Time started :
                              {moment(timeExamStarted).format(
                                "dddd, MMMM Do YYYY, h:mm:ss a"
                              )}
                            </p>

                            <p>
                              Time ended :
                              {moment(timeExamEnded).format(
                                "dddd, MMMM Do YYYY, h:mm:ss a"
                              )}
                            </p>
                          </td>

                          <td>
                            <p>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  showScriptPage({
                                    id,
                                    timeExamStarted,
                                    examDetails,
                                    canidateDetails: {
                                      username,
                                      name,
                                    },
                                    timeExamEnded,
                                    score,
                                    scripts,
                                    questionType,
                                  })
                                }
                              >
                                view script
                              </button>
                            </p>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ViewExamResultStyles>
  );
};

export default ViewExamResult;
