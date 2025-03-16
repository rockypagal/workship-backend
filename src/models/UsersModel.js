import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String },
  location: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});

const users = mongoose.model("User", userSchema);

export default users;
