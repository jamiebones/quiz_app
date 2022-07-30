import * as React from "react";

const ExamContext = React.createContext();

function ExamProvider({ children }) {
  const [duration, setDuration] = React.useState(0);
  const [examStarted, setExamStarted] = React.useState(false);
  const [examQuestions, setExamQuestions] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [skippedQuestion, setSkippedQuestion] = React.useState([]);

  const value = {
    duration,
    setDuration,
    examStarted,
    setExamStarted,
    examQuestions,
    setExamQuestions,
    currentIndex,
    setCurrentIndex,
    skippedQuestion,
    setSkippedQuestion,
  };
  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

function useExamDetails() {
  const context = React.useContext(ExamContext);
  if (!context) {
    throw new Error("useExamDetails must be used within an ExamProvider");
  }
  return context;
}

export { ExamProvider, useExamDetails };
