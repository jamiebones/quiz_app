import { selector } from "recoil";
import questionState from "./questionsState";
import currentIndex from "./currentIndexState";
import store from "store";

const currentQuestionSelector = selector({
  key: "currentQuestionSelector",
  get: ({ get }) => {
    //let check our store if we can get the questions there
    debugger
    const index = get(currentIndex);
    const examQuestions = get(questionState);
    const questionsFromStore = store.get("examQuestions");
    const indexFromStore = store.get("currentIndex");

    if (questionsFromStore && questionsFromStore.length > 0 && indexFromStore) {
      const currentQuestion = questionsFromStore[indexFromStore];
      return currentQuestion;
    } else {
      const currentQuestion = examQuestions[index];
      return currentQuestion;
    }
  },
});

export default currentQuestionSelector;
