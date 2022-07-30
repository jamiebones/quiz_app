import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GetDifferentExamination, GetAllQuestions } from "../graphql/queries";
import { DeleteOneQuestion } from "../graphql/mutation";
import ShowQuestionComponent from "./showQuestionComponent";
import Loading from "../common/loading";
import styled from "styled-components";
import EditButton from "./editButton";
import { useNavigate } from "react-router-dom";

const LoadQuestionsStyle = styled.div``;

const buttonsToDisplay = (total, numberPerPage) => {
  const buttonNumber = +total / +numberPerPage;
  let array = [];
  array.length = Math.ceil(buttonNumber);
  return array.fill(1);
};

const LoadQuestionsComponent = ({ history }) => {
  const navigate = useNavigate();
  const [examType, setExamType] = useState([]);
  const [loadingData, setLoading] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedExamName, setSelectedExamName] = useState(null);
  const [errors, setErrors] = useState(null);
  const [questions, setQuestions] = useState({});
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [queryRan, setQueryRan] = useState(false);

  const [questionsQuery, questionsQueryResult] = useLazyQuery(GetAllQuestions);
  const [examsQuery, examsQueryResult] = useLazyQuery(GetDifferentExamination);

  const [deleteQuestion, deleteQuestionResult] = useMutation(DeleteOneQuestion);

  useEffect(() => {
    examsQuery({
      variables: {
        examType: "multiple choice questions",
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
      setQuestions(questionsQueryResult.data.getAllQuestions.questions);
      setTotalQuestion(questionsQueryResult.data.getAllQuestions.totalQuestion);
      setLoading(false);
    }
  }, [questionsQueryResult.error, questionsQueryResult.data]);

  useEffect(() => {
    if (deleteQuestionResult.error) {
      setErrors(deleteQuestionResult.error.message);
      setLoading(true);
    }

    if (deleteQuestionResult.data) {
      if (deleteQuestionResult.data.deleteQuestion) {
        window.alert("question deleted successfully");
        setLoading(false);
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
            getAllQuestions: {
              totalQuestion: fetchMoreResult.getAllQuestions.totalQuestion,
              __typename: "QuestionsTotal",
              questions: [
                //...prev.getAllQuestions.questions,
                ...fetchMoreResult.getAllQuestions.questions,
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

  const handleButtonAction = (question) => {
    navigate("/edit_question", {
      state: { question: question},
    });
  };

  const handleQuestionDeleteAction = async ({ questionId, index }) => {
    //delete the question here
    try {
      setLoading(true);
      await deleteQuestion({
        variables: {
          questionId,
        },
        refetchQueries: [
          {
            query: GetAllQuestions,
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
            questions.map((question, index) => {
              return (
                <React.Fragment key={index}>
                  <ShowQuestionComponent
                    question={question}
                    components={[
                      EditButton({
                        variables: question,
                        style: "info",
                        buttonName: "Edit Question",
                        action: handleButtonAction,
                      }),
                      EditButton({
                        variables: {
                          questionId: question.id,
                          index: index + 1,
                        },
                        style: "danger",
                        buttonName: "Delete Question",
                        action: handleQuestionDeleteAction,
                      }),
                    ]}
                  />
                </React.Fragment>
              );
            })
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
