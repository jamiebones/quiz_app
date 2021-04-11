import React, { useEffect, useState } from "react";
import { GetDifferentExamination } from "../graphql/queries";
import { SaveSpelling } from "../graphql/mutation";
import { useMutation, useLazyQuery } from "@apollo/client";

import styled from "styled-components";

const SpellingQuestionStyles = styled.div`
  .btn-wl {
    cursor: pointer;
  }

  .input-row {
    margin: 10px 0px;
    display: flex;
    flex-wrap: wrap;
  }
  .input-spelling {
    margin: 10px;
    text-align: center;
    font-size: 40px;
    width: 80px;
    height: 80px;
  }
  .guide-div {
    margin: 20px 0 0 0px;
  }
`;

const createInputBox = (number) => {
  let inputArray = [];
  for (let i = 0; i < number; i++) {
    let obj = {
      value: "",
      index: i,
    };
    inputArray.push(obj);
  }
  return inputArray;
};

const SaveSpellingQuestion = () => {
  const [inputArray, setArrayInput] = useState([]);
  const [wordLength, setWordLength] = useState("");
  const [inputLength, setInputLength] = useState(0);
  const [correctSpelling, setCorrectSpelling] = useState("");
  const [spellingClue, setSpellingClue] = useState("");
  const [selectedExamType, setExamType] = useState("");
  const [examTypeData, setExamDataType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examId, setExamId] = useState(null);
  const [examName, setExamName] = useState(null);
  const [errors, setErrors] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [examTypeQuery, examTypeResult] = useLazyQuery(GetDifferentExamination);
  const [saveSpellingMutation, saveSpellingResult] = useMutation(SaveSpelling);
  const wordLengthFunction = () => {
    setInputLength(wordLength);
    let arr = createInputBox(wordLength);
    setArrayInput(arr);
  };

  useEffect(() => {
    examTypeQuery({
      variables: {
        examType: "spelling examination",
      },
    });
  }, []);

  useEffect(() => {
    if (saveSpellingResult.data) {
      setSubmitted(false);
      setArrayInput([]);
      setWordLength("");
      setCorrectSpelling("");
      setSpellingClue("");
      alert("spelling question saved successful");
    }

    if (saveSpellingResult.error) {
      setSubmitted(false);
      setErrors(saveSpellingResult.error);
    }
  }, [saveSpellingResult.data, saveSpellingResult.error]);

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

  const handleWordLengthChange = (e) => {
    const value = e.target.value;
    if (typeof +value == "number") {
      setWordLength(+value);
    }
  };

  const handleTextInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      let arrayOfInputs = [...inputArray];
      const newValue = {
        value: value.toUpperCase(),
        index,
      };
      arrayOfInputs[index] = newValue;
      setArrayInput(arrayOfInputs);
    }
  };

  const handleSpelling = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "correctSpelling":
        if (value.length <= wordLength) {
          setCorrectSpelling(value);
        }
        break;

      case "spellingClue":
        setSpellingClue(value);
        break;
    }
  };

  const handleExamChange = (e) => {
    const value = e.target.value;
    if (value !== "0") setExamType(value);
    const splitValue = value.split("/");
    const examId = splitValue[0];
    const examName = splitValue[1];
    setExamId(examId);
    setExamName(examName);
  };

  const handleQuestionSubmission = async () => {
    //get all the values from the check box
    let buildWord = "";
    inputArray.map(({ value }) => {
      const letter = value;
      buildWord += letter;
    });
    //check if the world contain any asterik
    const checkValue = buildWord.indexOf("*");
    if (checkValue == -1) {
      alert("please enter at least one asterik character");
      return;
    }
    const inputValue = {
      word: buildWord,
      correctWord: correctSpelling,
      clue: spellingClue,
      examinationType: examName,
      examId,
      createdAt: new Date(),
    };
    try {
      setSubmitted(true);
      await saveSpellingMutation({
        variables: {
          input: inputValue,
        },
      });
    } catch (error) {}
  };

  return (
    <SpellingQuestionStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="text-center">
              {errors && <p className="text-center lead">{errors.message}</p>}
            </div>

            <div className="form-group">
              <select className="custom-select" onChange={handleExamChange}>
                <option value="0">select examination type</option>
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

            {examId && examName && (
              <React.Fragment>
                <p className="lead">saving questions into {examName}</p>
                <div className="input-group word-length">
                  <input
                    type="text"
                    value={wordLength}
                    onChange={handleWordLengthChange}
                    className="form-control"
                    placeholder="word length..."
                    aria-label="Input group example"
                    aria-describedby="btnGroupAddon2"
                  />
                  <div
                    className="input-group-prepend btn-wl"
                    onClick={wordLengthFunction}
                  >
                    <div className="input-group-text" id="btnGroupAddon2">
                      Enter word length
                    </div>
                  </div>
                </div>
                {inputArray.length > 0 && (
                  <div className="guide-div">
                    <p>
                      Enter the spelling word. Use * to denote the missing word
                    </p>
                  </div>
                )}

                <div className="input-row">
                  {inputArray.map(({ value, index }, ind) => {
                    return (
                      <input
                        key={ind}
                        type="text"
                        value={value}
                        className="form-control input-spelling"
                        onChange={(e) => handleTextInputChange(e, index)}
                      />
                    );
                  })}
                </div>
                {inputArray.length > 0 && (
                  <React.Fragment>
                    <div className="form-group">
                      <label for="correctSpelling">Correct spelling</label>
                      <input
                        type="text"
                        className="form-control"
                        value={correctSpelling}
                        id="correctSpelling"
                        placeholder="Correct spelling"
                        name="correctSpelling"
                        onChange={handleSpelling}
                      />
                    </div>

                    <div className="form-group">
                      <label for="spellingClue">Clue</label>
                      <input
                        type="text"
                        className="form-control"
                        value={spellingClue}
                        id="spellingClue"
                        placeholder="Spelling clue"
                        name="spellingClue"
                        onChange={handleSpelling}
                      />
                    </div>

                    <div className="text-center">
                      <button
                        disabled={submitted}
                        className="btn btn-success"
                        onClick={handleQuestionSubmission}
                      >
                        {" "}
                        {!submitted
                          ? "Save Spelling Questions"
                          : "Saving please wait...."}
                      </button>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </SpellingQuestionStyles>
  );
};

export default SaveSpellingQuestion;
