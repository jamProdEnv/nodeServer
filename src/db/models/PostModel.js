import mongoose, { Schema } from "mongoose";

export const postSchema = new Schema(
  {
    title: { type: String, required: true },

    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    contents: { type: String },
    tags: [String],
  },
  { timestamp: true }
);

export const Post = mongoose.model("posts", postSchema);
