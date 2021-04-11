import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GetDifferentExamination } from "../graphql/queries";

const ExaminationTypeComponent = ({
  selectedExamTypeFunc,
  selectedExamNameFunc,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [examTypeData, setExamDataType] = useState([]);
  const [selectedExamName, setSelectedExamName] = useState(null);
  const [examTypeQuery, examTypeResult] = useLazyQuery(GetDifferentExamination);

  useEffect(() => {
    if (examTypeResult.loading) {
      setLoading(true);
    }
    if (examTypeResult.data) {
      const data = examTypeResult.data.getExamByType;
      setExamDataType(data);
      setLoading(false);
    }
    if (examTypeResult.error) {
      setLoading(false);
      setErrors(examTypeResult.error);
    }
  }, [examTypeResult.data, examTypeResult.error, examTypeResult.loading]);

  const handleExamChange = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    const splitValue = value.split("/");
    //extract selected schedules here
    const selValue = examTypeData.find((e) => e.id == splitValue[0]);
    const examSchedules = selValue && selValue.examSchedules;
    setSelectedExamName(splitValue[1]);
    selectedExamNameFunc({
      examId: splitValue[0],
      examName: splitValue[1],
      examSchedules: examSchedules,
    });
  };

  const handleExamTypeChange = (e) => {
    const value = e.target.value;
    if (value !== "0") {
      selectedExamTypeFunc(value);
      setSelectedExamName(null);
      examTypeQuery({
        variables: {
          examType: value,
        },
      });
    }
  };

  return (
    <React.Fragment>
      {errors && <p className="lead text-danger">Error: {errors}</p>}
      <div className="form-group">
        <label className="form-label">Select examination type</label>
        <select className="custom-select" onChange={handleExamTypeChange}>
          <option value="0">select examination type</option>
          <option value="multiple choice questions">
            Multiple choice questions
          </option>
          <option value="spelling examination">Spelling examination </option>
          <option value="short answer exam">Short answer type</option>
          <option value="essay exam">Essay examination</option>
          <option value="quantitative exam">Quantitative examination</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Select examination name</label>
        <select className="custom-select" onChange={handleExamChange}>
          <option value="0">select subject </option>
          {loading && <option>loading data.......</option>}
          {examTypeData.map(({ id, examName }) => {
            return (
              <option value={`${id}/${examName}`} key={id}>
                {examName}
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-group">
        {selectedExamName && (
          <p className="lead">
            Selected Examination name : <span>{selectedExamName}</span>
          </p>
        )}
      </div>
    </React.Fragment>
  );
};

export default ExaminationTypeComponent;
