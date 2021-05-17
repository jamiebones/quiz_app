import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  AutoGenerateQuestions,
  AutoGenerateSpellingQuestions,
} from "../graphql/queries";
import {
  AddQuestionsToScheduleExamination,
  AddSpellingQuestionsArrayToScheduleExam,
} from "../graphql/mutation";
import styled from "styled-components";
import LoadQuestionsComponent from "../common/loadQuestionsComponent";
import ExaminationTypeComponent from "../common/examinationTypeComponent";

const AddQuestionStyles = styled.div`
  .div-details {
    margin: 20px 0px;
  }
  .question-divs {
    padding-left: 10px;
    cursor: pointer;
  }

  .div-question-details {
    display: flex;
    padding: 10px;
    font-size: 16px;
  }
  .exam-details {
    background: #02291c;
    text-align: center;
    padding: 20px;
    color: #fff;
  }
`;

const setHtml = (html) => {
  return { __html: html };
};

const AddQuestionsToExaminationComponent = () => {
  const [errors, setErrors] = useState(null);
  const [examType, setExamType] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [examData, setExamData] = useState(null);
  const [loadQuestion, setLoadQuestion] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [autoProcessing, setAutoProcessing] = useState(false);
  const [scheduleArray, setScheduleArray] = useState([]);
  const [examScheduleDetails, setExamScheduleDetails] = useState(null);

  //auto generate multi choice questions
  const [autoGenerateFunc, autoGenResult] = useLazyQuery(
    AutoGenerateQuestions,
    {
      variables: {
        examId: examData && examData.examId,
        number: examScheduleDetails && examScheduleDetails.numberofQuestions,
      },
    }
  );

  //auto generate spelling questions
  const [autoGenerateSpellingFunc, autoGenSpellingResult] = useLazyQuery(
    AutoGenerateSpellingQuestions,
    {
      variables: {
        examId: examData && examData.examId,
        number: examScheduleDetails && examScheduleDetails.numberofQuestions,
      },
    }
  );
  //add multi choice questions to exam
  const [addQuestionToExamination, addQuestionsToExamResult] = useMutation(
    AddQuestionsToScheduleExamination
  );

  //add multi spelling mutation questions to exam
  const [
    addSpellingQuestionToExam,
    addSpellingQuestionsToExamResult,
  ] = useMutation(AddSpellingQuestionsArrayToScheduleExam);

  //auto generate multi choice effect questions
  useEffect(() => {
    if (autoGenResult.data) {
      //set the questions selected here
      const autoQuestions = autoGenResult.data.autoGenQuestions;
      setAutoProcessing(false);
      setSelectedQuestion(autoQuestions);
    }
    if (autoGenResult.error) {
      setErrors(autoGenResult.error);
      setAutoProcessing(false);
    }
  }, [autoGenResult.data, autoGenResult.error]);

  //auto generate spellings effect questions
  useEffect(() => {
    if (autoGenSpellingResult.data) {
      //set the questions selected here
      const autoQuestions = autoGenSpellingResult.data.autoGenSpellingQuestions;
      setAutoProcessing(false);
      setSelectedQuestion(autoQuestions);
    }
    if (autoGenSpellingResult.error) {
      setErrors(autoGenSpellingResult.error);
      setAutoProcessing(false);
    }
  }, [autoGenSpellingResult.data, autoGenSpellingResult.error]);

  //add multi choice question to exam mutation
  useEffect(() => {
    if (addQuestionsToExamResult.error) {
      setProcessing(false);
      setSubmitted(false);
      setErrors(addQuestionsToExamResult.error.message);
    }
    if (
      addQuestionsToExamResult.data &&
      addQuestionsToExamResult.data.addQuestionsToExam
    ) {
      setProcessing(false);
      setSubmitted(false);
      window.alert("questions added successfully");
    }
  }, [addQuestionsToExamResult.error, addQuestionsToExamResult.data]);

  //add spelling questions to exam mutation
  useEffect(() => {
    if (addSpellingQuestionsToExamResult.error) {
      setProcessing(false);
      setSubmitted(false);
      setErrors(addSpellingQuestionsToExamResult.error.message);
    }

    if (
      addSpellingQuestionsToExamResult.data &&
      addSpellingQuestionsToExamResult.data.addSpellingQuestionsToExam
    ) {
      setSubmitted(false);
      setProcessing(false);
      window.alert("questions added successfully");
    }
  }, [
    addSpellingQuestionsToExamResult.error,
    addSpellingQuestionsToExamResult.data,
  ]);

  const handleLoadQuestions = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadQuestion(!loadQuestion);
    setQuestionLoading(!questionLoading);
  };

  const handleQuestionClick = (question) => {
    const selectedQuestionLength = selectedQuestion.length;
    const totalQuestion = examScheduleDetails.numberofQuestions;
    const findQuestion = selectedQuestion.some((ques) => {
      return ques.id == question.id;
    });

    if (findQuestion) {
      return;
    }
    if (selectedQuestionLength < totalQuestion) {
      //add the question to the question array
      //check if the question has been saved before
      setSelectedQuestion((questions) => {
        return [...questions, question];
      });
    } else {
      //remove the last item and append the new question
      const oldItems = [...selectedQuestion];
      oldItems.pop();
      oldItems.push(question);
      setSelectedQuestion(oldItems);
    }
  };

  const removeQuestionFromQuestionArray = (id) => {
    const remainQuestion = selectedQuestion.filter((ele) => ele.id !== id);
    setSelectedQuestion(remainQuestion);
  };

  const handleSubmitQuestion = async () => {
    if (examScheduleDetails.numberofQuestions > selectedQuestion.length) {
      //we have not selected the complete questions
      return window.alert(
        `Please complete the questions. You have ${
          examScheduleDetails.numberofQuestions - selectedQuestion.length
        } questions left to add to the examination. `
      );
    }

    switch (examType) {
      case "multiple choice questions":
        const arrayOfQuestions = selectedQuestion.map(
          ({
            explanation,
            answers,
            examId,
            examinationType,
            questionImageUrl,
            question,
            id,
          }) => {
            const questionObj = {
              answers,
              examId: examId,
              examinationType,
              explanation,
              question,
              questionImageUrl,
              id,
            };
            return questionObj;
          }
        );
        try {
          setSubmitted(true);
          await addQuestionToExamination({
            variables: {
              questionsArray: arrayOfQuestions,
              scheduleId: examScheduleDetails.id,
            },
          });
          break;
        } catch (error) {
          console.log(error);
        }

      case "spelling examination":
        const arrayOfSpellingQuestions = selectedQuestion.map(
          ({ word, correctWord, examId, examinationType, clue, id }) => {
            const questionObj = {
              word,
              correctWord,
              examId,
              examinationType,
              clue,
              id,
            };
            return questionObj;
          }
        );
        try {
          setSubmitted(true);
          await addSpellingQuestionToExam({
            variables: {
              questionsArray: arrayOfSpellingQuestions,
              scheduleId: examScheduleDetails.id,
            },
          });
          break;
        } catch (error) {
          console.log(error);
        }
    }
  };

  const autoGenerateQuestionsToAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const examId = examData && examData.examId;
    const number = examScheduleDetails && examScheduleDetails.numberofQuestions;
    if (examId && number) {
      
      switch (examType) {
        case "multiple choice questions":
          setAutoProcessing(true);
          autoGenerateFunc();
          break;
        case "spelling examination":
          setAutoProcessing(true);
          autoGenerateSpellingFunc();
          break;
      }
    }
  };

  const selectedExamTypeFunc = (examType) => {
    //clear everything before setting
    setExamData(null);
    setExamScheduleDetails(null);
    setScheduleArray([]);
    setSelectedQuestion([]);
    setExamType(examType);
  };

  const selectedExamFunc = ({ examId, examName, examSchedules }) => {
    setExamData({
      examId,
      examName,
      examSchedules,
    });
    if (examSchedules) {
      setScheduleArray(examSchedules);
      setSelectedQuestion([]);
    } else {
      setScheduleArray([]);
    }
  };

  const handleScheduleExamChange = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    //filter and find the selected details
    const selectedSchedule = scheduleArray.find((e) => e.id === value);
    if (selectedSchedule) {
      setSelectedQuestion(selectedSchedule.questions);
    }
    setExamScheduleDetails(selectedSchedule);
    //query for the details of the selected paper
    //if we already have questions load the selected questions array here
  };

  return (
    <AddQuestionStyles>
      <div className="row justify-content-center">
        <div className="col-sm-6 col-md-4">
          <h4 className="text-center">Add Question to Examination</h4>

          <ExaminationTypeComponent
            selectedExamTypeFunc={selectedExamTypeFunc}
            selectedExamNameFunc={selectedExamFunc}
            display={1}
          />

          <select className="form-control" onChange={handleScheduleExamChange}>
            <option value="0">select examination </option>

            {scheduleArray.map(({ id, examinationName }) => {
              return (
                <option key={id} value={id}>
                  {examinationName}
                </option>
              );
            })}
          </select>

          {examScheduleDetails && (
            <div className="div-details">
              <div className="exam-details">
                <p className="lead">
                  <span>{examScheduleDetails.examinationName}</span>
                </p>
                <p className="lead">
                  Total Questions :{" "}
                  <span>{examScheduleDetails.numberofQuestions}</span>
                </p>

                <p className="lead">
                  Examination Duration :{" "}
                  <span>{examScheduleDetails.examinationDuration} minutes</span>
                </p>

                <p className="lead">
                  Questions Added :{" "}
                  <span>{examScheduleDetails.questions.length}</span>
                </p>
              </div>

              <div
                className="button-div text-center"
                onClick={handleLoadQuestions}
              >
                <button className="btn btn-success">
                  Manually Add Questions
                </button>

                <button
                  disabled={autoProcessing}
                  className="btn btn-info m-2"
                  onClick={autoGenerateQuestionsToAdd}
                >
                  {autoProcessing
                    ? "auto selecting questions"
                    : "Auto Add Questions"}
                </button>
              </div>

              {examScheduleDetails && questionLoading && (
                <React.Fragment>
                  <h5 className="text-center">Questions</h5>
                  <LoadQuestionsComponent
                    examId={examData && examData.examId}
                    handleQuestionClick={handleQuestionClick}
                    examType={examType}
                  />
                </React.Fragment>
              )}
            </div>
          )}
        </div>

        <div className="col-md-4 offset-md-2">
          {selectedQuestion && selectedQuestion.length > 0 && (
            <p className="text-center lead">
              Remaining questions:{" "}
              {examScheduleDetails &&
                examScheduleDetails.numberofQuestions -
                  +selectedQuestion.length}
            </p>
          )}
          {selectedQuestion.length > 0 &&
            selectedQuestion.map(({ word, question, id }, index) => {
              return (
                <div
                  className="div-question-details"
                  key={id}
                  onClick={() => removeQuestionFromQuestionArray(id)}
                >
                  <div>{index + 1}).</div>
                  <div
                    className="question-divs"
                    dangerouslySetInnerHTML={setHtml(question)}
                  />
                  <p>{word}</p>
                </div>
              );
            })}

          {selectedQuestion.length > 0 && (
            <div className="text-center">
              <button
                onClick={handleSubmitQuestion}
                className="btn btn-danger btn-lg"
                disabled={submitted}
              >
                {submitted
                  ? "submitting please wait...."
                  : "Save Question Selection"}
              </button>
            </div>
          )}
        </div>
      </div>
    </AddQuestionStyles>
  );
};

export default AddQuestionsToExaminationComponent;
