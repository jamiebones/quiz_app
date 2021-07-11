import React, { useEffect, useState } from "react";
import QuestionComponent from "./questionComponent";
import QuestionButtonComponent from "./questionButtonsComponent";
import QuestionsNumberDiv from "./questionsNumberDiv";
import styled from "styled-components";
import CountDownTimer from "./countDownTimer";
//import NewWindow from "react-new-window";
import state from "../applicationState";
import { useRecoilValue } from "recoil";
import { useMutation } from "@apollo/client";
import { ExaminationEnded } from "../graphql/mutation";
import store from "store";
import methods from "../methods";
import Modal from "react-modal";
import { useRouteMatch } from "react-router-dom";
Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const QuestionPanelStyles = styled.div`
  display: flex;
  flex-direction: column;
  .button-div {
    display: block;
  }
`;

const disableContext = (e) => {
  e.preventDefault();
};

const disableButtons = (e) => {
  const code = e.which || e.keyCode;
  switch (code) {
    case 116:
      return e.preventDefault();
    default:
      return true;
  }
};

const QuestionPanel = (props) => {
  const match = useRouteMatch("/exam/multi_choice/:examId");
  const [examinationEndedFunction, examinationEndedResult] =
    useMutation(ExaminationEnded);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(null);
  const [examIdValue, setExamIdValue] = useState(null);

  const examStarted = useRecoilValue(state.examStartedState);
  const questions = useRecoilValue(state.questionsState);
  const questionsFromStore = store.get("examQuestions");
  const examIdinStore = store.get("examId");
  const examStartedinStore = store.get("examStarted");
  const [scoreDetails, setScoreDetails ] = useState(null)

  let examId = match.params.examId;

  useEffect(() => {
    if (!examId) {
      props.history.push("/exam_start_page");
    }
    setExamIdValue(examId);
  }, [examId]);

  useEffect(() => {
    window.addEventListener("contextmenu", disableContext);
    window.addEventListener("keydown", disableButtons);
    return () => {
      window.removeEventListener("contextmenu", disableContext);
      window.removeEventListener("keydown", disableButtons);
    };
  });

  useEffect(() => {
    const { loading, data, error } = examinationEndedResult;
    if (loading) {
      //show a modal asking them to wait that submission is on going.
    }
    if (data) {
      //redirect here to the summary page
      setSubmitting(!submitting);
      //methods.Utils.ClearStoreValue();
      console.log("exam id ", examId);
      props.history.replace(`/exam_summary/${examId}`,  {
        scoreDetails: scoreDetails,
      });
    }

    if (error) {
      //run the query submission again
      //while (tryAgain < 3) {
      //
      //submitQuizHandler();
      // setTryAgain(tryAgain + 1);
      //}
      setErrors(error.message);
      setSubmitting(!submitting);
    }
  }, [
    examinationEndedResult.loading,
    examinationEndedResult.data,
    examinationEndedResult.error,
  ]);

  const submitQuizHandler = async () => {
    //get the quiz answers and the other variables in the system
    let examStartedVariable, examIdVariable;
    examStartedVariable = examStarted ? examStarted : examStartedinStore;
    examIdVariable = examId ? examId : examIdinStore;
    const answersArray = questions ? questions : questionsFromStore;
    if (examStartedVariable && examIdVariable) {
      //we are good we can gather things here
      const score = methods.ExamMarking(answersArray);
      const scripts = methods.GenerateScripts(answersArray);
      const submissionObject = {
        examTakenId: examIdVariable,
        examFinished: true,
        timeExamEnded: new Date(),
        score,
        scripts,
      };
      setScoreDetails({
        score,
        scripts,
        examId: examIdVariable,
        totalQuestions: scripts.length,
      })
      try {
        setSubmitting(!submitting);
        await examinationEndedFunction({
          variables: {
            submissionDetails: submissionObject,
          },
        });
      } catch (error) {}
    }
  };

  return (
    <React.Fragment>
      {/* <NewWindow
      title="Examination panel page"
      features={((window.innerHeight = 900), (window.innerWidth = 1200))}
    >  */}
      {/* <Suspense fallback={<h3>Loading Questions...</h3>}> */}
      <QuestionPanelStyles>
        <div className="row">
          <div className="col-md-8">
            {errors && <p className="lead text-danger">{errors}</p>}
            <QuestionComponent />

            <QuestionButtonComponent
              {...props}
              submitQuiz={submitQuizHandler}
            />
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <CountDownTimer submitQuiz={submitQuizHandler} />
            </div>

            <QuestionsNumberDiv />
          </div>
        </div>
      </QuestionPanelStyles>
      {/* </Suspense> */}
      {/* </NewWindow>  */}

      <Modal
        isOpen={submitting}
        style={customStyles}
        contentLabel="Examination submission modal"
      >
        <p>Submitting examination please wait........</p>
      </Modal>
    </React.Fragment>
  );
};

export default QuestionPanel;
