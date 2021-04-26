import React, { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { useRecoilState } from "recoil";
import state from "./applicationState";
import store from "store";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import styled from "styled-components";
import apolloClient from "./apolloClient";

//importation of routes in the system starts here

import Navigation from "./components/navbar";

import TryPage from "./components/try";

import PublicRoute from "./components/publicRoute";

import AuthorizedComponent from "./components/authorized";

import { useHistory } from "react-router-dom";

import Loadable from "react-loadable";
import Loader from "./common/loadableLoader";
import GlobalStyle from "./globalStyles";
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

//loadable content end here end of code splitting by route

const AppStyles = styled.div`
  .mainComponent {
    margin-top: 50px;
  }
`;

function App(props) {
  const [isAuth, setIsAuth] = useRecoilState(state.authState);
  const [currentLoginUser, setcurrentLoginUser] = useRecoilState(
    state.currentLoginUserState
  );
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
      <Router>
        <Navigation
          authenticated={isAuth}
          currentLoginUser={currentLoginUser}
          history={useHistory()}
        />
        <AppStyles>
          <Switch>
            <React.Fragment>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mainComponent">
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableViewCanidateExaminationScript}
                        exact
                        path="/view_canidate_script"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableViewCanidateSpellingScripts}
                        exact
                        path="/view_canidate_spelling_script"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableViewCanidateEssayScripts}
                        exact
                        path="/view_canidate_essay_script"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableUploadMedia}
                        exact
                        path="/upload_media"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableUsersPanel}
                        exact
                        path="/users"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableCreateUserAccount}
                        exact
                        path="/create_user_account"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableActivateExamSchedule}
                        exact
                        path="/activate_exams"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableCreateSubjectCourse}
                        exact
                        path="/create_subject"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["student"]}
                        component={LoadableQuestionPanel}
                        exact
                        path="/exam/multi_choice/:examId"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["student"]}
                        component={LoadableStartSpellingExam}
                        exact
                        path="/exam/spelling/:examId"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["student"]}
                        component={LoadableStartEssayExam}
                        exact
                        path="/exam/short_essay/:examId"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableViewExamResult}
                        exact
                        path="/exam_results"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={LoadableDisplayQuizScriptComponent}
                        exact
                        path="/examination_script/:examId"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={LoadableDisplaySpellingQuizScriptComponent}
                        exact
                        path="/spelling_examination_script/:examId"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={LoadableDisplayEssayQuizScriptComponent}
                        exact
                        path="/essay_examination_script/:examId"
                      />
                      <Route exact path="/try" component={TryPage} />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={LoadableExamSummaryComponent}
                        exact
                        path="/exam_summary/:examId"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={LoadableSpellingExamSummary}
                        exact
                        path="/exam_summary/spelling/:examId"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={LoadableEssayExamSummary}
                        exact
                        path="/exam_summary/essay/:examId"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableUploadExaminationQuestion}
                        exact
                        path="/upload_questions"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableAddQuestion}
                        exact
                        path="/add_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableSaveSpellingQuestions}
                        exact
                        path="/add_spelling_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableSaveEssayQuestions}
                        exact
                        path="/add_essay_question"
                      />

                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableEditEssayQuestion}
                        exact
                        path="/edit_essay_question"
                      />

                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableLoadQuestionsComponent}
                        exact
                        path="/load_multi_choice_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableLoadSpellingQuestions}
                        exact
                        path="/load_spelling_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableLoadEssayQuestion}
                        exact
                        path="/load_essay_question"
                      />

                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableEditQuestionComponent}
                        exact
                        path="/edit_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableCreateExaminationSchedule}
                        exact
                        path="/create_examination_schedule"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableAddQuestionsToExaminationComponent}
                        exact
                        path="/add_questions_examination"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadableAddEssayQuestionsToExam}
                        exact
                        path="/add_essay_questions_examination"
                      />
                      <PublicRoute
                        component={LoadableLoginPage}
                        {...props}
                        path={"/login"}
                        authenticated={isAuth}
                        exact
                      />
                      <Route
                        exact
                        path="/dashboard"
                        component={LoadableDashboard}
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["student"]}
                        component={LoadableActiveExaminationPage}
                        exact
                        path="/exam_start_page"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          </Switch>
        </AppStyles>
      </Router>
    </ApolloProvider>
  );
}
export default App;
