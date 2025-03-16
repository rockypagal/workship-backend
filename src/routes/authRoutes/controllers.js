import bcrypt from "bcrypt";
import users from "../../models/UsersModel.js";
import JWT from "jsonwebtoken";
import { addProps } from "../../utils/helper.js";

const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const userExists = await users.findOne({ email });
  if (userExists) {
    return res.status(409).json({ msg: "User already exists" });
  }

  const hashedPass = await bcrypt.hash(password, 10);
  const user = await users.create({ name, email, password: hashedPass });
  const newUser = user.toObject(); // Convert Mongoose doc to plain object
  delete newUser.password; // Remove password
  const token = JWT.sign({ _id: user._id }, process.env.SECRET_KEY);

  addProps(newUser, { token });
  res.status(200).json({ msg: "Account created successfully", data: newUser });
};

const loginController = async (req, res) => {
  const { email, password, _id, name } = req.body;

  if (!email && !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const user = await users.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ msg: "Account dose not exist" });
  }

  const isMatch = await bcrypt.compare(password, user?.password);
  const newUser = user.toObject(); // Convert Mongoose doc to plain object
  delete newUser.password; // Remove password

  const token = JWT.sign({ _id: user?._id }, process.env.SECRET_KEY);

  addProps(newUser, { token });

  if (email === user?.email && isMatch) {
    res.status(200).json({ msg: "Login successfully", data: newUser });
  } else {
    res.status(401).json({ msg: "Email or Password is wrong" });
  }
};

export { registerController, loginController };
