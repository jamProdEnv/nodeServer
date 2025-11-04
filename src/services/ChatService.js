import { createMessage, getMessageByRoom } from "./MessageService.js";

export function sendPrivateMessage(
  socket,
  { username, room, message, replayed }
) {
  console.log(
    "Message Content And Username Of sendPrivateMessage()",
    message,
    username
  );
  socket.emit("chat.message", { username, message, room, replayed });
  createMessage({ username, message, room });
}

export function sendPublicMessage(io, { username, room, message }) {
  console.log(
    "Message Content And Username Of sendPublicMessage():",
    message,
    username
  );
  io.to(room).emit("chat.message", { username, message, room });
  createMessage({ username, message, room });
}

export function sendSystemMessage(io, { room, message }) {
  io.to(room).emit("chat.message", { message, room });
}

function normalizeRoom(room) {
  // If room is an object like { room: 'Joshua' }, extract the string
  return typeof room === "object" && room.room ? room.room : room;
}

export async function joinRoom(io, socket, { room }) {
  const roomName = normalizeRoom(room);
  console.log("Room Being Joined In joinRoom():", roomName);
  socket.join(roomName);
  sendSystemMessage(io, {
    room: roomName,
    message: `User "${socket.user.username}" joined room "${roomName}"`,
  });
  const messages = await getMessageByRoom(roomName);
  messages.forEach(({ username, message }) => {
    console.log(username, message);
    sendPrivateMessage(socket, {
      username,
      message,
      room: roomName,
      replayed: true,
    });
  });
}

// export function createRoom() {
//   const randInt = Math.floor(100000 + Math.random() * 9000000000);
//   return `room-${randInt}`;
// }

const activeRooms = new Map();

// ✅ Normalize room name so "bob_alice" === "alice_bob"
function normalizeRoomName(userA = null, userB = null) {
  const randInt = Math.floor(100000 + Math.random() * 9000000000);
  if (userA === null || userB === null) {
    return room;
  }
  const roomName = [userA, userB].sort().join("_");
  console.log("Room Name From normalizeRoomName:", roomName);
  return roomName;
}

// ✅ Create or retrieve an existing room
export function getOrCreateRoom(userA, userB) {
  console.log("Users From getOrCreateRoom(userA, userB:", userA, userB);
  const key = normalizeRoomName(userA, userB);
  if (!activeRooms.has(key)) {
    activeRooms.set(key, key); // you could also generate a UUID if you prefer
    console.log(activeRooms);
  }
  console.log("Resuming Conversation.");
  return activeRooms.get(key);
}

export async function getUserInfoBySocketId(io, socketId) {
  const sockets = await io.in(socketId).fetchSockets();
  if (sockets.length === 0) return null;
  const socket = sockets[0];
  const userInfo = {
    socketId,
    rooms: Array.from(socket.rooms),
    user: socket.user,
  };
  return userInfo;
}
