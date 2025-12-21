import mongoose, { Schema } from "mongoose";

export const adminSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    default: "admin",
  },
});

export const Admin = mongoose.model("admin", adminSchema);
