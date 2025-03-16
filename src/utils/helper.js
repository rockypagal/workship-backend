import JWT from "jsonwebtoken";
import users from "../models/UsersModel.js";

export const addProps = (obj, props) => {
  for (const key in props) {
    if (props[key] !== undefined && props[key] !== "") {
      obj[key] = props[key];
    }
  }
};

export const isAuthenticated = async (req, res, next) => {
  let token = getToken(req, res);

  const decoded = JWT.verify(token, process.env.SECRET_KEY);

  if (!decoded?._id) {
    return res.status(401).json({ msg: "Unauthorized Access Prohibited" });
  }

  const user = await users.findById(decoded?._id);
  req.user = user;
  next();
};

export const getToken = (req, res) => {
  const { authorization } = req.headers;
  let token;

  if (authorization) {
    token = authorization?.split(" ")[1];
  }
  if (token === "undefined") {
    return res.status(401).json({ msg: "Unauthorized Access Prohibited" });
  }

  return token;
};
