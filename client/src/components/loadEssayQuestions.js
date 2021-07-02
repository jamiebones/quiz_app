import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  GetDifferentExamination,
  GetAllEssayQuestions,
} from "../graphql/queries";
import { DeleteOneEssayQuestion } from "../graphql/mutation";
import { useLocation } from "react-router-dom";
import Loading from "../common/loading";
import styled from "styled-components";
import methods from "../methods";

const LoadQuestionsStyle = styled.div``;

const buttonsToDisplay = (total, numberPerPage) => {
  const buttonNumber = +total / +numberPerPage;
  let array = [];
  array.length = Math.ceil(buttonNumber);
  return array.fill(1);
};

const LoadQuestionsComponent = ({ history }) => {
  const [examType, setExamType] = useState([]);
  const [loadingData, setLoading] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedExamName, setSelectedExamName] = useState(null);
  const [errors, setErrors] = useState(null);
  const [questions, setQuestions] = useState({});
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [queryRan, setQueryRan] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();
  const details = location.state && location.state.details;
  const [questionsQuery, questionsQueryResult] = useLazyQuery(
    GetAllEssayQuestions
  );
  const [examsQuery, examsQueryResult] = useLazyQuery(GetDifferentExamination);

  const [deleteQuestion, deleteQuestionResult] = useMutation(
    DeleteOneEssayQuestion
  );

  useEffect(() => {
    examsQuery({
      variables: {
        examType: "short answer exam",
      },
    });
  }, []);

  useEffect(() => {
    if (examsQueryResult.data) {
      setExamType(examsQueryResult.data.getExamByType);
      setLoading(false);
    }

    if (examsQueryResult.loading) {
      setLoading(true);
    }

    if (examsQueryResult.error) {
      setErrors(examsQueryResult.error.message);
      setLoading(false);
    }
  }, [examsQueryResult.data, examsQueryResult.error]);

  useEffect(() => {
    if (questionsQueryResult.error) {
      setErrors(questionsQueryResult.error.message);
      setLoading(true);
      setQueryRan(!queryRan);
    }

    if (questionsQueryResult.data) {
      setQuestions(questionsQueryResult.data.getAllEssayQuestions.questions);
      setTotalQuestion(
        questionsQueryResult.data.getAllEssayQuestions.totalQuestion
      );
      setLoading(false);
    }
  }, [questionsQueryResult.error, questionsQueryResult.data]);

  useEffect(() => {
    if (deleteQuestionResult.error) {
      setErrors(deleteQuestionResult.error.message);
      setLoading(true);
      setSubmitted(false);
    }

    if (deleteQuestionResult.data) {
      if (deleteQuestionResult.data.deleteEssayQuestion) {
        window.alert("question deleted successfully");
        setLoading(false);
        setSubmitted(false);
      }
    }
  }, [deleteQuestionResult.error, deleteQuestionResult.data]);

  const getMoreQuestions = (e, index) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      setLoading(true);
      setQueryRan(!queryRan);
      questionsQueryResult.fetchMore({
        variables: {
          examId: selectedExamId,
          offset: questions.length * (index - 1),
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            getAllEssayQuestions: {
              totalQuestion: fetchMoreResult.getAllEssayQuestions.totalQuestion,
              __typename: "QuestionsTotal",
              questions: [
                //...prev.getAllQuestions.questions,
                ...fetchMoreResult.getAllEssayQuestions.questions,
              ],
            },
          });
        },
      });
    } catch (error) {}
  };

  const handleExamChange = async (e) => {
    const value = e.target.value;
    if (value == "0") return;
    const splitValue = value.split("/");
    setSelectedExamId(splitValue[0]);
    setSelectedExamName(splitValue[1]);
    try {
      setQueryRan(!queryRan);
      questionsQuery({
        variables: {
          examId: splitValue[0],
          offset: 0,
        },
        fetchPolicy: "cache-and-network",
      });
    } catch (error) {}
  };

  const handleEditEssay = ({
    mediaType,
    mediaUrl,
    possibleAnswers,
    clue,
    question,
    id,
    examId
  }) => {
    history.push("/edit_essay_question", {
      questionData: {
        mediaType,
        mediaUrl,
        possibleAnswers,
        clue,
        question,
        id,
        examId
      },
    });
  };

  const handleQuestionDeleteAction = async ({ questionId, index }) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;
    //delete the question here
    try {
      setSubmitted(true);
      setLoading(true);
      await deleteQuestion({
        variables: {
          questionId,
        },
        refetchQueries: [
          {
            query: GetAllEssayQuestions,
            variables: {
              examId: selectedExamId,
              offset: questions.length * (index - 1),
            },
          },
        ],
      });
    } catch (error) {}
  };

  return (
    <LoadQuestionsStyle>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {errors && <p className="lead text-danger">Error: {errors}</p>}
          <div className="form-group">
            <select className="custom-select" onChange={handleExamChange}>
              <option value="0">select examination type</option>
              {examsQueryResult.loading && <option>loading data.......</option>}
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

          <div className="form-group">
            {selectedExamName && (
              <p className="lead">
                Selected Examination:{" "}
                <span>
                  {selectedExamName && selectedExamName.toUpperCase()}
                </span>
              </p>
            )}
          </div>

          {questions && questions.length > 0 ? (
            <table className="table">
              <caption>Short Essay Questions</caption>
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Question</th>
                  <th scope="col">Possible Answer</th>
                  <th scope="col">Clue</th>
                  <th scope="col">Media Type</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(
                  (
                    {
                      question,
                      clue,
                      possibleAnswers,
                      id,
                      examinationType,
                      examId,
                      mediaType,
                      mediaUrl,
                    },
                    index
                  ) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          <div
                            className="question-divs"
                            dangerouslySetInnerHTML={methods.Utils.SetHtml(
                              question
                            )}
                          />
                        </td>
                        <td>
                          {possibleAnswers.map((ans) => {
                            return <p key={ans}>{ans}</p>;
                          })}
                        </td>
                        <td>
                          <p>{clue}</p>
                        </td>
                        <td>
                          <p>{mediaType ? mediaType : "none"}</p>
                        </td>
                        <td>
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                          >
                            <button
                              type="button"
                              className="btn btn-warning"
                              onClick={() =>
                                handleEditEssay({
                                  mediaType,
                                  mediaUrl,
                                  possibleAnswers,
                                  clue,
                                  question,
                                  id,
                                  examinationType,
                                  examId,
                                  index: index + 1,
                                  questionsLength: questions.length,
                                })
                              }
                            >
                              Edit
                            </button>
                            <button
                              disabled={submitted}
                              type="button"
                              onClick={() =>
                                handleQuestionDeleteAction({
                                  questionId: id,
                                  index: index + 1,
                                })
                              }
                              className="btn btn-danger"
                            >
                              {submitted ? "please wait..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          ) : (
            <div>
              {queryRan && (
                <p>
                  No questions saved yet for the selected examination;{" "}
                  {selectedExamName}
                </p>
              )}
            </div>
          )}

          {loadingData && <Loading />}

          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {totalQuestion > 20 &&
                buttonsToDisplay(totalQuestion, 20).map((_, index) => {
                  return (
                    <li
                      className="page-item"
                      key={index}
                      onClick={(e) => getMoreQuestions(e, index + 1)}
                    >
                      <a className="page-link" href="">
                        {index + 1}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </div>
      </div>
    </LoadQuestionsStyle>
  );
};

export default LoadQuestionsComponent;
