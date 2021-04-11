import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery } from "@apollo/client";
import { GetCanidateExamResult } from "../graphql/queries";
import { useRouteMatch } from "react-router-dom";
import moment from "moment";
import Loading from "../common/loading";
import DisplayScriptComponent from "../common/displayScriptComponent";

const DisplayQuizScriptComponentStyles = styled.div`
  p {
    font-size: 18px;
  }
  .question {
    font-size: 16px;
  }
  span {
    padding-left: 50px;
  }
  .question-panel {
    display: flex;
    font-size: 16px;
  }
  .question-divs {
    padding-left: 20px;
  }
  .details {
    background-color: #0b2f27;
    color: #fff;
    padding: 30px;
  }
  .text-name {
    color: #7abbff !important;
  }
  .spanDetails {
    float: right;
    font-weight: bold;
    color: #7c23f3;
  }
  .score {
    font-size: 35px;
    text-align: center;
  }
`;

const convertMinutesToHours = (minutesToConvert) => {
  const hours = Math.floor(minutesToConvert / 60);
  const minutes = minutesToConvert - hours * 60;
  if (hours == 0) {
    return `${minutes} minutes`;
  }
  return `${hours} hours ${minutes} minutes`;
};

const DisplayQuizScriptComponent = () => {
  const match = useRouteMatch("/examination_script/:examId");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState(null);
  const [scripts, setScripts] = useState(null);
  const [nodata, setNoData] = useState(null);
  const [getScriptFunction, getScriptResult] = useLazyQuery(
    GetCanidateExamResult,
    {
      variables: {
        examId: match.params.examId,
      },
    }
  );

  useEffect(() => {
    setProcessing(!processing);
    getScriptFunction();
  }, []);

  useEffect(() => {
    if (getScriptResult.data) {
      const scriptsData = getScriptResult.data.getExamOfCanidate;
      if (scriptsData) {
        setScripts(scriptsData);
      } else {
        setNoData(true);
      }
      setProcessing(!processing);
    }
    if (getScriptResult.error) {
      const message = getScriptResult.error.message;
      setProcessing(!processing);
      setErrors(message);
    }
  }, [getScriptResult.loading, getScriptResult.data, getScriptResult.error]);

  const setHtml = (html) => {
    return { __html: html };
  };

  return (
    <DisplayQuizScriptComponentStyles>
      <div className="row">
        <div className="col-md-12">
          {errors && <p className="text-center lead text-danger">{errors}</p>}

          {processing && (
            <div className="text-center">
              <Loading />
            </div>
          )}

          {nodata && (
            <div className="text-center">
              <p className="lead text-info">
                No examination matching that query
              </p>
            </div>
          )}

          {
            scripts && (
              <React.Fragment>
                <DisplayScriptComponent scripts={scripts} />
              </React.Fragment>
            )
            /* end of scripts matter here */
          }
        </div>
      </div>
    </DisplayQuizScriptComponentStyles>
  );
};

export default DisplayQuizScriptComponent;
