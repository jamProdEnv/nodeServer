import { requireAuth } from "../middleware/jwt.js";
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTags,
} from "../services/PostService.js";

export function postRoutes(app) {
  app.post("/api/v1/post/createPost", requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.auth.sub, {
        title: req.body.title,
        contents: req.body.contents,
        tags: req.body.tags,
      });
      console.log(post);
      return res.status(201).json(post);
    } catch (error) {
      console.error("\npostRoutes(app) Error.", error);
      return res.status(400).json({
        error: "Cannot Create Post.",
      });
    }
  });

  app.get("/api/v1/posts", async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query;
    const options = { sortBy, sortOrder };

    try {
      if (author && tag) {
        res.status(400).json({
          error: "Query By Either Author Or Tag, Not Both.",
        });
      } else if (author) {
        const authorPosts = await listPostsByAuthor(author, options);
        return res.status(201).json(authorPosts);
      } else if (tag) {
        const tagPosts = await listPostsByTags(tag, options);
        return res.status(201).json(tagPosts);
      } else {
        const posts = await listAllPosts(options);
        return res.status(201).json(posts);
      }
    } catch (error) {
      console.error("Please Check Your Query.");
      return res.status(500).end();
    }
  });
}
