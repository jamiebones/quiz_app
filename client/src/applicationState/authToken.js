import {atom} from "recoil";


const authToken = atom({
    key: "authToken",
    default: null
});


export default authToken;