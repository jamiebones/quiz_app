import store from "store";

const ExtractError = (errorObject) => {
  const { graphQLErrors, networkError } = errorObject;
  const errorArray = [];
  if (graphQLErrors) {
    graphQLErrors.map((message) => {
      errorArray.push(message);
    });
  }
  if (networkError) {
    errorArray.push({ message: "could not connect to the database" });
  }

  return errorArray;
};

const RemoveSlash = (word) => {
  if (word) {
    let replaceSpace = word.replace(/\//g, "_");

    return replaceSpace;
  }
};

const ReplaceSlash = (word) => {
  if (word) {
    let replaceWord = word.replace(/_/g, "/");
    return replaceWord;
  }
};

const CapFirstLetterOfEachWord = (word) => {
  if (!word) return null;
  const wordArray = word.split(" ");
  let capitalizedWord = "";
  for (let i = 0; i < wordArray.length; i++) {
    const currentWord = wordArray[i];
    capitalizedWord +=
      currentWord[0].toUpperCase() +
      currentWord.substr(1, currentWord.length) +
      " ";
  }
  return capitalizedWord;
};

const ConvertMinutesToHours = (minutesToConvert) => {
  const hours = Math.floor(minutesToConvert / 60);
  const minutes = minutesToConvert - hours * 60;
  if (hours == 0) {
    return `${minutes} MINUTES`;
  }
  return `${hours} HOURS ${minutes} MINUTES`;
};

const DisablecurrentLoginUser = (currentLoginUser, username) => {
  if (currentLoginUser) {
    let parsedUser = JSON.parse(currentLoginUser);
    if (parsedUser.username.toLowerCase() === username.toLowerCase())
      return true;
  }
  return false;
};

const SetHtml = (html) => {
  return { __html: html };
};

const ClearStoreValue = () => {
  //clear the value of the store
  store.remove("examQuestions");
  store.remove("currentIndex");
  store.remove("examStarted");
  store.remove("duration");
  store.remove("examId");
  store.remove("totalQuestions");
  store.remove("questionData");
  store.remove("examDetails");
  store.remove("timer");
};

const removeTypename = (value) => {
  if (value === null || value === undefined) {
    return value;
  } else if (Array.isArray(value)) {
    return value.map((v) => removeTypename(v));
  } else if (typeof value === "object") {
    const newObj = {};
    Object.entries(value).forEach(([key, v]) => {
      if (key !== "__typename") {
        newObj[key] = removeTypename(v);
      }
    });
    return newObj;
  }
  return value;
};

export default {
  CapFirstLetterOfEachWord,
  ExtractError,
  RemoveSlash,
  ReplaceSlash,
  ConvertMinutesToHours,
  DisablecurrentLoginUser,
  SetHtml,
  ClearStoreValue,
  removeTypename
};
