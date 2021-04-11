import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { CreateCourseSubject } from "../graphql/mutation";

const CreateSubjectCourseStyles = styled.div`
  .div-form {
    margin-top: 50px;
  }
  .div-exam {
    p {
      padding: 10px;

      background: #c0c0c0;
    }
  }
`;

const CreateSubjectCourse = () => {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [loadingData, setLoading] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [createExamFunc, createExamResult] = useMutation(CreateCourseSubject);

  useEffect(() => {
    if (createExamResult.data) {
      setProcessing(!processing);
    }
    if (createExamResult.error) {
      setProcessing(!processing);
      setErrors(createExamResult.error);
    }
  }, [createExamResult.data, createExamResult.error]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const confirmSave = window.confirm(`Confirm the following information: \n
                                        Course/Subject : ${text} \n Examination Type : ${selectedExamType}`);
    if (!confirmSave) return;
    setProcessing(!processing);
    setLoading(!loadingData);
    //save the stuff here
    if (selectedExamType) {
      try {
        await createExamFunc({
          variables: {
            examName: text,
            examType: selectedExamType,
          },
        });
        setText("");
        setSelectedExamType(null);
      } catch (error) {}
    }
  };

  const handleExamTypeChange = (e) => {
    const value = e.target.value;
    if (value !== "0") {
      setSelectedExamType(value);
    }
  };

  return (
    <CreateSubjectCourseStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3 className="text-center text-primary">
            Create New Course/Subject
          </h3>
          <div className="div-form">
            {errors && (
              <p className="text-center lead text-danger">{errors.message}</p>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <select
                  className="custom-select"
                  onChange={handleExamTypeChange}
                >
                  <option value="0">select examination type</option>
                  <option value="multiple choice questions">
                    Multiple choice questions
                  </option>
                  <option value="spelling examination">
                    Spelling examination{" "}
                  </option>
                  <option value="short answer exam">Short answer type</option>
                  <option value="essay exam">Essay examination</option>
                  <option value="quantitative exam">
                    Quantitative examination
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Course/Subject Name: </label>
                <input
                  type="text"
                  className="form-control"
                  value={text}
                  onChange={handleTextChange}
                />
              </div>

              {selectedExamType && (
                <p>Selected examination type : {selectedExamType}</p>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={processing}
                  className="btn btn-success"
                >
                  {processing ? "please wait....." : "create subject/course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CreateSubjectCourseStyles>
  );
};

export default CreateSubjectCourse;
