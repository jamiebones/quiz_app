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
import QuestionPanel from "./components/questionPanel";
import TryPage from "./components/try";

import ExamSummaryComponent from "./components/examSummaryComponent";

import UploadExaminationQuestion from "./components/uploadExaminationQuestions";
import AddQuestion from "./components/saveNewQuestion";
import LoadQuestionsComponent from "./components/loadQuestionsComponent";
import EditQuestionComponent from "./components/editQuestionComponent";
import CreateExaminationSchedule from "./components/createExaminationSchedule";
import AddQuestionsToExaminationComponent from "./components/addQuestionsToExamination";
import LoginPage from "./components/login";
import PublicRoute from "./components/publicRoute";
import Dashboard from "./components/dashboard";
import ActiveExaminationPage from "./components/activeExams";
import DisplayQuizScriptComponent from "./components/displayQuizScriptComponent";
import AuthorizedComponent from "./components/authorized";
import ViewExamResult from "./components/viewExamResult";
import ViewCanidateExaminationScript from "./components/viewCanidateExaminationScripts";
import CreateSubjectCourse from "./components/createSubjectCourse";
import ActivateExamSchedule from "./components/activateScheduleExaminationPanel";
import CreateUserAccount from "./components/createUserAccount";
import UsersPanel from "./components/usersPanel";
import UploadMedia from "./components/uploadMedia";
import SaveSpellingQuestions from "./components/saveSpellingQuestions";
import StartSpellingExam from "./components/startSpellingExam";
import SpellingExamSummary from "./components/spellingExamSummary";
import DisplaySpellingQuizScriptComponent from "./components/displaySpellingScriptComponent";
import ViewCanidateSpellingScripts from "./components/viewSpellingExaminationScript";
import LoadSpellingQuestions from "./components/loadSpellingQuestions";
import SaveEssayQuestions from "./components/saveEssayQuestions";
import AddEssayQuestionsToExam from "./components/addEssayQuestionsToExam";
import StartEssayExam from "./components/startEssayExam";
import EssayExamSummary from "./components/essayExamSummary";
import DisplayEssayQuizScriptComponent from "./components/displayEssayScriptComponent";
import { useHistory } from "react-router-dom";
import GlobalStyle from "./globalStyles";
//import localStorage from "./localStorage";

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
                        component={ViewCanidateExaminationScript}
                        exact
                        path="/view_canidate_script"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={ViewCanidateSpellingScripts}
                        exact
                        path="/view_canidate_spelling_script"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={UploadMedia}
                        exact
                        path="/upload_media"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={UsersPanel}
                        exact
                        path="/users"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={CreateUserAccount}
                        exact
                        path="/create_user_account"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={ActivateExamSchedule}
                        exact
                        path="/activate_exams"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={CreateSubjectCourse}
                        exact
                        path="/create_subject"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["student"]}
                        component={QuestionPanel}
                        exact
                        path="/exam/multi_choice/:examId"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["student"]}
                        component={StartSpellingExam}
                        exact
                        path="/exam/spelling/:examId"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["student"]}
                        component={StartEssayExam}
                        exact
                        path="/exam/short_essay/:examId"
                      />

                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={ViewExamResult}
                        exact
                        path="/exam_results"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={DisplayQuizScriptComponent}
                        exact
                        path="/examination_script/:examId"
                      />
                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={DisplaySpellingQuizScriptComponent}
                        exact
                        path="/spelling_examination_script/:examId"
                      />

                      <AuthorizedComponent
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={DisplayEssayQuizScriptComponent}
                        exact
                        path="/essay_examination_script/:examId"
                      />

                      <Route exact path="/try" component={TryPage} />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={ExamSummaryComponent}
                        exact
                        path="/exam_summary/:examId"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={SpellingExamSummary}
                        exact
                        path="/exam_summary/spelling/:examId"
                      />

                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin", "student"]}
                        component={EssayExamSummary}
                        exact
                        path="/exam_summary/essay/:examId"
                      />

                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={UploadExaminationQuestion}
                        exact
                        path="/upload_questions"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={AddQuestion}
                        exact
                        path="/add_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={SaveSpellingQuestions}
                        exact
                        path="/add_spelling_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={SaveEssayQuestions}
                        exact
                        path="/add_essay_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadQuestionsComponent}
                        exact
                        path="/load_multi_choice_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={LoadSpellingQuestions}
                        exact
                        path="/load_spelling_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={EditQuestionComponent}
                        exact
                        path="/edit_question"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={CreateExaminationSchedule}
                        exact
                        path="/create_examination_schedule"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={AddQuestionsToExaminationComponent}
                        exact
                        path="/add_questions_examination"
                      />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["super-admin"]}
                        component={AddEssayQuestionsToExam}
                        exact
                        path="/add_essay_questions_examination"
                      />
                      <PublicRoute
                        component={LoginPage}
                        {...props}
                        path={"/login"}
                        authenticated={isAuth}
                        exact
                      />
                      <Route exact path="/dashboard" component={Dashboard} />
                      <AuthorizedComponent
                        loading={loading}
                        currentLoginUser={currentLoginUser}
                        authenticated={isAuth}
                        authorizedRole={["student"]}
                        component={ActiveExaminationPage}
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
