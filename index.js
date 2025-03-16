import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/dbConnect.js";
import cors from "cors";
import authRouter from "./src/routes/authRoutes/routes.js";
import jobsRoutes from "./src/routes/jobsRoutes/routes.js";
import { isAuthenticated } from "./src/utils/helper.js";
import userRouter from "./src/routes/userRoutes/routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/job", isAuthenticated, jobsRoutes);
app.use("/api/v1/user", isAuthenticated, userRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(8080, () => {
      console.log("listening on 8080");
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

start();
