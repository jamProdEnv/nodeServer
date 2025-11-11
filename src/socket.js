import {
  getOrCreateRoom,
  getUserInfoBySocketId,
  joinRoom,
  sendPrivateMessage,
  sendPublicMessage,
  sendSystemMessage,
} from "./services/ChatService.js";
import jwt from "jsonwebtoken";
import { getUserInfoById } from "./services/UserService.js";

export function handleSocket(io) {
  io.use((socket, next) => {
    if (!socket.handshake.auth?.token) {
      return next(new Error("Authentication failed: no token provided"));
    }
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.error(err);

          return next(new Error("Authentication failed: invalid token"));
        }
        socket.auth = decodedToken;
        socket.user = await getUserInfoById(socket.auth.sub);
        return next();
      }
    );
  });

  let onlineUsers = [];

  io.on("connect", (socket) => {
    if (!socket.user.username) return;
    if (!onlineUsers.some((u) => u.username === socket.user.username)) {
      onlineUsers.push({ id: socket.id, username: socket.user.username });
    }
    // onlineUsers.push({ id: socket.id, username: socket.user.username });
    io.emit("users.online", onlineUsers); // notify everyone

    socket.on("users.request", () => {
      socket.emit("users.online", onlineUsers);
    });

    joinRoom(io, socket, { room: "public" });
    // if (room !== "public") {
    //   const roomName = getOrCreateRoom(socket.user.username, recipient);
    //   joinRoom(io, socket, { roomName });
    // } else {
    //   joinRoom(io, socket, { room });
    // }
    // joinRoom(io, socket, { roomName });
    socket.on("chat.message", (room, message) => {
      sendPublicMessage(io, { username: socket.user.username, room, message });
      //   sendPrivateMessage(socket, {
      //     username: socket.user.username,
      //     room,
      //     message,
      //   });
    });

    // socket.on("chat.message", (room, message) => {
    //   console.log(
    //     "Message And Recipient In Socket private.message Event:",
    //     room,
    //     message
    //   );
    //   const roomName = getOrCreateRoom(socket.user.username, recipient);
    //   joinRoom(io, socket, { roomName });
    //   const recipientSocket = Array.from(io.sockets.sockets.values()).find(
    //     (s) => s.user?.username === recipient
    //   );
    //   if (!recipientSocket) {
    //     sendSystemMessage(io, {
    //       roomName,
    //       message: `User ${recipientSocket} is not online but you may continue. `,
    //     });
    //   }

    // Emit to everyone in the room (sender + recipient(s))
    //   console.log("\nIO Event Room And Recipient:", room, recipient);
    //   io.to(roomName).emit("private.message", {
    //     username: recipient,
    //     message,
    //     room,
    //   });

    //   sendPrivateMessage(socket, {
    //     username: recipient,
    //     roomName,
    //     message,
    //   });
    //         io.to(room).emit("private.message", {
    //   sender: socket.username,
    //   message,
    //   room,
    // });
    // });

    socket.on("chat.join", (room) => joinRoom(io, socket, { room }));

    socket.on("user-info", async (socketId, callback) =>
      callback(await getUserInfoBySocketId(io, socketId))
    );

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((u) => u.id !== socket.id);
      io.emit("users.online", onlineUsers);

      console.log(`❌ User disconnected: ${socket.user.username}`);
    });
  });
}
