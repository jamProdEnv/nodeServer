import {
  createUser,
  loginUser,
  getUserInfoById,
  getAllUsers,
  deleteUser,
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

  app.delete("/api/v1/users/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const deletedUser = await deleteUser(id);
      if (deletedUser === true)
        return res.status(200).json({
          message: "Successfully Deleted User:",
          deleteUser,
        });
    } catch (error) {
      console.error("Could Not Delete The User.", error);
      return res.status(401).json({
        error: `Could Not Delete User With Id: ${id}`,
      });
    }
  });
}
