import users from "../../models/UsersModel.js";
import { addProps, getToken } from "../../utils/helper.js";

const updateUser = async (req, res) => {
  const userData = req.body;
  console.log("userData: ", userData);
  console.log("user", req.user._id);
  const newUser = await users.findOneAndUpdate(
    { _id: req.user._id },
    { $set: userData },
    { new: true }
  );
  console.log("newUser: ", newUser);

  const token = getToken(req, res);

  const newObj = newUser.toObject();

  addProps(newObj, { token });

  res.status(200).json({ msg: "updated successfully", user: newObj });
};

export { updateUser };
