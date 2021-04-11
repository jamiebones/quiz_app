import { atom } from "recoil";

const currentIndexState = atom({
  key: "currentIndexState",
  default: 0,
});

export default currentIndexState;
