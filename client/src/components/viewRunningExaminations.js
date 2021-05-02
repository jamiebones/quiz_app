import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GetRunningExamination } from "../graphql/queries";
import { CancelExamination } from "../graphql/mutation";
import Loading from "../common/loading";
import methods from "../methods";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const ViewRunningExamination = () => {
  const [examRunning, setExamRunning] = useState([]);
  const { data, error, loading } = useQuery(GetRunningExamination);
  const [noData, setNoData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [cancelExamFunction, cancelExamResult] = useMutation(CancelExamination);

  useEffect(() => {
    if (cancelExamResult.data) {
      window.alert("successful");
      setSubmitted(false);
    }
    if (cancelExamResult.error) {
      setSubmitted(false);
      setErrors(error.message);
    }
  }, [cancelExamResult.data, cancelExamResult.error]);

  useEffect(() => {
    if (data) {
      const examData = data.getRunningExamination;
      if (examData.length > 0) {
        setExamRunning(examData);
        setNoData(false);
      } else {
        setNoData(true);
        setExamRunning([]);
      }
    }
    if (error) {
      setErrors(error.message);
    }
  }, [data, error]);

  const handleCancelExamination = async (examId) => {
    const confirmCancel = window.confirm(
      "You are about cancelling an examination? Are you sure"
    );
    if (!confirmCancel) return;
    try {
      setSubmitted(true);
      await cancelExamFunction({
        variables: {
          examId,
        },
        refetchQueries: [
          {
            query: GetRunningExamination,
          },
        ],
      });
    } catch (error) {}
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="text-center">
          {loading && <Loading />}
          {errors && <p className="lead text-danger">{error}</p>}
        </div>

        {!loading && noData ? (
          <div className="text-center">
            <h3>No examination currently runing</h3>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Canidate details</th>
                  <th scope="col">Exam Details</th>
                  <th scope="col">Time Elapsed</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {examRunning.map(
                  (
                    {
                      id,
                      timeExamStarted,
                      canidateDetails: { username, name },
                      examDetails: {
                        examinationName,
                        numberOfQuestions,
                        duration,
                      },
                    },
                    index
                  ) => {
                    return (
                      <tr key={id}>
                        <td>{index + 1}</td>

                        <td>
                          <p>
                            username: <span>{username.toUpperCase()}</span>
                          </p>
                          <p>
                            name: <span>{name.toUpperCase()}</span>
                          </p>
                        </td>

                        <td>
                          <p>
                            <span>
                              Examination name: {examinationName.toUpperCase()}
                            </span>
                            <br />
                            <span>
                              Number of questions: {numberOfQuestions}
                            </span>
                            <br />
                            <span>
                              Duration :{" "}
                              {methods.Utils.ConvertMinutesToHours(duration)}
                            </span>
                            <br />
                          </p>
                        </td>

                        <td>{dayjs(timeExamStarted).from(dayjs())}</td>

                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={submitted}
                            onClick={() => handleCancelExamination(id)}
                          >
                            {submitted ? "cancelling exam...." : "cancel exam"}
                          </button>
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
  );
};

export default ViewRunningExamination;
