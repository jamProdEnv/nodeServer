import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { handleSocket } from "./socket.js";
import { userRoutes } from "./routes/Users.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

export { server as app };
