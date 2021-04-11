import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DraftJsToolBar from "../common/draftJSToolBar";
import draftToHtml from "draftjs-to-html";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { useQuery, useMutation } from "@apollo/client";
import { GetAllExamination } from "../graphql/queries";
import { SubmitQuestion, EditQuestion } from "../graphql/mutation";

const NewQuestionStyles = styled.div`
  textarea {
    text-align: center;
  }
  .append-div {
    cursor: pointer;
  }
  .append-text {
    font-size: 19px;
  }
  .correctAnswer {
    border: 2px solid green;
    padding: 10px;
  }
  .remove-span {
    font-size: 30px;
    color: red;
    margin-right: 20px;
    cursor: pointer;
    float: right;
  }
  .div-select-answer {
    display: flex;
    justify-content: space-between;
  }
  .answers-div {
    margin-top: 20px;
  }
  .writeQuestion {
    margin-top: 20px;
  }
`;

const SaveNewQuestion = ({ editMode, questionToEdit, history }) => {
  //if we are editing the props should have
  //an editMode prop set to true and the paperdetails
  //will be stored in a props called paperDetails

  const [question, setQuestion] = useState(null);
  const [preview, setPreview] = useState("");
  const [answers, setAnswers] = useState([]);
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [examType, setExamType] = useState([]);
  const [loadingData, setLoading] = useState(false);
  const { loading, error, data } = useQuery(GetAllExamination);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedExamName, setSelectedExamName] = useState(null);
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitQuestionToDB, submitQuestionToDBResult] = useMutation(
    SubmitQuestion
  );
  const [editQuestion, editQuestionResult] = useMutation(EditQuestion);

  const textAnswer = useRef();

  useEffect(() => {
    if (editQuestionResult.error) {
      setSubmitted(!submitted);
      setErrors(editQuestionResult.error.message);
    }
    if (editQuestionResult.data) {
      setSubmitted(!submitted);
      setAnswers([]);
      setText("");
      setExplanation("");
      window.alert("question edited.");
      history.push("/load_question");
      window.location.reload();
    }
  }, [editQuestionResult.error, editQuestionResult.data]);

  useEffect(() => {
    if (submitQuestionToDBResult.error) {
      setSubmitted(!submitted);
      setErrors(submitQuestionToDBResult.error.message);
    }
    if (submitQuestionToDBResult.data) {
      setSubmitted(!submitted);
      setAnswers([]);
      setText("");
      setExplanation("");
      window.alert("question saved to database.");
    }
  }, [submitQuestionToDBResult.error, submitQuestionToDBResult.data]);

  useEffect(() => {
    if (loading) {
      setLoading(!loadingData);
    }
    if (error) {
      setErrors(error.message);
      setLoading(!loadingData);
    }
    if (data) {
      setExamType(data.getAllExam);
      setLoading(!loadingData);
    }
  }, [loading, error, data]);

  const handleEnterButtonPressed = (e) => {
    if (e.keyCode == 13) {
      handleAnswerSaved();
    }
  };

  const handleExamChange = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    const splitValue = value.split("/");
    setSelectedExamId(splitValue[0]);
    setSelectedExamName(splitValue[1]);
  };

  useEffect(() => {
    if (textAnswer && textAnswer.current) {
      textAnswer.current.addEventListener("keyup", handleEnterButtonPressed);
    }
    return () => {
      if (textAnswer && textAnswer.current) {
        textAnswer.current.removeEventListener(
          "keyup",
          handleEnterButtonPressed
        );
      }
    };
  });

  useEffect(() => {
    //loading question from props here
    const questionFromProps =
      (editMode && questionToEdit && questionToEdit.question) || "";
    if (questionFromProps) {
      const blocksFromHTML = convertFromHTML(questionToEdit.question);
      const content = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setQuestion(EditorState.createWithContent(content));
      setPreview(questionToEdit.question);
      setAnswers(questionToEdit.answers);
      setExplanation(questionToEdit.explanation);
    } else {
      setQuestion(EditorState.createEmpty());
      setPreview("<p>typed question will appear here</p>");
    }
  }, []);

  const handleChange = (editorState) => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setQuestion(editorState);
    setPreview(html);
  };

  const setHtml = (html) => {
    return { __html: html };
  };

  const handleAnswerSaved = () => {
    //save the text in the answer array
    if (text == "") return;
    const obj = {
      isCorrect: false,
      selected: false,
      option: text,
    };
    setAnswers((oldAnswers) => {
      return [...oldAnswers, obj];
    });
    setText("");
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
  };

  const selectAnswer = (index) => {
    let oldAnswers = [...answers];
    const previouSelection = oldAnswers.some((ans) => ans.isCorrect == true);
    if (previouSelection) {
      //map through and return array where all isCorrect is false.
      let newArray = [];
      oldAnswers.map((ele) => {
        const obj = {
          option: ele.option,
          isCorrect: false,
          selected: false,
        };
        newArray.push(obj);
      });
      let selectedAnswer = newArray[index];
      selectedAnswer.isCorrect = !selectedAnswer.isCorrect;
      newArray[index] = selectedAnswer;
      setAnswers(newArray);
    } else {
      let selectedAnswer = oldAnswers[index];
      selectedAnswer.isCorrect = !selectedAnswer.isCorrect;
      oldAnswers[index] = selectedAnswer;
      setAnswers(oldAnswers);
    }
  };

  const removeAnswer = (e, index) => {
    e.stopPropagation();
    const oldAnswers = [...answers];
    oldAnswers.splice(index, 1);
    setAnswers(oldAnswers);
  };

  const saveQuestionToDatabase = async () => {
    //gather all the variables and save the
    if (!preview)
      return window.alert(
        "we can not save a question without the actual question. can we ?"
      );
    const findAnswers = answers.some((ans) => ans.isCorrect == true);
    if (!findAnswers) {
      return window.alert("please select the correct answer");
    }

    const questionObj = {
      question: preview,
      answers,
      questionImageUrl: "",
      examinationType: selectedExamName,
      examId: selectedExamId,
      explanation: explanation,
    };

    try {
      setSubmitted(!submitted);
      await submitQuestionToDB({
        variables: {
          input: questionObj,
        },
      });
    } catch (error) {}
  };

  const handleExplanationChange = (e) => {
    const value = e.target.value;
    setExplanation(value);
  };

  const editQuestionInDatabase = async () => {
    //construct question to update
    if (!preview)
      return window.alert(
        "we can not save a question without the actual question. can we ?"
      );
    const findAnswers = answers.some((ans) => ans.isCorrect == true);
    if (!findAnswers) {
      return window.alert("please select the correct answer");
    }

    const questionObj = {
      question: preview,
      answers,
      questionImageUrl: "",
      examinationType: questionToEdit.examinationType,
      examId: questionToEdit.examId,
      explanation: explanation,
    };

    try {
      setSubmitted(!submitted);
      await editQuestion({
        variables: {
          input: questionObj,
          questionId: questionToEdit && questionToEdit.id,
        },
      });
    } catch (error) {}
  };

  return (
    <NewQuestionStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <p className="text-danger lead">{errors}</p>
          {!editMode && (
            <div className="form-group">
              <select className="custom-select" onChange={handleExamChange}>
                <option value="0">select examination type</option>
                {loadingData && <option>loading data.......</option>}
                {examType &&
                  examType.length > 0 &&
                  examType.map(({ id, examName }) => {
                    return (
                      <option value={`${id}/${examName}`} key={id}>
                        {examName}
                      </option>
                    );
                  })}
              </select>
            </div>
          )}
          <div className="form-group">
            {selectedExamName && (
              <p className="lead">
                <span>
                  Selected Examination : <b>{selectedExamName}</b>
                </span>
              </p>
            )}
          </div>

          <div className="">
            <p className="text-center">
              <b> Preview of the question</b>
            </p>
          </div>
          <div className="" dangerouslySetInnerHTML={setHtml(preview)} />

          <h4> Type Question</h4>

          <Editor
            editorState={question}
            onEditorStateChange={handleChange}
            editorClassName="writeQuestion"
            placeholder="Type your question here....."
            toolbar={DraftJsToolBar}
          />

          <div className="input-group">
            <textarea
              className="form-control"
              aria-label="With textarea"
              value={text}
              onChange={handleTextChange}
              ref={textAnswer}
            ></textarea>
            <div
              className="input-group-append append-div"
              onClick={handleAnswerSaved}
            >
              <span className="input-group-text append-text">save answer</span>
            </div>
          </div>

          <div className="answers-div">
            {answers &&
              answers.length > 0 &&
              answers.map(({ option, isCorrect }, index) => {
                return (
                  <div
                    className="div-select-answer"
                    key={index}
                    onClick={() => selectAnswer(index)}
                  >
                    <p className={isCorrect ? "correctAnswer" : ""}>{option}</p>

                    <span
                      className="remove-span"
                      onClick={(e) => removeAnswer(e, index)}
                    >
                      &#10006;
                    </span>
                  </div>
                );
              })}
          </div>

          <div className="form-group">
            <label>Explanation for the answer if any</label>
            <textarea
              className="form-control"
              aria-label="With textarea"
              value={explanation}
              onChange={handleExplanationChange}
            ></textarea>
          </div>

          {editMode ? (
            <div className="text-center">
              <button
                disabled={submitted}
                className="btn btn-lg btn-danger"
                onClick={editQuestionInDatabase}
              >
                {submitted
                  ? "editing question please wait......"
                  : "edit question"}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                disabled={submitted}
                className="btn btn-lg btn-success"
                onClick={saveQuestionToDatabase}
              >
                {submitted
                  ? "saving question please wait......"
                  : "save question"}
              </button>
            </div>
          )}
        </div>
      </div>
    </NewQuestionStyles>
  );
};

export default SaveNewQuestion;
