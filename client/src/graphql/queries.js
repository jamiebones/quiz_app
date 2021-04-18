import { gql } from "@apollo/client";

const GetAllExamination = gql`
  query getAllExam {
    getAllExam {
      id
      examName
      examType
    }
  }
`;

const GetAllMultiChoiceExamination = gql`
  query getMultiChoiceExam($examType: String!) {
    getAllMultiChoiceExam(examType: $examType) {
      id
      examName
      examType
    }
  }
`;

const GetAllQuestionsByExamID = gql`
  query getExamQuestions($examId: String!, $cursor: String, $limit: Int) {
    getExamQuestions(examId: $examId, cursor: $cursor, limit: $limit) {
      edges {
        id
        question
        answers {
          isCorrect
          option
          selected
        }
        questionImageUrl
        examinationType
        examId
        explanation
      }

      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GetAllQuestions = gql`
  query getAllQuestions($examId: String!, $offset: Int) {
    getAllQuestions(examId: $examId, offset: $offset) {
      questions {
        id
        question
        answers {
          isCorrect
          option
          selected
        }
        questionImageUrl
        examinationType
        examId
        explanation
      }
      totalQuestion
    }
  }
`;

const GetAllEssayQuestions = gql`
  query getAllEssayQuestions($examId: String!, $offset: Int) {
    getAllEssayQuestions(examId: $examId, offset: $offset) {
      questions {
        id
        type
        question
        clue
        possibleAnswers
        mediaUrl
        examId
        examinationType
        createdAt
        mediaType
      }
      totalQuestion
    }
  }
`;

const AutoGenerateEssayQuestions = gql`
  query AutoGenerateEssayQuestions($examId: ID!, $number: Int!) {
    autoGenEssayQuestions(examId: $examId, number: $number) {
      id
      type
      question
      clue
      possibleAnswers
      mediaUrl
      examId
      examinationType
      createdAt
      mediaType
    }
  }
`;

//

const GetAllSpellingQuestions = gql`
  query getAllSpellingQuestions($examId: String!, $offset: Int) {
    getAllSpellingQuestions(examId: $examId, offset: $offset) {
      questions {
        id
        word
        correctWord
        clue
        examinationType
        examId
      }
      totalQuestion
    }
  }
`;


const GetExamScheduleByType = gql`
  query GetExamType($examTypeId: ID!) {
    getExamScheduleByType(examTypeId: $examTypeId) {
      id
      examinationName
    }
  }
`;

const GetExamScheduleDetails = gql`
  query GetExamScheduleDetails($scheduleId: ID!) {
    examScheduleDetails(scheduleId: $scheduleId) {
      id
      numberofQuestions
      examinationName
      active
      examinationDuration
      questions {
        id
        question
        answers {
          isCorrect
          option
          selected
        }
        questionImageUrl
        examinationType
        explanation
      }
      examTypeID
      examTypeName
    }
  }
`;

const LoginUser = gql`
  query loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      ... on User {
        username
        name
        userType
        token
        id
      }
      ... on Error {
        message
        type
      }
    }
  }
`;
const GetDashBoardMetrics = gql`
  query DashBoardMetrics {
    dashboardMetrics {
      type
      value
    }
  }
`;

const GetActiveExamination = gql`
  query ActiveExamination {
    activeExamination {
      id
      numberofQuestions
      examinationName
      active
      examinationDuration
      questions {
        ... on Question {
          id
          question
          answers {
            isCorrect
            option
            selected
          }
          questionImageUrl
          examinationType
          examId
          explanation
        }

        ... on SpellingQuestion {
          id
          word
          correctWord
          clue
          examinationType
          examId
        }

        ... on EssayExamQuestion {
          type
          question
          clue
          possibleAnswers
          mediaUrl
          examId
          examinationType
          mediaType
          id
        }
      }
      questionType
      examTypeID
      examTypeName
    }
  }
`;

//
const GetExaminationResult = gql`
  query GetExaminationResult($examScheduleId: ID!) {
    getExamResults(examScheduleId: $examScheduleId) {
      id
      examDetails {
        examinationName
        examinationId
        numberOfQuestions
        duration
      }
      timeExamStarted
      canidateDetails {
        username
        name
      }
      questionType
      timeExamEnded
      score
      scripts {
        ... on SpellingScriptQuestion {
          number
          clue
          word
          answeredWord
          correctWord
        }
        ... on ScriptQuestion {
          number
          selectedOption
          correctOption
          explanation
        }

        ... on EssayQuestionScript {
          number
          question
          yourAnswer
          clue
          possibleAnswers
          mediaType
          mediaUrl
          isCorrect
        }
      }
    }
  }
`;

const GetCanidateExamResult = gql`
  query GetCanidateExamResult($examId: ID!) {
    getExamOfCanidate(examId: $examId) {
      id
      examDetails {
        examinationName
        examinationId
        numberOfQuestions
        duration
      }
      timeExamStarted
      canidateDetails {
        username
        name
      }
      examStarted
      examFinished
      timeExamEnded
      score
      scripts {
        ... on SpellingScriptQuestion {
          number
          clue
          word
          answeredWord
          correctWord
        }

        ... on EssayQuestionScript {
          number
          question
          yourAnswer
          clue
          possibleAnswers
          mediaType
          mediaUrl
          isCorrect
        }

        ... on ScriptQuestion {
          number
          selectedOption
          correctOption
          explanation
        }
      }
    }
  }
`;

//

const GetAllScheduleExamination = gql`
  query GetAllScheduleExamination {
    getAllExamSchedule {
      id
      numberofQuestions
      examinationName
      active
      examinationDuration
      questions {
        ... on Question {
          id
          question
          answers {
            isCorrect
            option
            selected
          }
          questionImageUrl
          examinationType
          examId
          explanation
        }

        ... on SpellingQuestion {
          id
          word
          correctWord
          clue
          examinationType
          examId
        }
        ... on EssayExamQuestion {
          type
          question
          clue
          possibleAnswers
          mediaUrl
          examId
          examinationType
          mediaType
          id
        }
      }
      questionType
      examTypeID
      examTypeName
    }
  }
`;

//
const GetUsersByStatus = gql`
  query GetUsersByStatusQuery($status: Boolean!, $offset: Int!) {
    usersByStatus(status: $status, offset: $offset) {
      users {
        id
        password
        username
        userType
        name
        active
      }
      totalUsersByStatus
    }
  }
`;
const AutoGenerateQuestions = gql`
  query AutoGenerateQuestions($examId: ID!, $number: Int!) {
    autoGenQuestions(examId: $examId, number: $number) {
      id
      question
      answers {
        isCorrect
        option
        selected
      }
      questionImageUrl
      examinationType
      examId
      explanation
    }
  }
`;

const AutoGenerateSpellingQuestions = gql`
  query AutoGenerateQuestions($examId: ID!, $number: Int!) {
    autoGenSpellingQuestions(examId: $examId, number: $number) {
      id
      word
      correctWord
      clue
      examinationType
      examId
    }
  }
`;

const GetDifferentExamination = gql`
  query getDifferentExamination($examType: String!) {
    getExamByType(examType: $examType) {
      id
      examName
      examType
      examSchedules {
        id
        numberofQuestions
        examinationName
        active
        examinationDuration
        questions {
          ... on Question {
            id
            question
            answers {
              isCorrect
              option
              selected
            }
            questionImageUrl
            examinationType
            examId
            explanation
          }

          ... on SpellingQuestion {
            id
            word
            correctWord
            clue
            examinationType
            examId
          }

          ... on EssayExamQuestion {
            type
            question
            clue
            possibleAnswers
            mediaUrl
            examId
            examinationType
            mediaType
            id
          }
        }
        questionType
        examTypeID
        examTypeName
      }
    }
  }
`;

export {
  GetAllSpellingQuestions,
  GetAllExamination,
  GetAllMultiChoiceExamination,
  GetAllQuestionsByExamID,
  GetAllQuestions,
  GetExamScheduleByType,
  GetExamScheduleDetails,
  LoginUser,
  GetDashBoardMetrics,
  GetActiveExamination,
  GetCanidateExamResult,
  GetExaminationResult,
  GetAllScheduleExamination,
  GetUsersByStatus,
  AutoGenerateQuestions,
  AutoGenerateSpellingQuestions,
  GetDifferentExamination,
  AutoGenerateEssayQuestions,
  GetAllEssayQuestions,
};
