import {
  createAdmin,
  getAllAdmins,
  loginAdmin,
} from "../services/AdminService.js";
import { getAdminInfoById } from "../services/AdminService.js";
export function adminRoutes(app) {
  app.post("/api/v1/admin/signup", async (req, res) => {
    try {
      const admin = await createAdmin(req.body);
      return res.status(201).json({ username: admin.username });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: "Cannot Create Admin.",
      });
    }
  });

  app.post("/api/v1/admin/login", async (req, res) => {
    try {
      console.log("🟢 Login body:", req.body);
      const token = await loginAdmin(req.body);
      return res.status(200).send({ token });
    } catch (error) {
      console.error("❌ Login error:", error.message);
      return res.status(400).send({
        error: "login failed, did you enter the correct username/password?",
      });
    }
  });

  app.get("/api/v1/admin/admins", async (req, res) => {
    try {
      const admins = await getAllAdmins();
      console.log("admins:", admins);
      return res.status(200).send(admins);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: "Cannot Retrieve The Data.",
      });
    }
  });

  app.get("/api/v1/admin/:id", async (req, res) => {
    try {
      const adminInfo = await getAdminInfoById(req.params.id);
      return res.status(200).send(adminInfo);
    } catch (error) {
      return res.status(400).json({
        error: "Cannot Retrieve User Info.",
      });
    }
  });
}
