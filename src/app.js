import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { handleSocket } from "./socket.js";
import { userRoutes } from "./routes/UserRoutes.js";
import { postRoutes } from "./routes/PostRoutes.js";
import { rateLimit } from "express-rate-limit";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const rateLimiter = rateLimit({
  windowMs: 60000,
  max: 20,
  message: "Too Many Requests",
});

app.use(rateLimiter);
app.get("/", (req, res) => {
  res.send("Hello World From Express");
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

handleSocket(io);
userRoutes(app);
postRoutes(app);

export { server as app };
