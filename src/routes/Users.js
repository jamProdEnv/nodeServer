import {
  createUser,
  loginUser,
  getUserInfoById,
  getAllUsers,
} from "../services/UserService.js";

export function userRoutes(app) {
  app.post("/api/v1/user/signup", async (req, res) => {
    try {
      const user = await createUser(req.body);
      return res.status(201).json({ username: user.username });
    } catch (err) {
      return res.status(400).json({
        error: "failed to create the user, does the username already exist?",
      });
    }
  });

  app.post("/api/v1/user/login", async (req, res) => {
    try {
      console.log("🟢 Login body:", req.body);
      const token = await loginUser(req.body);
      return res.status(200).send({ token });
    } catch (error) {
      console.error("❌ Login error:", error.message);
      return res.status(400).send({
        error: "login failed, did you enter the correct username/password?",
      });
    }
  });

  app.get("/api/v1/user/:id", async (req, res) => {
    try {
      const userInfo = await getUserInfoById(req.params.id);
      return res.status(200).send(userInfo);
    } catch (error) {
      return res.status(400).json({
        error: "Cannot Retrieve User Info.",
      });
    }
  });

  app.get("/api/v1/users", async (req, res) => {
    try {
      const users = await getAllUsers();
      console.log("Users: ", users);
      return res.status(200).send(users);
    } catch (error) {
      return res.status(400).json({
        error: "Cannot Retrieve The Data.",
      });
    }
  });
}
