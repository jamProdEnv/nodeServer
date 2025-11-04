import { Message } from "../db/models/MessageModel.js";

export async function createMessage({ username, message, room }) {
  const roomName = normalizeRoom(room);
  console.log(
    "Normalized Room Name, Username, And Message Of createMessage():",
    roomName,
    username,
    message
  );
  const messageDoc = new Message({ username, message, room: roomName });
  return await messageDoc.save();
}

export async function getMessageByRoom(room) {
  const roomName = normalizeRoom(room);
  return await Message.find({ room: roomName }).sort({ sent: 1 });
}

function normalizeRoom(room) {
  // If room is an object like { room: 'Joshua' }, extract the string
  return typeof room === "object" && room.room ? room.room : room;
}
