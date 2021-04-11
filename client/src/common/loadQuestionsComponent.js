import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GetAllQuestions, GetAllSpellingQuestions } from "../graphql/queries";
import ShowQuestionComponent from "./showQuestionsComponent";
import ShowSpellingComponent from "./showSpellingComponent";
import Loading from "../common/loading";
import styled from "styled-components";

const LoadQuestionsStyle = styled.div``;

const buttonsToDisplay = (total, numberPerPage) => {
  const buttonNumber = +total / +numberPerPage;
  let array = [];
  array.length = Math.ceil(buttonNumber);
  return array.fill(1);
};

const LoadQuestionsComponent = ({
  examId,
  handleQuestionClick,
  examType,
}) => {
  const [loadingData, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [questions, setQuestions] = useState({});
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [queryRan, setQueryRan] = useState(false);

  const [questionsQuery, questionsQueryResult] = useLazyQuery(GetAllQuestions, {
    variables: {
      examId: examId,
    },
  });

  const [spellingQuestionsQuery, spellingQuestionsQueryResult] = useLazyQuery(
    GetAllSpellingQuestions,
    {
      variables: {
        examId: examId,
      },
    }
  );

  useEffect(() => {
    switch (examType) {
      case "multiple choice questions":
        questionsQuery();
        break;

      case "spelling examination":
        spellingQuestionsQuery();
        break;
      case "short answer exam":
        break;
      case "essay exam":
        break;
      case "quantitative exam":
        break;
    }
  }, [examId]);

  //effects for multiple choice questions
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

  //effect for spelling questions loading
  useEffect(() => {
    if (spellingQuestionsQueryResult.error) {
      setErrors(spellingQuestionsQueryResult.error.message);
      setLoading(true);
      setQueryRan(!queryRan);
    }

    if (spellingQuestionsQueryResult.data) {

      setQuestions(
        spellingQuestionsQueryResult.data.getAllSpellingQuestions.questions
      );
      setTotalQuestion(
        spellingQuestionsQueryResult.data.getAllSpellingQuestions.totalQuestion
      );
      
      setLoading(false);
    }
  }, [spellingQuestionsQueryResult.error, spellingQuestionsQueryResult.data]);

  //get more questions for multiple choice questions
  const getMoreQuestions = (e, index) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      setLoading(true);
      setQueryRan(!queryRan);
      questionsQueryResult.fetchMore({
        variables: {
          examId: examId,
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

  //get more questions for spelling questions
  const getMoreSpellingQuestions = (e, index) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      setLoading(true);
      setQueryRan(!queryRan);
      spellingQuestionsQueryResult.fetchMore({
        variables: {
          examId: examId,
          offset: questions.length * (index - 1),
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            getAllSpellingQuestions: {
              totalQuestion:
                fetchMoreResult.getAllSpellingQuestions.totalQuestion,
              __typename: "QuestionsTotal",
              questions: [
                //...prev.getAllQuestions.questions,
                ...fetchMoreResult.getAllSpellingQuestions.questions,
              ],
            },
          });
        },
      });
    } catch (error) {}
  };

  return (
    <LoadQuestionsStyle>
      {errors && <p className="lead text-danger">Error: {errors}</p>}

      {examType === "multiple choice questions" &&
      questions &&
      questions.length > 0 ? (
        questions.map((question, index) => {
          return (
            <div key={index} onClick={() => handleQuestionClick(question)}>
              <ShowQuestionComponent question={question} />
            </div>
          );
        })
      ) : (
        <div>{queryRan && <p>No questions saved yet.</p>}</div>
      )}

      {examType === "spelling examination" && questions &&
      questions.length > 0 ? (
        questions.map((word, index) => {
          return (
            <div key={index} onClick={() => handleQuestionClick(word)}>
              <ShowSpellingComponent question={word} />
            </div>
          );
        })
      ) : (
        <div>{queryRan && <p>No questions saved yet.</p>}</div>
      )}

      {loadingData && <Loading />}

      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {examType === "multiple choice questions" &&
            totalQuestion > 0 &&
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

          {examType === "spelling examination" &&
            totalQuestion > 0 &&
            buttonsToDisplay(totalQuestion, 20).map((_, index) => {
              return (
                <li
                  className="page-item"
                  key={index}
                  onClick={(e) => getMoreSpellingQuestions(e, index + 1)}
                >
                  <a className="page-link" href="">
                    {index + 1}
                  </a>
                </li>
              );
            })}
        </ul>
      </nav>
    </LoadQuestionsStyle>
  );
};

export default LoadQuestionsComponent;
