import mongoose from "mongoose";
import models from "../models";
import bcrypt from "bcrypt";
let saltRounds = 10;

const { DB_HOST, DB_PORT, DB_USER, DB_DATABASE, DB_PASSWORD } = process.env;

const initDataBase = async () => {
  let url;
  url = `mongodb://mongodb_cbt:27017/${DB_DATABASE}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true,
  });
  await _createAdminUser();
};

const _createAdminUser = async () => {
  try {
    const findAdmin = await models.User.findOne({
      username: "jamiebones147@gmail.com",  
    });
    console.log("find admin is ", findAdmin);

    if (findAdmin) {
      console.log("admin is found");
    } else {
      const hash = bcrypt.hashSync("blazing147", saltRounds);
      const admin = {
        username: "jamiebones147@gmail.com",
        password: hash,
        name: "James Oshomah",
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

export default initDataBase;
