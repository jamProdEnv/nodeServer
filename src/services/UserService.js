import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/models/UserModel.js";

export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  return await user.save();
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) {
    console.log("cannot Login.");
    throw new Error("invalid username!");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("invalid password!");
  }
  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
}

export async function getUserInfoById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Unable To Find User");
  }
  return { username: user.username };
}

export async function getAllUsers() {
  const users = await User.find({}, "username").lean();
  if (!users) {
    throw new Error("Unable To Load Users.");
  }
  return users;
}
