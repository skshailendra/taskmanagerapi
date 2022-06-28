import jwt from "jsonwebtoken";
import UserModel from "./../models/user.js";
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await UserModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({
      error: "Please authenticate!",
    });
  }
};

export default auth;
