import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { AutoGenerateEssayQuestions } from "../graphql/queries";
import { AddEssayQuestionsArrayToScheduleExam } from "../graphql/mutation";
import styled from "styled-components";
import LoadEssayQuestionsComponent from "../common/loadEssayQuestionComponent";
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

const AddEssayQuestionsToExam = () => {
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

  //auto generate essay questions
  const [autoGenerateFunc, autoGenResult] = useLazyQuery(
    AutoGenerateEssayQuestions,
    {
      variables: {
        examId: examData && examData.examId,
        number: examScheduleDetails && examScheduleDetails.numberofQuestions,
      },
    }
  );

  //add essay questions to exam
  const [addEssayQuestionToExam, addQuestionsToExamResult] = useMutation(
    AddEssayQuestionsArrayToScheduleExam
  );

  //auto generate essay questions
  useEffect(() => {
    if (autoGenResult.data) {
      //set the questions selected here
      const autoQuestions = autoGenResult.data.autoGenEssayQuestions;
      setAutoProcessing(!autoProcessing);
      setSelectedQuestion(autoQuestions);
    }
    if (autoGenResult.error) {
      setErrors(autoGenResult.error);
      setAutoProcessing(!autoProcessing);
    }
  }, [autoGenResult.data, autoGenResult.error]);

  //add essay question to exam mutation
  useEffect(() => {
    if (addQuestionsToExamResult.error) {
      setProcessing(!processing);
      setSubmitted(!submitted);
      setErrors(addQuestionsToExamResult.error.message);
    }

    if (
      addQuestionsToExamResult.data &&
      addQuestionsToExamResult.data.addEssayQuestionsToExam
    ) {
      setProcessing(!processing);
      window.alert("questions added successfully");
    }
  }, [addQuestionsToExamResult.error, addQuestionsToExamResult.data]);

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

    const arrayOfEssayQuestions = selectedQuestion.map(
      ({
        type,
        question,
        clue,
        possibleAnswers,
        mediaUrl,
        examId,
        examinationType,
        mediaType,
        id,
      }) => {
        const questionObj = {
          type,
          question,
          clue,
          possibleAnswers,
          mediaUrl,
          examId: examId,
          examinationType,
          mediaType,
          id,
        };
        return questionObj;
      }
    );
    await addEssayQuestionToExam({
      variables: {
        questionsArray: arrayOfEssayQuestions,
        scheduleId: examScheduleDetails.id,
      },
    });
  };

  const autoGenerateQuestionsToAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const examId = examData && examData.examId;
    const number = examScheduleDetails && examScheduleDetails.numberofQuestions;
    if (examId && number) {
      setAutoProcessing(!autoProcessing);
      switch (examType) {
        case "short answer exam":
          autoGenerateFunc();
          break;
      }
    }
  };

  const selectedExamTypeFunc = (examType) => {
    //clear everything before setting
    setExamData(null);
    setExamScheduleDetails(null);
    setScheduleArray([]);
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
      <div className="row">
        <div className="col-md-4 offset-md-1">
          <h4 className="text-center">Add Essay Question to Examination</h4>

          <ExaminationTypeComponent
            selectedExamTypeFunc={selectedExamTypeFunc}
            selectedExamNameFunc={selectedExamFunc}
            display={2}
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
                  <LoadEssayQuestionsComponent
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
            selectedQuestion.map(({ question, id }, index) => {
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

export default AddEssayQuestionsToExam;
