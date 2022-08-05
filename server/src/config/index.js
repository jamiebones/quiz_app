import isAuth from "./isAuth";
import keys from "./keys";
import configStart from "./startup";
import winston from "./winston";



export default {
    isAuth,
    keys,
    initDataBase: configStart.initDataBase, 
    createAdminUser: configStart.createAdminUser,
    winston
}