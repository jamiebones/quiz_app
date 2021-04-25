import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  CreateExaminationSchedule,
  CreateSpellingExaminationSchedule,
  CreateEssayExaminationSchedule,
} from "../graphql/mutation";

import { GetDifferentExamination } from "../graphql/queries";
import ExaminationTypeComponent from "../common/examinationTypeComponent";

import styled from "styled-components";

const CreateExaminationScheduleStyles = styled.div`
  .div-time-input {
    display: flex;
    justify-content: space-around;
  }
  .sm-width {
    width: 30%;
  }

  .div-time-input span {
    margin-bottom: 10px;
  }
`;

const CreateExaminationScheduleComponent = () => {
  const [errors, setErrors] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState("");
  const [scheduleExamName, setScheduleExamName] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [selExamType, setSelExamType] = useState(null);
  const [selExamDetails, setSelExamDetails] = useState(null);

  const [createSchedule, createScheduleResult] = useMutation(
    CreateExaminationSchedule
  );

  const [createSpellingSchedule, createSpellingScheduleResult] = useMutation(
    CreateSpellingExaminationSchedule
  );

  const [createEssaySchedule, createEssayScheduleResult] = useMutation(
    CreateEssayExaminationSchedule
  );

  const [examTypeQuery, examTypeResult] = useLazyQuery(GetDifferentExamination);

  useEffect(() => {
    if (createEssayScheduleResult.error) {
      setErrors(createEssayScheduleResult.error.message);
      setProcessing(!processing);
    }
    if (createEssayScheduleResult.data) {
      setProcessing(!processing);
      setTotalQuestions("");
      setScheduleExamName("");
      setHours("");
      setMinutes("");
      window.alert("Examination schedule created successfully");
    }
  }, [createEssayScheduleResult.error, createEssayScheduleResult.data]);

  useEffect(() => {
    if (createSpellingScheduleResult.error) {
      setErrors(createSpellingScheduleResult.error.message);
      setProcessing(!processing);
    }
    if (createSpellingScheduleResult.data) {
      setProcessing(!processing);
      setTotalQuestions("");
      setScheduleExamName("");
      setHours("");
      setMinutes("");
      window.alert("Examination schedule created successfully");
    }
  }, [createSpellingScheduleResult.error, createSpellingScheduleResult.data]);

  useEffect(() => {
    if (createScheduleResult.error) {
      setErrors(createScheduleResult.error.message);
      setProcessing(!processing);
    }
    if (createScheduleResult.data) {
      setProcessing(!processing);
      setTotalQuestions("");
      setScheduleExamName("");
      setHours("");
      setMinutes("");
      window.alert("Examination schedule created successfully");
    }
  }, [createScheduleResult.error, createScheduleResult.data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selExamDetails) {
      return window.alert("please select the examination type");
    }
    //gather all the input here
    if (scheduleExamName == "") {
      return window.alert("The Examination name is a required field ");
    }
    if (totalQuestions == "") {
      return window.alert("The total questions field is required.");
    }
    if (hours == "" && minutes == "") {
      return window.alert("Please set the examination duration");
    }
    const duration = +hours * 60 + +minutes;
    const scheduleObj = {
      numberofQuestions: +totalQuestions,
      examinationName: scheduleExamName,
      active: false,
      examinationDuration: duration,
      questions: [],
      questionType: selExamType,
      examTypeID: selExamDetails.examId,
      examTypeName: selExamDetails.examName,
    };
    const confirmDetails = window.confirm(`Please confirm the following details: \n
                                           Examination schedule name : ${scheduleExamName} \n
                                           Number of questions: ${totalQuestions} \n
                                           Examination duration: ${
                                             hours ? hours : 0
                                           } hours : ${minutes} minutes \n

    `);
    if (!confirmDetails) return;
    switch (selExamType) {
      case "multiple choice questions":
        try {
          setProcessing(!processing);
          await createSchedule({
            variables: {
              input: scheduleObj,
            },
            refetchQueries: [
              {
                query: GetDifferentExamination,
                variables: {
                  examType: selExamType
                }
              }
            ]
          });
        } catch (error) {}
        break;
      case "spelling examination":
        try {
          setProcessing(!processing);
          await createSpellingSchedule({
            variables: {
              input: scheduleObj,
            },
            refetchQueries: [
              {
                query: GetDifferentExamination,
                variables: {
                  examType: selExamType
                }
              }
            ]
          });
        } catch (error) {}

        break;
      case "short answer exam":
        try {
          setProcessing(!processing);
          await createEssaySchedule({
            variables: {
              input: scheduleObj,
            },
            refetchQueries: [
              {
                query: GetDifferentExamination,
                variables: {
                  examType: selExamType
                }
              }
            ]
          });
        } catch (error) {}
        break;
      case "essay exam":
        break;
      case "quantitative exam":
        break;

      default:
        break;
    }
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "totalQuestions":
        setTotalQuestions(value);
        break;
      case "scheduleExamName":
        setScheduleExamName(value);
        break;
      case "hours":
        setHours(value);
        break;
      case "minutes":
        setMinutes(value);
        break;
    }
  };

  const selectedExamTypeFunc = (examType) => {
    setSelExamType(examType);
  };
  const selectedExamNameFunc = ({ examId, examName }) => {
    setSelExamDetails({ examId, examName });
  };
  return (
    <CreateExaminationScheduleStyles>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h3 className="text-center">Create New Examination Schedule</h3>
          {errors && <p className="lead text-danger">Error: {errors}</p>}
          <ExaminationTypeComponent
            selectedExamTypeFunc={selectedExamTypeFunc}
            selectedExamNameFunc={selectedExamNameFunc}
            display="all"
          />
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label htmlFor="examinationName" className="form-label">
                Examination schedule name
              </label>
              <input
                type="text"
                className="form-control"
                id="examinationName"
                value={scheduleExamName}
                name="scheduleExamName"
                onChange={handleChange}
                aria-describedby="examHelp"
              />
              <div id="examHelp" className="form-text">
                Name of the schedule examination
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="totalQuestions" className="form-label">
                Total Question
              </label>

              <input
                type="number"
                value={totalQuestions}
                className="form-control sm-width"
                id="totalQuestions"
                name="totalQuestions"
                aria-describedby="emailHelp"
                onChange={handleChange}
              />
              <div id="emailHelp" className="form-text">
                Total number of questions in the examination
              </div>
            </div>
            <div className="mb-3">
              <div className="row">
                <div className="col-md-3">
                  <input
                    type="number"
                    name="hours"
                    className="form-control"
                    value={hours}
                    onChange={handleChange}
                  />
                  <span>Hour</span>
                </div>

                <div className="col-md-3">
                  <input
                    type="number"
                    name="minutes"
                    className="form-control"
                    value={minutes}
                    onChange={handleChange}
                  />
                  <span>Minutes</span>
                </div>
              </div>

              <div id="emailHelp" className="form-text">
                Set the duration of the examination
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={processing}
                className="btn btn-success btn-lg"
              >
                {processing
                  ? "please wait....."
                  : "submit examination schedule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CreateExaminationScheduleStyles>
  );
};

export default CreateExaminationScheduleComponent;
