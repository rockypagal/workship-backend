import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema(
  {
    position: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    date: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const jobModel = mongoose.model("job", jobsSchema);

export default jobModel;
