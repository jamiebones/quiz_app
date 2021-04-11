import { atom } from "recoil";

const currentLoginUserState = atom({
  key: "currentLoginUserState",
  default: null,
});

export default currentLoginUserState;
