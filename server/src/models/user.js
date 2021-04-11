import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  userType: String,
  active: Boolean,
  name: String,
});

export default mongoose.model("user", UserSchema);
