import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CountDownTimer from "./countDownTimer";
import { useMutation } from "@apollo/client";
import { EssayExaminationEnded } from "../graphql/mutation";
import store from "store";
import methods from "../methods";
import Modal from "react-modal";
import { useParams, useNavigate } from "react-router-dom";
import EssayQuestionComponent from "../common/essayQuestionComponent";
import QuestionNumberDiv from "../common/questionNumberDiv";
import { useExamDetails } from "../context";

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
    (
      { question, clue, mediaUrl, mediaType, possibleAnswers, textBox },
      index
    ) => {
      let questionObject = {
        number: index + 1,
        question,
        clue,
        mediaUrl,
        mediaType,
        possibleAnswers,

        textBox: textBox
          ? textBox
          : {
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
  const navigate = useNavigate();
  const { examId } = useParams();
  const { examStarted, duration, examQuestions, setExamQuestions } =
    useExamDetails();
  const [examinationEndedFunction, examinationEndedResult] = useMutation(
    EssayExaminationEnded
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(null);
  const questionsFromStore = store.get("examQuestions");
  const examStartedinStore = store.get("examStarted");
  const [scoreDetails, setScoreDetails] = useState(null);
  const [questionBuilt, setQuestionBuilt] = useState(false);
  const { examName, examType, examDuration } = store.get("examDetails");

  const questions = examQuestions.length ? examQuestions : questionsFromStore;
  const examTimer = duration ? duration : examDuration;
  const examHasStarted = examStarted ? examStarted : examStartedinStore;

  //effect to build up the questions
  useEffect(() => {
    const questionData = buildUpQuestions(questions);
    setExamQuestions(questionData);
    store.set("examQuestions", questionData);
    setQuestionBuilt(true);
  }, []);

  useEffect(() => {
    if (!examId) {
      navigate("/exam_start_page");
    }
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
      navigate(`/exam_summary/essay/${examId}`, {
        state: { scoreDetails: scoreDetails },
        replace: true,
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
    const storedData = store.get("examQuestions");
    const copyExamQuestions = [...examQuestions];
    const copyDataFromStore = [...storedData];
    const questions = copyExamQuestions?.length
      ? copyExamQuestions
      : copyDataFromStore;

    const currentQuestion = questions[index];
    //fix the stuff here please
    currentQuestion.textBox = {
      value,
      hasAnswered: value.length > 0 ? true : false,
    };
    questions[index] = currentQuestion;
    store.set("examQuestions", questions);
    setExamQuestions(questions);
  };

  const submitQuizHandler = async () => {
    //get the quiz answers and the other variables in the system
    if (examHasStarted && examId) {
      //we are good we can gather things here
      const { total, scripts } = methods.MarkEssayExam(questions);
      setScoreDetails({
        score: total,
        totalQuestions: scripts.length,
        examId: examId,
      });
      const submissionObject = {
        examTakenId: examId,
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
                <b>{methods.Utils.ConvertMinutesToHours(examTimer)}</b>
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
          {questionBuilt && <QuestionNumberDiv questionsArray={questions} />}
        </div>
      </div>

      <div className="row">
        <div className="col-md-10 offset-md-1">
          {questionBuilt &&
            questions &&
            questions.map(
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
