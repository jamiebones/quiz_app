import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GetAllEssayQuestions } from "../graphql/queries";
import ShowQuestionComponent from "./showQuestionsComponent";
import Loading from "../common/loading";
import styled from "styled-components";

const LoadQuestionsStyle = styled.div``;

const buttonsToDisplay = (total, numberPerPage) => {
  const buttonNumber = +total / +numberPerPage;
  let array = [];
  array.length = Math.ceil(buttonNumber);
  return array.fill(1);
};

const LoadEssayQuestionComponent = ({
  examId,
  handleQuestionClick,
  examType,
}) => {
  const [loadingData, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [questions, setQuestions] = useState({});
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [queryRan, setQueryRan] = useState(false);

  const [essayQuestionsQuery, essayQuestionsQueryResult] = useLazyQuery(
    GetAllEssayQuestions,
    {
      variables: {
        examId: examId,
      },
    }
  );

  useEffect(() => {
    switch (examType) {
      case "short answer exam":
        essayQuestionsQuery();
        break;
      case "essay exam":
        break;
    }
  }, [examId]);

  //effect for spelling questions loading
  useEffect(() => {
    if (essayQuestionsQueryResult.error) {
      setErrors(essayQuestionsQueryResult.error.message);
      setLoading(true);
      setQueryRan(!queryRan);
    }

    if (essayQuestionsQueryResult.data) {
      setQuestions(
        essayQuestionsQueryResult.data.getAllEssayQuestions.questions
      );
      setTotalQuestion(
        essayQuestionsQueryResult.data.getAllEssayQuestions.totalQuestion
      );

      setLoading(false);
    }
  }, [essayQuestionsQueryResult.error, essayQuestionsQueryResult.data]);

  //get more questions for multiple choice questions
  const getMoreQuestions = (e, index) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      setLoading(true);
      setQueryRan(!queryRan);
      essayQuestionsQueryResult.fetchMore({
        variables: {
          examId: examId,
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

  return (
    <LoadQuestionsStyle>
      {errors && <p className="lead text-danger">Error: {errors}</p>}

      {examType === "short answer exam" &&
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

      {loadingData && <Loading />}

      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {examType === "short answer exam" &&
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
        </ul>
      </nav>
    </LoadQuestionsStyle>
  );
};

export default LoadEssayQuestionComponent;
