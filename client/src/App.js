import React, { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { useAuth, ExamProvider } from "./context";
import store from "store";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import apolloClient from "./apolloClient";

//importation of routes in the system starts here

import Navigation from "./components/navbar";

import Footer from "./common/footer";

import Loadable from "react-loadable";
import Loader from "./common/loadableLoader";
import GlobalStyle from "./globalStyles";
import { AuthorizedRoutes } from "./Routes";
//import localStorage from "./localStorage";

//loadable content start here start of code splitting by route
const LoadableQuestionPanel = Loadable({
  loader: () => import("./components/questionPanel"),
  loading: Loader,
  delay: 300,
});

const LoadableExamSummaryComponent = Loadable({
  loader: () => import("./components/examSummaryComponent"),
  loading: Loader,
  delay: 300,
});

const LoadableUploadExaminationQuestion = Loadable({
  loader: () => import("./components/uploadExaminationQuestions"),
  loading: Loader,
  delay: 300,
});
const LoadableAddQuestion = Loadable({
  loader: () => import("./components/saveNewQuestion"),
  loading: Loader,
  delay: 300,
});
const LoadableLoadQuestionsComponent = Loadable({
  loader: () => import("./components/loadQuestionsComponent"),
  loading: Loader,
  delay: 300,
});
const LoadableEditQuestionComponent = Loadable({
  loader: () => import("./components/editQuestionComponent"),
  loading: Loader,
  delay: 300,
});
const LoadableCreateExaminationSchedule = Loadable({
  loader: () => import("./components/createExaminationSchedule"),
  loading: Loader,
  delay: 300,
});
const LoadableAddQuestionsToExaminationComponent = Loadable({
  loader: () => import("./components/addQuestionsToExamination"),
  loading: Loader,
  delay: 300,
});
const LoadableLoginPage = Loadable({
  loader: () => import("./components/login"),
  loading: Loader,
  delay: 300,
});
const LoadableDashboard = Loadable({
  loader: () => import("./components/dashboard"),
  loading: Loader,
  delay: 300,
});
const LoadableActiveExaminationPage = Loadable({
  loader: () => import("./components/activeExams"),
  loading: Loader,
  delay: 300,
});
const LoadableDisplayQuizScriptComponent = Loadable({
  loader: () => import("./components/displayQuizScriptComponent"),
  loading: Loader,
  delay: 300,
});
const LoadableViewExamResult = Loadable({
  loader: () => import("./components/viewExamResult"),
  loading: Loader,
  delay: 300,
});
const LoadableViewCanidateExaminationScript = Loadable({
  loader: () => import("./components/viewCanidateExaminationScripts"),
  loading: Loader,
  delay: 300,
});
const LoadableCreateSubjectCourse = Loadable({
  loader: () => import("./components/createSubjectCourse"),
  loading: Loader,
  delay: 300,
});
const LoadableActivateExamSchedule = Loadable({
  loader: () => import("./components/activateScheduleExaminationPanel"),
  loading: Loader,
  delay: 300,
});
const LoadableCreateUserAccount = Loadable({
  loader: () => import("./components/createUserAccount"),
  loading: Loader,
  delay: 300,
});
const LoadableUsersPanel = Loadable({
  loader: () => import("./components/usersPanel"),
  loading: Loader,
  delay: 300,
});
const LoadableUploadMedia = Loadable({
  loader: () => import("./components/uploadMedia"),
  loading: Loader,
  delay: 300,
});
const LoadableSaveSpellingQuestions = Loadable({
  loader: () => import("./components/saveSpellingQuestions"),
  loading: Loader,
  delay: 300,
});
const LoadableStartSpellingExam = Loadable({
  loader: () => import("./components/startSpellingExam"),
  loading: Loader,
  delay: 300,
});
const LoadableSpellingExamSummary = Loadable({
  loader: () => import("./components/spellingExamSummary"),
  loading: Loader,
  delay: 300,
});
const LoadableDisplaySpellingQuizScriptComponent = Loadable({
  loader: () => import("./components/displaySpellingScriptComponent"),
  loading: Loader,
  delay: 300,
});
const LoadableDisplayEssayQuizScriptComponent = Loadable({
  loader: () => import("./components/displayEssayScriptComponent"),
  loading: Loader,
  delay: 300,
});

const LoadableViewCanidateEssayScripts = Loadable({
  loader: () => import("./components/viewEssayExaminationScripts"),
  loading: Loader,
  delay: 300,
});
const LoadableViewCanidateSpellingScripts = Loadable({
  loader: () => import("./components/viewSpellingExaminationScript"),
  loading: Loader,
  delay: 300,
});
const LoadableLoadSpellingQuestions = Loadable({
  loader: () => import("./components/loadSpellingQuestions"),
  loading: Loader,
  delay: 300,
});
const LoadableLoadEssayQuestion = Loadable({
  loader: () => import("./components/loadEssayQuestions"),
  loading: Loader,
  delay: 300,
});
const LoadableSaveEssayQuestions = Loadable({
  loader: () => import("./components/saveEssayQuestions"),
  loading: Loader,
  delay: 300,
});
const LoadableAddEssayQuestionsToExam = Loadable({
  loader: () => import("./components/addEssayQuestionsToExam"),
  loading: Loader,
  delay: 300,
});
const LoadableStartEssayExam = Loadable({
  loader: () => import("./components/startEssayExam"),
  loading: Loader,
  delay: 300,
});

const LoadableEssayExamSummary = Loadable({
  loader: () => import("./components/essayExamSummary"),
  loading: Loader,
  delay: 300,
});

const LoadableEditEssayQuestion = Loadable({
  loader: () => import("./components/editEssayQuestions"),
  loading: Loader,
  delay: 300,
});

const LoadableRunningExamination = Loadable({
  loader: () => import("./components/viewRunningExaminations"),
  loading: Loader,
  delay: 300,
});

//loadable content end here end of code splitting by route

const AppStyles = styled.div`
  .mainComponent {
    margin-top: 50px;
    margin-bottom: 70px;
  }
`;

function App(props) {
  const {
    isAuth,
    setIsAuth,
    currentLoginUser,
    setcurrentLoginUser,
    token,
    setToken,
  } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentLoginUser) {
      //load the stuffs from the store if it exists
      const user = store.get("currentLoginUser");
      if (user) {
        const parsedUserData = user && JSON.parse(user);
        if (parsedUserData.hasOwnProperty("id")) {
          setcurrentLoginUser(parsedUserData);
          setIsAuth(true);
        }
      }
    }
    setLoading(false);
  }, [currentLoginUser]);

  return (
    <ApolloProvider client={apolloClient}>
      <GlobalStyle />
      <ExamProvider>
        <Router>
          <AppStyles>
            <Navigation
              authenticated={isAuth}
              currentLoginUser={currentLoginUser}
            />
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="mainComponent">
                    <Routes>
                      {/** super-admin links start here  */}

                      <Route
                        element={
                          <AuthorizedRoutes authorizedRole={["super-admin"]} />
                        }
                      >
                        <Route
                          element={<LoadableRunningExamination />}
                          path="/view_running_examination"
                        />
                        <Route
                          element={<LoadableViewCanidateExaminationScript />}
                          path="/view_canidate_script"
                        />
                        <Route
                          element={<LoadableViewCanidateSpellingScripts />}
                          path="/view_canidate_spelling_script"
                        />
                        <Route
                          element={<LoadableViewCanidateEssayScripts />}
                          path="/view_canidate_essay_script"
                        />

                        <Route
                          element={<LoadableUploadMedia />}
                          path="/upload_media"
                        />
                        <Route element={<LoadableUsersPanel />} path="/users" />

                        <Route
                          element={<LoadableCreateUserAccount />}
                          path="/create_user_account"
                        />

                        <Route
                          element={<LoadableActivateExamSchedule />}
                          path="/activate_exams"
                        />

                        <Route
                          element={<LoadableCreateSubjectCourse />}
                          path="/create_subject"
                        />

                        <Route
                          element={<LoadableViewExamResult />}
                          path="/exam_results"
                        />

                        <Route
                          element={<LoadableUploadExaminationQuestion />}
                          path="/upload_questions"
                        />
                        <Route
                          element={<LoadableAddQuestion />}
                          path="/add_question"
                        />
                        <Route
                          element={<LoadableSaveSpellingQuestions />}
                          path="/add_spelling_question"
                        />

                        <Route
                          element={<LoadableSaveEssayQuestions />}
                          path="/add_essay_question"
                        />

                        <Route
                          element={<LoadableEditEssayQuestion />}
                          path="/edit_essay_question"
                        />
                        <Route
                          element={<LoadableLoadQuestionsComponent />}
                          path="/load_multi_choice_question"
                        />
                        <Route
                          element={<LoadableLoadSpellingQuestions />}
                          path="/load_spelling_question"
                        />

                        <Route
                          element={<LoadableLoadEssayQuestion />}
                          path="/load_essay_question"
                        />

                        <Route
                          element={<LoadableEditQuestionComponent />}
                          path="/edit_question"
                        />

                        <Route
                          element={<LoadableCreateExaminationSchedule />}
                          path="/create_examination_schedule"
                        />

                        <Route
                          element={
                            <LoadableAddQuestionsToExaminationComponent />
                          }
                          path="/add_questions_examination"
                        />

                        <Route
                          element={<LoadableAddEssayQuestionsToExam />}
                          path="/add_essay_questions_examination"
                        />

                        <Route
                          element={<LoadableEditQuestionComponent />}
                          path="/edit_question"
                        />
                      </Route>
                      {/** super-admin links end here  */}

                      {/** student links start here  */}

                      <Route
                        element={
                          <AuthorizedRoutes authorizedRole={["student"]} />
                        }
                      >
                        <Route
                          element={<LoadableQuestionPanel />}
                          path="/exam/multi_choice/:examId"
                        />
                        <Route
                          element={<LoadableStartSpellingExam />}
                          path="/exam/spelling/:examId"
                        />

                        <Route
                          element={<LoadableStartEssayExam />}
                          path="/exam/short_essay/:examId"
                        />
                        <Route
                          element={<LoadableViewCanidateEssayScripts />}
                          path="/view_canidate_essay_script"
                        />

                        <Route
                          element={<LoadableActiveExaminationPage />}
                          path="/exam_start_page"
                        />
                      </Route>
                      {/** student links end here  */}

                      {/** super-admin and student links start here  */}
                      <Route
                        element={
                          <AuthorizedRoutes
                            authorizedRole={["super-admin", "student"]}
                          />
                        }
                      >
                        <Route
                          element={<LoadableDisplayQuizScriptComponent />}
                          path="/examination_script/:examId"
                        />
                        <Route
                          element={
                            <LoadableDisplaySpellingQuizScriptComponent />
                          }
                          path="/spelling_examination_script/:examId"
                        />
                        <Route
                          element={<LoadableDisplayEssayQuizScriptComponent />}
                          path="/essay_examination_script/:examId"
                        />

                        <Route
                          element={<LoadableExamSummaryComponent />}
                          path="/exam_summary/:examId"
                        />

                        <Route
                          element={<LoadableSpellingExamSummary />}
                          path="/exam_summary/spelling/:examId"
                        />

                        <Route
                          element={<LoadableEssayExamSummary />}
                          path="/exam_summary/essay/:examId"
                        />
                      </Route>
                      {/** super-admin and student links end here  */}
                      <Route element={<LoadableLoginPage />} path={"/login"} />
                      <Route
                        exact
                        path="/dashboard"
                        element={<LoadableDashboard />}
                      />
                    </Routes>
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </AppStyles>
        </Router>
      </ExamProvider>
    </ApolloProvider>
  );
}
export default App;
