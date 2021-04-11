import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/client";
import { GetAllScheduleExamination } from "../graphql/queries";
import { UpdateExaminationSchedule } from "../graphql/mutation";
import Loading from "../common/loading";
import methods from "../methods";

const ActivateStyles = styled.div``;

const ActivateScheduleExaminationPanel = ({ history }) => {
  const [scheduleExams, setScheduleExams] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState(null);
  const { loading, data, error } = useQuery(GetAllScheduleExamination);
  const [nodata, setNoData] = useState(null);

  //make schedule active or inactive
  const [changeStatusFunc, changeStatusResult] = useMutation(
    UpdateExaminationSchedule
  );

  useEffect(() => {
    if (changeStatusResult.data) {
      const result = changeStatusResult.data.changeExamStatus.__typename;
      if (result == "Error") {
        setErrors(changeStatusResult.data.changeExamStatus.message);
      }
      setProcessing(!processing);
    }

    if (changeStatusResult.error) {
      setErrors(changeStatusResult.error);
      setProcessing(!processing);
    }
  }, [changeStatusResult.data, changeStatusResult.error]);

  useEffect(() => {
    if (data) {
      const scheduleData = data.getAllExamSchedule;
      if (scheduleData.length > 0) {
        setScheduleExams(scheduleData);
      } else {
        setNoData(true);
      }
    }

    if (error) {
      setErrors(error);
    }
  }, [loading, data, error]);

  const handleActiveExaminationChangeState = async ({ id, status }) => {
    try {
      setProcessing(!processing);
      await changeStatusFunc({
        variables: {
          examId: id,
          status: !status,
        },
        refetchQueries: [
          {
            query: GetAllScheduleExamination,
          },
        ],
      });
    } catch (error) {}
  };
  return (
    <ActivateStyles>
      <div className="row">
        <div className="col-md-12">
          <h3 className="text-center text-primary">
            Activate Examination Panel
          </h3>
          {loading && (
            <div className="text-center">
              <Loading />
            </div>
          )}

          {errors && (
            <p className="text-center lead text-danger">{errors.message}</p>
          )}

          {nodata && <p className="lead text-center">No data avaliable..</p>}

          {scheduleExams.length > 0 && (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">S/N</th>
                    <th scope="col">Exam Schedule</th>
                    <th scope="col">Course Type</th>
                    <th scope="col">Exam Type</th>
                    <th scope="col">Details</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {scheduleExams.map(
                    (
                      {
                        id,
                        active,
                        numberofQuestions,
                        examinationName,
                        examinationDuration,
                        questions,
                        examTypeName,
                        questionType
                      },
                      index
                    ) => {
                      return (
                        <tr key={id}>
                          <td>
                            <p>{index + 1}</p>
                          </td>
                          <td>
                            <p>{examinationName.toUpperCase()}</p>
                          </td>
                          <td>
                            <p>{examTypeName.toUpperCase()}</p>
                          </td>
                          <td>
                            <p>{questionType.toUpperCase()}</p>
                          </td>
                          <td>
                            <p>Questions saved : {questions.length}</p>
                            <p>
                              Duration :{" "}
                              {methods.Utils.ConvertMinutesToHours(
                                examinationDuration
                              )}
                            </p>
                            <p>Number of Questions: {numberofQuestions}</p>
                          </td>
                          <td>
                            {active ? (
                              <p className="text-success">Active</p>
                            ) : (
                              <p className="text-danger">Not Active</p>
                            )}
                          </td>
                          <td>
                            {active ? (
                              <button
                                disabled={processing}
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleActiveExaminationChangeState({
                                    id,
                                    status: active,
                                  })
                                }
                              >
                                {!processing
                                  ? "make inactive"
                                  : "please wait...."}
                              </button>
                            ) : numberofQuestions == questions.length ? (
                              /* we can activate the exam here else go add questions*/
                              <button
                                disabled={processing}
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleActiveExaminationChangeState({
                                    id,
                                    status: active,
                                  })
                                }
                              >
                                {!processing
                                  ? "make active"
                                  : "please wait...."}
                              </button>
                            ) : (
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() =>
                                  history.push("/add_questions_examination")
                                }
                              >
                                complete exam questions
                              </button>
                            )}
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
    </ActivateStyles>
  );
};

export default ActivateScheduleExaminationPanel;
