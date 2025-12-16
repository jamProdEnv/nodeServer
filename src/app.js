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
// app.use(cors());
// CORS for Express
const allowedOrigins = ["http://wsjr.net", "http://100.27.195.62"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
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
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});
handleSocket(io);
userRoutes(app);
postRoutes(app);

export { server as app };
