import { selector } from "recoil";
import questionsState from "./questionsState";

const questionTotalSelector = selector({
    key: "questionTotal",
    get: ({get}) => {
        const questions = get(questionsState);
        return questions.length;
    }
});

export default questionTotalSelector;