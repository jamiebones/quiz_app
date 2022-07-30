import React from "react";
import styled from "styled-components";
import store from "store";
import { useExamDetails } from "../context";

const QuestionButtonComponentStyles = styled.div`
  button {
    margin: 10px;
  }
`;

const QuestionButtonComponent = ({ submitQuiz }) => {
  const {
    examQuestions,
    currentIndex,
    setCurrentIndex,
    setSkippedQuestion,
  } = useExamDetails();
  //get total questions from the stored questions
  const questionsTotalFromStore = store.get("totalQuestions");
  let totalQuestion = examQuestions.length ? examQuestions.length : questionsTotalFromStore;

  const handleSkippedQuestion = () => {
    setSkippedQuestion((skippedArray) => {
      const findSkipped = skippedArray.some((val) => +val == currentIndex);
      return findSkipped ? skippedArray : [...skippedArray, currentIndex];
    });
    if (currentIndex < totalQuestion) {
      //skipped forward
      store.set("currentIndex", +currentIndex + 1);
      setCurrentIndex(+currentIndex + 1);
    } else {
      //start at the beginning
      store.set("currentIndex", 0);
      setCurrentIndex(0);
    }
  };

  const handleCurrentIndexChange = (value) => {
    if (value === "increment") {
      store.set("currentIndex", +currentIndex + 1);
      setCurrentIndex(+currentIndex + 1);
    } else if (value === "decrement") {
      store.set("currentIndex", +currentIndex - 1);
      setCurrentIndex(+currentIndex - 1);
    }
  };
  const handleExaminationSubmission = (e) => {
    e.preventDefault();
    const confirmSubmission = window.confirm(
      "Are you sure you want to submit. Please review your work. If you are sure click yes"
    );
    if (!confirmSubmission) return;
    submitQuiz();
  };
  return (
    <QuestionButtonComponentStyles>
      <button
        type="button"
        className="btn btn-primary"
        disabled={currentIndex == 0}
        onClick={() => handleCurrentIndexChange("decrement")}
      >
        Previous Question
      </button>
      <button
        type="button"
        className="btn btn-warning"
        disabled={currentIndex == totalQuestion - 1}
        onClick={() => handleCurrentIndexChange("increment")}
      >
        Next Question
      </button>
      <button
        type="button"
        className="btn btn-danger"
        disabled={currentIndex == totalQuestion - 1}
        onClick={handleSkippedQuestion}
      >
        Skip Question
      </button>
      <button
        type="button"
        className="btn btn-success"
        onClick={handleExaminationSubmission}
      >
        Submit
      </button>
    </QuestionButtonComponentStyles>
  );
};

export default QuestionButtonComponent;
