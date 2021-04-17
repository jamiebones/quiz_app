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
  const currentUser = useRecoilValue(state.currentLoginUserState);
  const [user, setUser] = useState(null);
  const storedData = store.get("questionData");
  const { examName, examType, examDuration } = store.get("examDetails");
  let examId = match.params.examId;

  const history = useHistory();

  //effect to build up the questions
  useEffect(() => {
    const questionData = buildUpQuestions(questionsFromStore);
    setUser(currentUser);
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
      store.remove("examStarted");
      store.remove("examQuestions");
      store.remove("currentIndex");
      store.remove("duration");
      store.remove("examId");
      store.remove("questionData");
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
        user: user,
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

  return (
    <EssayExamQuestionComponentStyles>
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <p className="exam-label">
            Examination Name:
            <span className="exam-span">
              <b>{examName && examName.toUpperCase()}</b>
            </span>
          </p>

          <p className="exam-label">
            Examination Type:
            <span className="exam-span">
              <b>{examType && examType.toUpperCase()}</b>
            </span>
          </p>

          <p className="exam-label">
            Exam Duration:
            <span className="exam-span">
              <b>{methods.Utils.ConvertMinutesToHours(examDuration)}</b>
            </span>
          </p>
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
              onClick={submitQuizHandler}
            >
              {submitting
                ? "submitting please wait"
                : "Submit Examination"}
            </button>
          </div>
        </div>
      </div>
    </EssayExamQuestionComponentStyles>
  );
};

export default EssayExamQuestionComponent;
