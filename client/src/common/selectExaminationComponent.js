import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GetAllExamination, GetExamScheduleByType } from "../graphql/queries";

import styled from "styled-components";

import Loading from "../common/loading";

const SelectExaminationStyles = styled.div``;

const SelectExaminationComponent = ({ examFunc, examTypeFunc }) => {
  const [selectedExamId, setSelectedExamId] = useState("");

  const [errors, setErrors] = useState(null);
  const [examType, setExamType] = useState([]);

  const [scheduleExams, setScheduleExams] = useState([]);
  const [processing, setProcessing] = useState(false);
  const { loading, error, data } = useQuery(GetAllExamination);
  const [scheduleExamQuery, scheduleExamResult] = useLazyQuery(
    GetExamScheduleByType,
    {
      variables: {
        examTypeId: selectedExamId,
      },
    }
  );

  //get exam schedule by type
  useEffect(() => {
    if (scheduleExamResult.error) {
      setProcessing(!processing);
      setErrors(scheduleExamResult.error.message);
    }

    if (scheduleExamResult.called && scheduleExamResult.loading) {
      setProcessing(!processing);
    }

    if (scheduleExamResult.data) {
      setProcessing(!processing);
      setScheduleExams(scheduleExamResult.data.getExamScheduleByType);
    }
  }, [
    scheduleExamResult.error,
    scheduleExamResult.loading,
    scheduleExamResult.data,
    scheduleExamResult.called,
  ]);

  //load exam type schedule
  useEffect(() => {
    if (error) {
      setErrors(error.message);
    }
    if (data) {
      setExamType(data.getAllExam);
    }
  }, [loading, error, data]);

  const handleExamChange = async (e) => {
    const value = e.target.value;
    if (value == "0") return;
    const splitValue = value.split("/");
    setSelectedExamId(splitValue[0]);
    examFunc({ examId: splitValue[0], examName: splitValue[1] });

    scheduleExamQuery();
  };

  const handleScheduleExamChange = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    const splitValue = value.split("/");

    examTypeFunc({
      examScheduleId: splitValue[0],
      examScheduleName: splitValue[1],
    });
  };

  return (
    <SelectExaminationStyles>
      <div className="text-center">{loading && <Loading />}</div>
      <div className="text-center">
        {errors && <p className="lead text-danger">{errors.message}</p>}
      </div>
      <div className="form-group">
        <select className="custom-select" onChange={handleExamChange}>
          <option value="0">select examination type</option>
          {loading && <option>loading data.......</option>}
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

      <select className="form-control" onChange={handleScheduleExamChange}>
        <option value="0">select examination </option>
        {processing && <option value="0">loading data....</option>}
        {scheduleExams &&
          scheduleExams.length > 0 &&
          scheduleExams.map(({ id, examinationName }) => {
            return (
              <option key={id} value={`${id}/${examinationName}`}>
                {examinationName}
              </option>
            );
          })}
      </select>
    </SelectExaminationStyles>
  );
};

export default SelectExaminationComponent;
