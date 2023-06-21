import mongoose from "mongoose";
import models from "../models";
import bcrypt from "bcrypt";
let saltRounds = 10;

const {
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_DATABASE,
  DB_PASSWORD,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} = process.env;

console.log("the DB database is : ", DB_DATABASE);

const initDataBase = async () => {
  let url = `mongodb://mongodb_cbt:27017/${DB_DATABASE}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true,
  });
};

const createAdminUser = async () => {
  try {
    const findAdmin = await models.User.findOne({
      username: ADMIN_EMAIL,
    });
    console.log("find admin is ", findAdmin);

    if (findAdmin) {
      console.log("admin is found");
    } else {
      const hash = bcrypt.hashSync(ADMIN_PASSWORD, saltRounds);
      const admin = {
        username: ADMIN_EMAIL,
        password: hash,
        name: "Jamie",
        active: true,
        userType: "super-admin",
      };
      const adminUser = new models.User(admin);
      await adminUser.save();
      console.log("admin saved");
    }
  } catch (error) {
    console.log(error);
  }
};

export default { initDataBase, createAdminUser };
