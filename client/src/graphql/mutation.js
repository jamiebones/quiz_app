import { gql } from "@apollo/client";

const UploadBulkExaminationQuestions = gql`
  mutation saveBulkQuestion($input: [QuestionInput]) {
    saveBulkQuestion(input: $input)
  }
`;

const SubmitQuestion = gql`
  mutation submitQuestion($input: QuestionInput!) {
    submitQuestion(input: $input)
  }
`;

const SaveSpelling = gql`
  mutation submitSpellingQuestion($input: SpellingQuestionInput!) {
    submitSpellingQuestion(input: $input)
  }
`;

const SaveEssayQuestion = gql`
  mutation saveEssayQuestion($input: EssayExamQuestionInput!) {
    saveEssayQuestion(input: $input){
      id
    }
  }
`;

const EditEssayQuestion = gql`
  mutation saveEssayQuestion($input: EssayExamQuestionInput2!) {
    editEssayQuestion(input: $input)
  }
`;

const EditSpelling = gql`
  mutation editSpellingQuestion(
    $input: SpellingQuestionInput!
    $questionId: ID!
  ) {
    editSpellingQuestion(input: $input, questionId: $questionId)
  }
`;

const EditQuestion = gql`
  mutation editQuestion($input: QuestionInput!, $questionId: ID!) {
    editQuestion(input: $input, questionId: $questionId)
  }
`;

const DeleteOneQuestion = gql`
  mutation deleteQuestion($questionId: ID!) {
    deleteQuestion(questionId: $questionId)
  }
`;

const DeleteMedia  = gql`
mutation deleteMedia($questionId: ID!, $mediaUrl: String!) {
  deleteMedia(questionId: $questionId, mediaUrl: $mediaUrl)
}
`;

const DeleteOneEssayQuestion = gql`
  mutation deleteQuestion($questionId: ID!) {
    deleteEssayQuestion(questionId: $questionId)
  }
`;

const DeleteOneSpellingQuestion = gql`
  mutation deleteQuestion($questionId: ID!) {
    deleteSpellingQuestion(questionId: $questionId)
  }
`;

const CreateExaminationSchedule = gql`
  mutation createExamSchedule($input: MultipleExamScheduleInput!) {
    createMultipleExamSchedule(input: $input){
      id
      examinationName
    }
  }
`;

const CreateSpellingExaminationSchedule = gql`
  mutation createExamSchedule($input: SpellingExamScheduleInput!) {
    createSpellingExamSchedule(input: $input){
      id
      examinationName
    }
  }
`;

const CreateEssayExaminationSchedule = gql`
  mutation createExamSchedule($input: EssayExamScheduleInput!) {
    createEssayExamSchedule(input: $input){
      id
      examinationName
    }
  }
`;



const AddQuestionsToScheduleExamination = gql`
  mutation addQuestionsToExam(
    $questionsArray: [ QuestionInput2!]
    $scheduleId: ID!
  ) {
    addQuestionsToExam(
      questionsArray: $questionsArray
      scheduleId: $scheduleId
    )
  }
`;

const AddSpellingQuestionsArrayToScheduleExam = gql`
  mutation addQuestions(
    $questionsArray: [SpellingQuestionInput2!]
    $scheduleId: ID!
  ) {
    addSpellingQuestionsToExam(
      questionsArray: $questionsArray
      scheduleId: $scheduleId
    )
  }
`;

const AddEssayQuestionsArrayToScheduleExam = gql`
  mutation addEssayQuestions(
    $questionsArray: [EssayQuestionInputTypeForExamSchedule!]
    $scheduleId: ID!
  ) {
    addEssayQuestionsToExam(
      questionsArray: $questionsArray
      scheduleId: $scheduleId
    )
  }
`;

//



const CreateNewUserAccount = gql`
  mutation CreateUserAccount(
    $username: String!
    $password: String!
    $name: String!
    $userType: String!
    $active: Boolean!
  ) {
    createUser(
      username: $username
      userType: $userType
      name: $name
      password: $password
      active: $active
    ) {
      __typename
      ... on User {
        username
        userType
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`;

const ActivateExamination = gql`
  mutation ActivateExamination($examId: ID!) {
    makeExamActive(examId: $examId) {
      __typename
      ... on ActiveExamSuccessful {
        message
      }
      ... on Error {
        message
      }
    }
  }
`;

const StartExamination = gql`
  mutation StartExamination($examDetails: ExamTakenInput!) {
    startExam(examDetails: $examDetails) {
      __typename
      ... on ExamTakenSuccess {
        message
        examId
        type
        questionType
      }
      ... on Error {
        message
      }
    }
  }
`;

//
const UpdateExaminationSchedule = gql`
  mutation UpdateExaminationSchedule($examId: ID!, $status: Boolean!) {
    changeExamStatus(examId: $examId, status: $status) {
      __typename
      ... on ActiveExamSuccessful {
        message
      }
      ... on Error {
        message
      }
    }
  }
`;

const ExaminationEnded = gql`
  mutation ExaminationEnded($submissionDetails: ExamFinishedInput!) {
    examEnded(submissionDetails: $submissionDetails)
  }
`;

const SpellingExaminationEnded = gql`
  mutation ExaminationEnded($submissionDetails: SpellingExamFinishedInput!) {
    spellingExamEnded(submissionDetails: $submissionDetails)
  }
`;

const EssayExaminationEnded = gql`
  mutation ExaminationEnded($submissionDetails: EssayExamFinishedInput!) {
    essayExamEnded(submissionDetails: $submissionDetails)
  }
`;

const CreateCourseSubject = gql`
  mutation CreateCourseSubject($examName: String!, $examType: String!) {
    createExam(examName: $examName, examType: $examType)
  }
`;

const ChangeUserPassword = gql`
  mutation ChangeUserPassword($username: String!, $newPassword: String!) {
    changePassword(username: $username, newPassword: $newPassword)
  }
`;

const ChangeActiveStatusOfUsers = gql`
  mutation ChangeActiveStatusOfUser($id: ID!, $active: Boolean!) {
    changeUserStatus(id: $id, active: $active)
  }
`;

const ChangeUserPasswordMutation = gql`
  mutation ChangeUserPasswordMutation(
    $newPassword: String!
    $username: String!
  ) {
    changePassword(newPassword: $newPassword, username: $username)
  }
`;

const UploadBulkSpellingQuestions = gql`
  mutation saveBulkSpellingQuestion($input: [SpellingQuestionInput]) {
    saveBulkSpellingQuestion(input: $input)
  }
`;

export {
  UploadBulkSpellingQuestions,
  UploadBulkExaminationQuestions,
  SubmitQuestion,
  EditQuestion,
  DeleteOneQuestion,
  CreateExaminationSchedule,
  AddSpellingQuestionsArrayToScheduleExam,
  CreateNewUserAccount,
  ActivateExamination,
  StartExamination,
  ExaminationEnded,
  CreateCourseSubject,
  UpdateExaminationSchedule,
  ChangeUserPassword,
  ChangeActiveStatusOfUsers,
  ChangeUserPasswordMutation,
  SaveSpelling,
  CreateSpellingExaminationSchedule,
  SpellingExaminationEnded,
  DeleteOneSpellingQuestion,
  EditSpelling,
  SaveEssayQuestion,
  CreateEssayExaminationSchedule,
  AddEssayQuestionsArrayToScheduleExam,
  EssayExaminationEnded,
  DeleteOneEssayQuestion,
  DeleteMedia,
  EditEssayQuestion,
  AddQuestionsToScheduleExamination
};
