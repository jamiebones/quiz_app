import isAuth from "./isAuth.js";
import keys from "./keys.js";
import configStart from "./startup.js";
import winston from "./winston.js";



export default {
    isAuth,
    keys,
    initDataBase: configStart.initDataBase, 
    createAdminUser: configStart.createAdminUser,
    winston
}