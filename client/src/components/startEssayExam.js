import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CountDownTimer from "./countDownTimer";
import state from "../applicationState";
import { useRecoilValue } from "recoil";
import { useMutation } from "@apollo/client";
import { EssayExaminationEnded } from "../graphql/mutation";
import store from "store";
import methods from "../methods";
import Modal from "react-modal";
import { useRouteMatch, useHistory } from "react-router-dom";
import EssayQuestionComponent from "../common/essayQuestionComponent";
import QuestionNumberDiv from "../common/questionNumberDiv";

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

const buildUpQuestions = (questionsArray = []) => {
  let buildArray = [];
  questionsArray.map(
    ({ question, clue, mediaUrl, mediaType, possibleAnswers }, index) => {
      let questionObject = {
        number: index + 1,
        question,
        clue,
        mediaUrl,
        mediaType,
        possibleAnswers,
        textBox: {
          value: "",
          hasAnswered: false,
        },
      };
      buildArray.push(questionObject);
    }
  );
  return buildArray;
};

const disableContext = (e) => {
  //e.preventDefault();
};

const disableButtons = (e) => {
  const code = e.which || e.keyCode;
  switch (code) {
    case 116:
      return e.preventDefault();
    default:
      return true;
  }
};

const EssayExamQuestionComponentStyles = styled.div`
  .exam-span {
    float: right;
  }
  .exam-label {
    font-size: 20px;
  }
  .details {
    background-color: #0b2f27;
    color: #fff;
    padding: 30px;
  }
  .text-name {
    color: #f8f8f5 !important;
  }
  .spanDetails {
    float: right;
    font-weight: bold;
    color: #d28431;
  }
`;

const EssayExamQuestionComponent = () => {
  const match = useRouteMatch("/exam/short_essay/:examId");
  const [examinationEndedFunction, examinationEndedResult] = useMutation(
    EssayExaminationEnded
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(null);
  const [examIdValue, setExamIdValue] = useState(null);
  const examStarted = useRecoilValue(state.examStartedState);
  const questionsFromStore = store.get("examQuestions");
  const examIdinStore = store.get("examId");
  const examStartedinStore = store.get("examStarted");
  const [questions, setQuestionsData] = useState([]);
  const [scoreDetails, setScoreDetails] = useState(null);
  const storedData = store.get("questionData");
  const { examName, examType, examDuration } = store.get("examDetails");
  let examId = match.params.examId;

  const history = useHistory();

  //effect to build up the questions
  useEffect(() => {
    const questionData = buildUpQuestions(questionsFromStore);
    setQuestionsData(questionData);
    const storedData = store.get("questionData");
    if (!storedData) {
      store.set("questionData", questionData);
    }
  }, []);

  useEffect(() => {
    if (!examId) {
      history.push("/exam_start_page");
    }
    setExamIdValue(examId);
  }, [examId]);

  useEffect(() => {
    window.addEventListener("contextmenu", disableContext);
    window.addEventListener("keydown", disableButtons);
    return () => {
      window.removeEventListener("contextmenu", disableContext);
      window.removeEventListener("keydown", disableButtons);
    };
  });

  useEffect(() => {
    const { loading, data, error } = examinationEndedResult;
    if (loading) {
      //show a modal asking them to wait that submission is on going.
    }
    if (data) {
      //redirect here to the summary page
      setSubmitting(!submitting);
      methods.Utils.ClearStoreValue();
      history.replace(`/exam_summary/essay/${examIdValue}`, {
        scoreDetails: scoreDetails,
      });
    }

    if (error) {
      setErrors(error.message);
      setSubmitting(!submitting);
    }
  }, [
    examinationEndedResult.loading,
    examinationEndedResult.data,
    examinationEndedResult.error,
  ]);

  const onChangeText = ({ value, index }) => {
    //update the storedData here and also the hasAnswered variable here
    const storedData = store.get("questionData");
    const dataFromStore = [...storedData];
    const currentItem = dataFromStore[index];
    //fix the stuff here please
    currentItem.textBox = {
      value,
      hasAnswered: value.length > 0 ? true : false,
    };
    dataFromStore[index] = currentItem;
    store.set("questionData", dataFromStore);
    setQuestionsData(dataFromStore);
  };

  const submitQuizHandler = async () => {
    //get the quiz answers and the other variables in the system
    let examStartedVariable, examIdVariable;
    examStartedVariable = examStarted ? examStarted : examStartedinStore;
    examIdVariable = examId ? examId : examIdinStore;
    if (examStartedVariable && examIdVariable) {
      //we are good we can gather things here
      const { total, scripts } = methods.MarkEssayExam(storedData);
      setScoreDetails({
        score: total,
        totalQuestions: scripts.length,
        examId: examIdVariable,
      });
      const submissionObject = {
        examTakenId: examIdVariable,
        examFinished: true,
        timeExamEnded: new Date(),
        score: total,
        scripts,
      };
      try {
        setSubmitting(!submitting);
        await examinationEndedFunction({
          variables: {
            submissionDetails: submissionObject,
          },
        });
      } catch (error) {}
    }
  };

  const handleQuizSubmit = () => {
    const confirmMe = window.confirm("Are you sure, you want to submit");
    if (!confirmMe) return;
    submitQuizHandler();
  };

  return (
    <EssayExamQuestionComponentStyles>
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <div className="details card-title">
            <h2 className="text-center text-name">
              {examName && examName.toUpperCase()}
            </h2>

            <p>
              Examination Type:
              <span className="spanDetails">
                <b>{examType && examType.toUpperCase()}</b>
              </span>
            </p>

            <p>
              Exam Duration:
              <span className="spanDetails">
                <b>{methods.Utils.ConvertMinutesToHours(examDuration)}</b>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-10 offset-md-1">
          <div className="text-center">
            <CountDownTimer submitQuiz={submitQuizHandler} />
          </div>

          <QuestionNumberDiv questionsArray={storedData} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-10 offset-md-1">
          {storedData &&
            storedData.map(
              (
                {
                  number,
                  question,
                  clue,
                  mediaUrl,
                  mediaType,
                  textBox: { value, hasAnswered },
                },
                index
              ) => {
                const data = {
                  number,
                  question,
                  clue,
                  mediaUrl,
                  mediaType,
                  textBox: { value, hasAnswered },
                  onChangeText,
                  index,
                };
                return (
                  <EssayQuestionComponent
                    key={index + number * index + 1}
                    data={data}
                  />
                );
              }
            )}

          <div className="text-center mb-3">
            <button
              className="btn btn-success"
              disabled={submitting}
              onClick={handleQuizSubmit}
            >
              {submitting ? "submitting please wait" : "Submit Examination"}
            </button>
          </div>
        </div>
      </div>
    </EssayExamQuestionComponentStyles>
  );
};

export default EssayExamQuestionComponent;
