import express from "express";
import { updateUser } from "./controllers.js";

const userRouter = express.Router();

userRouter.patch("/update-user", updateUser);

export default userRouter;
