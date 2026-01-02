import { Admin } from "../db/models/AdminModel.js";
import { Post } from "../db/models/PostModel.js";
import { User } from "../db/models/UserModel.js";

export async function createPost(userId, { title, contents, tags }) {
  if (title == null || title.trim() === "") {
    title = "Post";
  }
  const normalizedTags = tags
    .map((t) => t.toLowerCase().trim())
    .filter(Boolean);
  const post = new Post({
    author: userId,
    title,
    contents,
    tags: [...new Set(normalizedTags)],
  });

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
  return await Post.find(query)
    .populate("author", "username")
    .sort({ [sortBy]: sortOrder });
}

export async function listAllPosts(options) {
  return await listPosts({}, options);
}

export async function listPostsByAuthor(authorUsername, options) {
  // const user = await User.findOne({ username: authorUsername });
  const admin = await Admin.findOne({ username: authorUsername });
  // if (!user) return [];
  if (!admin) return [];
  // return await listPosts({ author: user._id }, options);
  return await listPosts({ author: admin._id }, options);
}

export async function listPostsByTags(tags, options) {
  const normalized = Array.isArray(tags)
    ? tags.map((t) => t.toLowerCase().trim())
    : [tags.toLowerCase().trim()];
  // return await listPosts(
  //   { tags: { $in: tags.map((t) => t.toLowerCase().trim()) } },
  //   options
  // );
  return await listPosts({ tags: { $in: normalized } }, options);
}
