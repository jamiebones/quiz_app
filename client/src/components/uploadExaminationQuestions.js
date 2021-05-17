import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GetDifferentExamination } from "../graphql/queries";
import {
  UploadBulkExaminationQuestions,
  UploadBulkSpellingQuestions,
  UploadBulkEssayQuestions,
} from "../graphql/mutation";
import * as XLSX from "xlsx";
import methods from "../methods";

const UploadExaminationQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedExamName, setSelectedExamName] = useState(null);
  const [errors, setErrors] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [examTypeData, setExamDataType] = useState([]);
  const [examTypeSelection, setExamTypeSelection] = useState(null);

  const [examTypeQuery, examTypeResult] = useLazyQuery(GetDifferentExamination);
  const [uploadQuestion, uploadQuestionResult] = useMutation(
    UploadBulkExaminationQuestions
  );

  const [uploadSpellingQuestion, uploadSpellingQuestionResult] = useMutation(
    UploadBulkSpellingQuestions
  );

  const [uploadEssayQuestion, uploadEssayQuestionResult] = useMutation(
    UploadBulkEssayQuestions
  );

  useEffect(() => {
    if (examTypeResult.loading) {
      setLoading(true);
    }
    if (examTypeResult.data) {
      const data = examTypeResult.data.getExamByType;
      if (data.length > 0) {
        setExamDataType(data);
        setLoading(false);
      } else {
        setExamDataType(data);
        setLoading(false);
        setSelectedExamId(null);
        setSelectedExamName(null);
      }
    }
    if (examTypeResult.error) {
      setLoading(false);
      setErrors(examTypeResult.error);
    }
  }, [examTypeResult.data, examTypeResult.error, examTypeResult.loading]);

  useEffect(() => {
    if (uploadQuestionResult.error) {
      setErrors(uploadQuestionResult.error.message);
      setSubmitted(false);
    }

    if (uploadQuestionResult.data) {
      setErrors(null);
      setSubmitted(false);
      document.getElementById("uploadExcelFile").value = "";
      setSelectedExamId(null);
      setSelectedExamName(null);
      window.alert(
        `${uploadQuestionResult.data.saveBulkQuestion} questions saved in the database.`
      );
    }
  }, [uploadQuestionResult.error, uploadQuestionResult.data]);

  useEffect(() => {
    if (uploadSpellingQuestionResult.error) {
      setErrors(uploadSpellingQuestionResult.error.message);
      setSubmitted(false);
    }

    if (uploadSpellingQuestionResult.data) {
      setErrors(null);
      setSubmitted(false);
      document.getElementById("uploadExcelFile").value = "";
      setSelectedExamId(null);
      setSelectedExamName(null);
      window.alert(
        `${uploadSpellingQuestionResult.data.saveBulkSpellingQuestion} questions saved in the database.`
      );
    }
  }, [uploadSpellingQuestionResult.error, uploadSpellingQuestionResult.data]);

  useEffect(() => {
    if (uploadEssayQuestionResult.error) {
      setErrors(uploadEssayQuestionResult.error.message);
      setSubmitted(false);
    }

    if (uploadEssayQuestionResult.data) {
      setErrors(null);
      setSubmitted(false);
      document.getElementById("uploadExcelFile").value = "";
      setSelectedExamId(null);
      setSelectedExamName(null);
      window.alert(
        `${uploadEssayQuestionResult.data.saveBulkEssayQuestion} questions saved in the database.`
      );
    }
  }, [uploadEssayQuestionResult.error, uploadEssayQuestionResult.data]);

  const handleExamChange = (e) => {
    const value = e.target.value;
    if (value == "0") return;
    const splitValue = value.split("/");
    setSelectedExamId(splitValue[0]);
    setSelectedExamName(splitValue[1]);
  };

  const handleExamTypeChange = (e) => {
    const value = e.target.value;
    if (value !== "0") {
      setExamTypeSelection(value);
      examTypeQuery({
        variables: {
          examType: value,
        },
      });
    }
  };

  const readExcel = (file) => {
    const fileReader = new FileReader();
    setLoading(true);
    fileReader.onload = function () {
      const wb = XLSX.read(fileReader.result, { type: "binary" });
      const workBookName = wb.SheetNames[0];
      const excel = wb.Sheets[workBookName];
      const excelData = methods.bulkMethods.SheetToArray(excel);
      setExcelData(excelData);
      setLoading(true);
    };
    fileReader.readAsBinaryString(file);
  };

  const handleFileUploadChange = (e) => {
    const file = e.target.files[0];
    const fileName = file && file.name;
    const lastIndexOfDot = fileName && fileName.lastIndexOf(".");
    const extention =
      fileName && fileName.substr(lastIndexOfDot + 1, fileName.length);
    const allowedExtention = ["xlsx", "ods", "xls"];
    const findIndex = allowedExtention.indexOf(extention.toLowerCase());
    if (findIndex == -1) {
      window.alert(
        `you can not upload ${extention} file. Only Excel files are allowed`
      );
      document.getElementById("uploadExcelFile").value = "";
      return;
    }
    readExcel(file);
  };

  const uploadQuestionToDatabase = async (e) => {
    e.preventDefault();
    //get the array of questions
    //check if a question has an answer
    setSubmitted(true);
    switch (examTypeSelection) {
      case "multiple choice questions":
        //we are good we can upload our questions to database
        try {
          const questionObject = methods.bulkMethods.saveBulkQuestions(
            excelData,
            selectedExamId,
            selectedExamName
          );
          const { type, payload } = questionObject;
          if (type === "error") {
            let questionString = "";
            payload.map((question) => {
              questionString += " " + question + "\n";
            });
            window.alert(
              `The followng questions have no answers \n ${questionString}`
            );
            document.getElementById("uploadExcelFile").value = "";
            return;
          } else {
            //we are good we can upload our questions to database
            await uploadQuestion({
              variables: {
                input: payload,
              },
            });
          }
        } catch (error) {
          //parse the error and return the questions without answers
        }
        break;
      case "spelling examination":
        const { payload } = methods.SaveBulkSpellingQuestions(
          excelData,
          selectedExamId,
          selectedExamName
        );
        try {
          await uploadSpellingQuestion({
            variables: {
              input: payload,
            },
          });
        } catch (error) {}
        break;
      case "short answer exam":
        const { payloadValue } = methods.SaveBulkEssayQuestions(
          excelData,
          selectedExamId,
          selectedExamName
        );
        try {
          await uploadEssayQuestion({
            variables: {
              input: payloadValue,
            },
          });
        } catch (error) {}
        break;

      default:
        break;
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 container-shadow">
        {errors && <p className="lead text-danger">Error: {errors}</p>}

        <p className="text-center lead">Upload Questions From Excel Document</p>
        <form>
          <div className="form-group">
            <select className="custom-select" onChange={handleExamTypeChange}>
              <option value="0">select examination type</option>
              <option value="multiple choice questions">
                Multiple choice questions
              </option>
              <option value="spelling examination">
                Spelling examination{" "}
              </option>
              <option value="short answer exam">Short answer type</option>
            </select>
          </div>
          <div className="form-group">
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
                <span>{selectedExamName}</span>
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="uploadExcelFile">Upload Excel File</label>
            <br />
            <input
              type="file"
              className="form-control-file"
              id="uploadExcelFile"
              onChange={handleFileUploadChange}
            />
          </div>

          {selectedExamId && selectedExamName && (
            <div className="form-group">
              <button
                disabled={submitted}
                className="btn btn-success btn-lg"
                onClick={uploadQuestionToDatabase}
              >
                {submitted ? "please wait......" : "click to upload questions"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadExaminationQuestions;
