import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ExaminationTypeComponent from "../common/examinationTypeComponent";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DraftJsToolBar from "../common/draftJSToolBar";
import draftToHtml from "draftjs-to-html";
import { useMutation } from "@apollo/client";
import { SaveEssayQuestion } from "../graphql/mutation";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";

const SaveEssayQuestionStyles = styled.div`
  .write-question {
    background-color: #c0c0c0;
    margin-bottom: 20px;
    padding: 10px;
  }
  .possible-span {
    padding: 5px;
    display: inline-block;
    background-color: #063c16;
    margin-top: 10px;
    margin-right: 10px;
    cursor: pointer;
    color: #fff;
    border-radius: 0px 10px;
  }
  .file-details {
    padding: 20px;
    width: 30%;
  }
  .custom-width {
    width: 50%;
  }
`;

const SaveEssayQuestionComponent = () => {
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [question, setQuestion] = useState(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [clue, setClue] = useState("");
  const [possibleAnswers, setPossibleAnswers] = useState([]);
  const [mediaType, setMediaType] = useState("");
  const [fileDetails, setFileDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [saveQuestionFunc, saveQuestionResult] = useMutation(SaveEssayQuestion);
  const textAnswer = useRef();
  const fileRef = useRef();

  useEffect(() => {
    if (saveQuestionResult.error) {
      setSubmitted(false);
      setErrors(saveQuestionResult.error.message);
    }
    if (saveQuestionResult.data) {
      //const data = saveQuestionResult.data.saveEssayQuestion;

      setSubmitted(false);
      setClue("");
      setText("");
      setMediaType("0");
      setPossibleAnswers([]);
      setFileDetails(null);
      setFile(null);
      fileRef.current.value = "";
      window.alert("question saved to database.");
    }
  }, [saveQuestionResult.data, saveQuestionResult.error]);

  const handleExamNameFunc = ({ examId, examName }) => {
    setExamDetails({
      examId,
      examName,
    });
  };

  const handleExamTypeFunc = (selectedExamName) => {
    setSelectedExamType(selectedExamName);
  };
  const handleChange = (editorState) => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setQuestion(editorState);
    setPreview(html);
  };

  const setHtml = (html) => {
    return { __html: html };
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.lastIndexOf(",") != -1) {
      const oldValues = [...possibleAnswers];
      const valueWithoutComma = value.substr(0, value.length - 1);
      const old = oldValues.filter((e) => e != valueWithoutComma);
      setPossibleAnswers([...old, valueWithoutComma]);
      setText("");
    } else {
      setText(value);
    }
  };

  const handleTextClueChange = (e) => {
    const value = e.target.value;
    setClue(value);
  };

  const removePossibleAnswer = (answer) => {
    const oldValues = [...possibleAnswers];
    const newValues = oldValues.filter((e) => e != answer);
    setPossibleAnswers(newValues);
  };

  const handleMediaChange = (e) => {
    const value = e.target.value;
    if (value !== "0") {
      setMediaType(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name, size, type } = file;
    const fileType = type.split("/")[0];
    if (mediaType != fileType) {
      window.alert(
        `please select the correct media type: Select a ${mediaType}`
      );
      fileRef.current.value = "";
      return;
      //remove the reference
    }
    setFile(file);
    setFileDetails({
      name,
      size,
      type,
    });
  };

  const submitQuestionToDB = async () => {
    if (!selectedExamType) {
      return window.alert("please select the exam type. It is required");
    }
    if (!preview) {
      return window.alert(
        "we can not save a question without the actual question. can we ?"
      );
    }
    if (possibleAnswers.length == 0) {
      return window.alert("please enter possible answers for the question");
    }
    if (!examDetails) {
      return window.alert("select the subject/examination the question is for");
    }
    try {
      const { examId, examName } = examDetails;
      let inputQuestion = {
        type: selectedExamType,
        question: preview,
        clue: clue,
        possibleAnswers: possibleAnswers,
        examId: examId,
        examinationType: examName,
      };
      if (mediaType) {
        inputQuestion.mediaType = mediaType;
        inputQuestion.mediaFile = file;
      }
      setSubmitted(true);
      await saveQuestionFunc({
        variables: {
          input: inputQuestion,
        },
      });
    } catch (error) {}
  };

  return (
    <SaveEssayQuestionStyles>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h3 className="text-center">Add Essay Questions</h3>
          {errors && <p className="text-danger lead">{errors}</p>}
          <ExaminationTypeComponent
            selectedExamTypeFunc={handleExamTypeFunc}
            selectedExamNameFunc={handleExamNameFunc}
            display={2}
          />

          <div>
            <p>
              <b> Preview of the question</b>
            </p>
          </div>
          <div className="" dangerouslySetInnerHTML={setHtml(preview)} />

          <h4> Type Question</h4>

          <Editor
            editorState={question}
            onEditorStateChange={handleChange}
            editorClassName="write-question"
            placeholder="Type your question here....."
            toolbar={DraftJsToolBar}
          />

          <div className="form-group">
            <label className="form-label">Possible answers</label>

            <input
              type="text"
              className="form-control custom-width"
              aria-label="With textarea"
              value={text}
              onChange={handleTextChange}
              ref={textAnswer}
            />
            <small className="form-text text-muted">
              Type each possible answer seperated by a comma (,)
            </small>
          </div>

          {possibleAnswers.map((answer, index) => {
            return (
              <span
                key={index}
                className="possible-span"
                onClick={() => removePossibleAnswer(answer)}
              >
                {answer}
              </span>
            );
          })}

          <div className="form-group">
            <label className="form-label">Answer clues </label>

            <textarea
              className="form-control custom-width"
              aria-label="With textarea"
              value={clue}
              onChange={handleTextClueChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Media Type</label>
            <select
              className="custom-width form-control"
              onChange={handleMediaChange}
            >
              <option value="0">select media type</option>
              <option value="video">video</option>
              <option value="audio">audio</option>
              <option value="image">image</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="file"
              ref={fileRef}
              className="file-input"
              onChange={handleFileChange}
            />
          </div>

          {fileDetails && (
            <div className="file-details">
              <p>file name: {fileDetails.name}</p>

              <p>file type: {fileDetails.type}</p>

              <p>file size: {+fileDetails.size / 1000} KB</p>
            </div>
          )}

          <div className="float-right mb-3">
            <button
              className="btn btn-success"
              disabled={submitted}
              onClick={submitQuestionToDB}
            >
              {submitted
                ? "submitting please wait...."
                : "Save Essay Questions "}
            </button>
          </div>
        </div>
      </div>
    </SaveEssayQuestionStyles>
  );
};

export default SaveEssayQuestionComponent;
