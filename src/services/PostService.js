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

// async function listPosts(
//   query = {},
//   { sortBy = "createdAt", sortOrder = "descending" } = {}
// ) {
//   //  Mongoose Syntax For Querying The Database (ORM)
//   //  Not Very Familiar With It
//   const sortField = sortBy || "createdAt";

//   const order = sortOrder === "ascending" ? 1: -1;
//   return await Post.find(query)
//     .populate("author", "username")
//     .sort({ [sortField]: order });
// }

async function listPosts(
  query = {},
  { sortBy, sortOrder } = {}
) {
  // ✅ Default field
  const sortField = sortBy && sortBy !== "" ? sortBy : "createdAt";

  // ✅ Strict handling of sort order
  let order;
  if (sortOrder === "ascending") {
    order = 1;
  } else if (sortOrder === "descending") {
    order = -1;
  } else {
    order = -1; // default fallback
  }

  console.log("SORT DEBUG:", sortField, order);

  return await Post.find(query)
    .populate("author", "username")
    .sort({ [sortField]: order });
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

export async function deletePost(postId){
   return await Post.deleteOne({ _id: postId })
}

export async function updatePost(postId, { title, author, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, contents, tags } },
    { 
      new: true,
     
     },
  )
}