import { selector, atom } from "recoil";
import store from "store";

const questionAtomState = atom({
  key: "examinationQuestions",
  default: []
  // default: selector({
  //   key: "examinationSelector",
  //   get: () => {
  //     const questionsFromStore = store.get("examQuestions");
  //     return questionsFromStore ? questionsFromStore : [];
  //   },
  // }),
});

// const questionAtomState = atom({
//   key: "examinationQuestions",
//   default: selector({
//     key: "examinationSelector",
//     get: () => {
//       return Questions;
//     },
//   }),
// });

export default questionAtomState;
