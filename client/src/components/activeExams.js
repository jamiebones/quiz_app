import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { GetActiveExamination } from "../graphql/queries";
import { StartExamination } from "../graphql/mutation";
import { useRecoilState, useRecoilValue } from "recoil";
import state from "../applicationState";
import Loading from "../common/loading";
import store from "store";
import Modal from "react-modal";
Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ActiveExamStyles = styled.div`
  .div-panel {
    padding: 20px;
    color: #fff;
    background: #2a8e86;
    min-height: 200px;
    margin-bottom: 20px;
  }
  p {
    font-size: 18px;
  }
  span {
    font-size: 16px;
    color: #010605;
    padding: 10px;
  }
  .m {
    flex-direction: row;
  }
`;

const convertMinutesToHours = (minutesToConvert) => {
  const hours = Math.floor(minutesToConvert / 60);
  const minutes = minutesToConvert - hours * 60;
  if (hours == 0) {
    return `${minutes} minutes`;
  }
  return `${hours} hours ${minutes} minutes`;
};

const ActiveExams = ({ history }) => {
  const [activeExams, setActiveExams] = useState([]);
  const [errors, setError] = useState(null);
  const { loading, error, data } = useQuery(GetActiveExamination);
  const [processing, setProcessing] = useState(false);
  const [examQuestions, setExamQuestions] = useRecoilState(
    state.questionsState
  );
  const [duration, setDuration] = useRecoilState(state.examDurationState);
  const currentLoginUser = useRecoilValue(state.currentLoginUserState);
  const [examStarted, setExamStarted] = useRecoilState(
    state.currentLoginUserState
  );
  const [startExaminationFunction, startExaminationResult] = useMutation(
    StartExamination
  );

  const [examProcessing, setExamProcessing] = useState(false);

  //useeffect of start exam function

  useEffect(() => {
    if (startExaminationResult.data) {
      if (
        startExaminationResult.data.startExam.__typename == "ExamTakenSuccess"
      ) {
        //we are successful here we need to save everything here
        const { examId, questionType } = startExaminationResult.data.startExam;
        setExamStarted(true);
        //persists it to store here
        store.set("examStarted", true);
        store.set("examQuestions", examQuestions);
        store.set("currentIndex", 0);
        store.set("duration", duration);
        store.set("examId", examId);
        store.set("totalQuestions", examQuestions.length);
        setExamProcessing(!examProcessing);
        switch (questionType) {
          case "multiple choice questions":
            history.replace(`/exam/multi_choice/${examId}`);
            break;
          case "spelling examination":
            history.replace(`/exam/spelling/${examId}`);
            break;
          case "short answer exam":
            history.replace(`/exam/short_essay/${examId}`);
            break;
          case "essay exam":
            break;
          case "quantitative exam":
            break;
        }
      } else if (startExaminationResult.data.startExam.__typename == "Error") {
        const errorObj = startExaminationResult.data.startExam;
        setError(errorObj);
        setExamProcessing(!examProcessing);
      }
    }

    if (startExaminationResult.loading) {
      setExamProcessing(!examProcessing);
    }

    if (startExaminationResult.error) {
      setError(startExaminationResult.error.message);
      setExamProcessing(!examProcessing);
    }
  }, [
    startExaminationResult.data,
    startExaminationResult.error,
    startExaminationResult.loading,
  ]);

  useEffect(() => {
    if (error) {
      setError(error);
      setProcessing(!processing);
    }
    if (loading) {
      setProcessing(!processing);
    }

    if (data) {
      const examination = data && data.activeExamination;
      setProcessing(!processing);
      setActiveExams(examination);
    }
  }, [data, loading, error]);

  const startExamination = async (
    e,
    { id, questions, examinationDuration, examinationName, questionType }
  ) => {
    e.preventDefault();
    setExamQuestions(questions);
    setDuration(examinationDuration);
    store.set("examDetails", {
      examName: examinationName,
      examType: questionType,
      examDuration: examinationDuration,
    });
    //get the canidate details from the currentLoginUser
    if (!currentLoginUser) {
      return alert("How did we get here please login.");
    }

    const examDetails = {
      examDetails: {
        examinationName,
        examinationId: id,
        numberOfQuestions: +questions.length,
        duration: +examinationDuration,
      },
      timeExamStarted: new Date(),
      canidateDetails: {
        username: currentLoginUser.username,
        name: currentLoginUser.name,
      },
      examStarted: true,
      examFinished: false,
      questionType,
    };

    try {
      await startExaminationFunction({
        variables: {
          examDetails: examDetails,
        },
      });
    } catch (error) {}
  };
  return (
    <ActiveExamStyles>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">{processing && <Loading />}</div>

          {errors && (
            <p className="lead text-center text-danger">{errors.message}</p>
          )}
        </div>
      </div>
      {activeExams && activeExams.length > 0 ? (
        <div className="row">
          {activeExams.map(
            ({
              id,
              numberofQuestions,
              examinationName,
              examinationDuration,
              questions,
              questionType,
            }) => {
              return (
                <div className="col-md-3" key={id}>
                  <div className="div-panel">
                    <p>
                      Examination :{" "}
                      <b>
                        <span>
                          {examinationName && examinationName.toUpperCase()}
                        </span>
                      </b>
                    </p>
                    <p>
                      Number of Questions:{" "}
                      <span>
                        <b>{numberofQuestions}</b>
                      </span>
                    </p>
                    <p>
                      Duration :{" "}
                      <span>
                        <b>
                          {examinationDuration &&
                            convertMinutesToHours(examinationDuration)}{" "}
                        </b>
                      </span>
                    </p>

                    <p>
                      Examination Type :{" "}
                      <span>
                        <b>{questionType.toUpperCase()}</b>
                      </span>
                    </p>
                    <div className="text-center">
                      <button
                        className="btn btn-warning"
                        onClick={(e) =>
                          startExamination(e, {
                            questions,
                            examinationDuration,
                            examinationName,
                            id,
                            questionType,
                          })
                        }
                      >
                        Start Examination
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div>
          <p className="lead text-info text-center">
            No active examination at the moment
          </p>
        </div>
      )}

      <Modal
        isOpen={examProcessing}
        style={customStyles}
        contentLabel="Examination starting modal"
      >
        <p>
          Instructions
          <span>Relax as we get you all started with your exams</span>
        </p>
        <p>Please wait.....</p>
      </Modal>
    </ActiveExamStyles>
  );
};

export default ActiveExams;
