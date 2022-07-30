import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DraftJsToolBar from "../common/draftJSToolBar";
import draftToHtml from "draftjs-to-html";
import { useMutation, useLazyQuery } from "@apollo/client";
import { EditEssayQuestion, DeleteMedia } from "../graphql/mutation";
import { GetAllEssayQuestions } from "../graphql/queries";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { useLocation, useNavigate } from "react-router-dom";
import AudioComponent from "../common/audioComponent";
import VideoComponent from "../common/videoComponent";
import ImageComponent from "../common/imageComponent";
import settings from "../config";

const baseUrl = settings.API_URL;

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
  .media-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
`;

const SaveEssayQuestionComponent = () => {
  const navigate = useNavigate()
  const [essayQuestion, setQuestion] = useState(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [clue, setClue] = useState("");
  const [possibleAnswers, setPossibleAnswers] = useState([]);
  const [mediaType, setMediaType] = useState("");
  const [oldmediaType, setOldMediaType] = useState("");
  const [oldmediaUrl, setOldMediaUrl] = useState("");
  const [fileDetails, setFileDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [questionId, setQuestionId] = useState(null);
  const [examId, setExamId] = useState(null);

  const textAnswer = useRef();
  const fileRef = useRef();

  const [editQuestionFunc, editQuestionResult] = useMutation(EditEssayQuestion);
  const [deleteMediaQuestionFunc, deleteMediaResult] = useMutation(DeleteMedia);

  const [questionsQuery, questionsQueryResult] = useLazyQuery(
    GetAllEssayQuestions
  );

  const location = useLocation();
  const questionData = location.state && location.state.questionData;

  useEffect(() => {
    if (questionData) {
      const {
        mediaType,
        mediaUrl,
        possibleAnswers,
        clue,
        question,
        id,
        examId,
      } = questionData;
      const blocksFromHTML = convertFromHTML(question);
      const content = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setQuestion(EditorState.createWithContent(content));
      setPreview(question);
      setPossibleAnswers(possibleAnswers);
      setClue(clue);
      setOldMediaType(mediaType);
      setOldMediaUrl(mediaUrl);
      setQuestionId(id);
      setExamId(examId);
    }
  }, []);

  useEffect(() => {
    if (deleteMediaResult.error) {
      setErrors(deleteMediaResult.error.message);
    }
    if (deleteMediaResult.data) {
      //we have a successful delete
      //load the mediatype here
      window.alert("media file removed successfully");
      setOldMediaType(null);
      setOldMediaUrl(null);
    }
  }, [deleteMediaResult.error, deleteMediaResult.data]);

  useEffect(() => {
    if (editQuestionResult.error) {
      setSubmitted(false);
      setErrors(editQuestionResult.error.message);
    }
    if (editQuestionResult.data) {
      window.alert("question edited successfully.");
      //make a redirect here
      navigate("/load_essay_question");
    }
  }, [editQuestionResult.data, editQuestionResult.error]);

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
    if (!preview) {
      return window.alert(
        "we can not save a question without the actual question. can we ?"
      );
    }
    if (possibleAnswers.length == 0) {
      return window.alert("please enter possible answers for the question");
    }

    try {
      let inputQuestion = {
        question: preview,
        clue: clue,
        possibleAnswers: possibleAnswers,
        id: questionId,
      };
      if (mediaType) {
        inputQuestion.mediaType = mediaType;
        inputQuestion.mediaFile = file;
      }
      const examinationId = examId;
      setSubmitted(true);
      await editQuestionFunc({
        variables: {
          input: inputQuestion,
        },
        context: { hasUpload: true  },
        refetchQueries: [
          {
            query: GetAllEssayQuestions,
            variables: {
              examId: examinationId,
              offset: 0,
            },
          },
        ],
      });
    } catch (error) {}
  };

  const deleteMediaFromFile = async () => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;
    try {
      await deleteMediaQuestionFunc({
        variables: {
          questionId: questionId,
          mediaUrl: oldmediaUrl,
        },
      });
    } catch (error) {}
  };

  return (
    <SaveEssayQuestionStyles>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h3 className="text-center">Editing Questions</h3>
          {errors && <p className="text-danger lead">{errors}</p>}

          <div>
            <p>
              <b> Preview of the question</b>
            </p>
          </div>
          <div className="" dangerouslySetInnerHTML={setHtml(preview)} />

          <h4> Type Question</h4>

          <Editor
            editorState={essayQuestion}
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

          {!oldmediaType && (
            <React.Fragment>
              <div className="form-group">
                <label className="form-label">Media Type</label>
                <select
                  className="custom-width form-control"
                  onChange={handleMediaChange}
                  value={mediaType}
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
            </React.Fragment>
          )}

          <div className="media-div">
            {oldmediaType === "audio" && (
              <React.Fragment>
                <AudioComponent src={`${baseUrl}/${oldmediaUrl}`} />
                <button
                  className="btn btn-danger"
                  onClick={deleteMediaFromFile}
                >
                  delete media
                </button>
              </React.Fragment>
            )}

            {oldmediaType === "video" && (
              <React.Fragment>
                <VideoComponent src={`${baseUrl}/${oldmediaUrl}`} />

                <button
                  className="btn btn-danger"
                  onClick={deleteMediaFromFile}
                >
                  delete media
                </button>
              </React.Fragment>
            )}

            {oldmediaType === "image" && (
              <React.Fragment>
                <ImageComponent src={`${baseUrl}/${oldmediaUrl}`} />
                <button
                  className="btn btn-danger"
                  onClick={deleteMediaFromFile}
                >
                  delete media
                </button>
              </React.Fragment>
            )}
          </div>

          <div className="text-center mb-3">
            <button
              className="btn btn-success"
              disabled={submitted}
              onClick={submitQuestionToDB}
            >
              {submitted ? "submitting please wait...." : "Edit Questions "}
            </button>
          </div>
        </div>
      </div>
    </SaveEssayQuestionStyles>
  );
};

export default SaveEssayQuestionComponent;
