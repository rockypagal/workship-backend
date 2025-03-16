import mongoose from "mongoose";

const connectDB = async (url) => {
  console.log("connecting to DB");
  const dbClient = await mongoose.connect(url);
  console.log("DB connected");
  return dbClient;
};

export default connectDB;
