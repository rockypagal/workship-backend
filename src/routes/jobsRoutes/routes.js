import express from "express";
import { addJob, getJobs, updateJob, deleteJob } from "./controllers.js";
import jobModel from "../../models/JobsModel.js";

const jobsRoutes = express.Router();

jobsRoutes.post("/add-job", addJob);
jobsRoutes.patch("/update-job", updateJob);
jobsRoutes.post("/get-jobs", getJobs);
jobsRoutes.delete("/delete-job",deleteJob);

export default jobsRoutes;
