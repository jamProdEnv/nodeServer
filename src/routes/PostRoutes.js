import { requireAuth } from "../middleware/jwt.js";
import { Post } from "../db/models/PostModel.js";

import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTags,
  deletePost,
  updatePost
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
    const { sortBy, sortOrder, author, tag, searchBy, query } = req.query;
    const options = { sortBy, sortOrder };

    try {
       // ✅ NEW unified search handling
    if (searchBy && query) {
      if (searchBy === "author") {
        const posts = await listPostsByAuthor(query, options);
        return res.status(200).json(posts);
      }

      if (searchBy === "tag") {
        const posts = await listPostsByTags(query, options);
        return res.status(200).json(posts);
      }
    }
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

  app.delete("/api/v1/posts/:id", requireAuth, async (req, res) => {
    try {
       const post = await Post.findById(req.params.id);

    if (!post) return res.sendStatus(404);

    // only author or admin
    if (
      post.author.toString() !== req.auth.sub &&
      req.auth.role !== "admin"
    ) {
      return res.sendStatus(403);
    }
      const { deletedCount } = await deletePost(req.params.id)
       // only author or admin
   
      if (deletedCount === 0) return res.sendStatus(404);
      if (res.status(204)) {
        return null;
      }
      return res.json();
    }catch(error) {
      console.error("Error Deleting Post:", error)
      return res.status(500).end()
    }
  })

  app.patch("/api/v1/posts/update/:id", async (req, res) => {
    try {
      const post = await updatePost(req.params.id, req.body)
      return res.json(post)
    } catch (error) {
      console.error("error updating post:", error);
      return res.status(500).end();
    }
  })
}
