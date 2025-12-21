import { Admin } from "../db/models/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createAdmin({ username, password, email }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, password: hashedPassword, email });
  return await admin.save();
}

export async function loginAdmin({ username, password }) {
  //  Check If Email
  let admin;

  if (username.includes("@")) {
    admin = await Admin.findOne({ email: username });
  } else {
    admin = await Admin.findOne({ username });
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid Password");
  }

  const payload = {
    sub: admin._id,
    username: admin.username,
    role: admin.role,
  };

  console.log(admin.role);
  console.log(payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
}

export async function getAdminInfoById(adminId) {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new Error("Unable To Find User");
  }
  return { username: admin.username };
}

export async function getAllAdmins() {
  const admins = Admin.find({}, "username").lean();
  if (!admins) {
    throw new Error("Unable To Load Admins.");
  }
  return admins;
}
