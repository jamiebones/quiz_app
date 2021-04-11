import { atom } from "recoil";

const examStarted = atom({
  key: "examStarted",
  default: false
});

export default examStarted;
