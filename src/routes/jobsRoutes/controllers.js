import jobModel from "../../models/JobsModel.js";
import { addProps } from "../../utils/helper.js";
// * Add Jobs
const addJob = async (req, res) => {
  const { position, company, location, status, jobType, date, userId } =
    req.body;

  if (
    !position ||
    !company ||
    !location ||
    !status ||
    !jobType ||
    !date ||
    !userId
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const jobCreated = await jobModel.create({
    position,
    company,
    location,
    status,
    jobType,
    date,
    userId,
  });

  const newJob = jobCreated.toObject();

  res
    .status(201)
    .json({ msg: "Job created successfully", data: newJob, success: true });
};
// * Update Jobs
const updateJob = async (req, res) => {
  const { position, company, location, status, jobType, date, jobId } =
    req.body;

  if (!position || !company || !location || !status || !jobType || !jobId) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const props = {};
  addProps(props, req.body);
  console.log("addProps: ", addProps);
  console.log("props: ", props);

  // const user =
  const jobCreated = await jobModel.updateOne(
    { _id: jobId },
    {
      $set: props,
    }
  );
  console.log("jobCreated: ", jobCreated);

  res.status(201).json({ msg: "Job updated successfully", success: true });
};

// * Delete Jobs
const deleteJob = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ msg: "Id is required" });
  }

  const deletedJob = await jobModel.deleteOne({ _id: id });
  if (deletedJob?.acknowledged) {
    return res.status(200).json({ msg: "Job deleted successfully" });
  }

  res.status(400).json({ msg: "Something went wrong" });
};

// * Get Jobs

const getJobs = async (req, res) => {
  try {
    const { limit = 10 } = req.query; // Default page = 1, limit = 10
    let { jobType, search, sort, status, page } = req.body;

    const findObject = { userId: req.user._id };

    // Apply filters if provided
    if (jobType) findObject.jobType = jobType;
    if (status) findObject.status = status;

    // Apply regex for partial company name match (case-insensitive)
    if (search) {
      findObject.company = { $regex: search, $options: "i" };
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    console.log("findObject: ", findObject);

    // Count total jobs for pagination
    const totalJobs = await jobModel.countDocuments(findObject);
    const totalPages = Math.ceil(totalJobs / limitNumber);

    // Fetch paginated jobs
    const jobFound = await jobModel
      .find(findObject)
      .skip(skip)
      .limit(limitNumber);

    if (jobFound.length === 0) {
      return res.status(404).json({
        msg: "No jobs found",
        data: { jobs: [], numOfPages: 0, totalPages: 0 },
      });
    }

    res.status(202).json({
      msg: "Jobs fetched successfully",
      data: {
        jobs: jobFound,
        numOfPages: totalPages,
        totalPages: totalPages,
        totalJobs: jobFound?.length,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
};

export { addJob, deleteJob, getJobs, updateJob };
