import { Post } from "../db/models/PostModel.js";
import { User } from "../db/models/UserModel.js";

export async function createPost(userId, { title, contents, tags }) {
  if (title == null || title.trim() === "") {
    title = "Post";
  }

  const post = new Post({ author: userId, title, contents, tags });
  if (!post) {
    throw new Error("cannot Create Post In createPost() Service.");
  }
  return await post.save();
}

async function listPosts(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {}
) {
  //  Mongoose Syntax For Querying The Database (ORM)
  //  Not Very Familiar With It
  return await Post.find(query).sort({ [sortBy]: sortOrder });
}

export async function listAllPosts(options) {
  return await listPosts({}, options);
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername });
  if (!user) return [];
  return await listPosts({ author: user._id }, options);
}

export async function listPostsByTags(tags, options) {
  return await listPosts({ tags }, options);
}
