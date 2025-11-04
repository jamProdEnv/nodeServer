import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";

import { initDatabase } from "./db/init.js";

try {
  await initDatabase();
  const PORT = 3000;
  app.listen(PORT);
} catch (error) {
  console.error("Error connecting to database:", error);
}
