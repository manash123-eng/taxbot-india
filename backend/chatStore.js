const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const CHATS_FILE = path.join(DATA_DIR, "chats.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readChats() {
  try {
    if (!fs.existsSync(CHATS_FILE)) return [];
    const data = fs.readFileSync(CHATS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading chats:", err);
    return [];
  }
}

function writeChats(chats) {
  try {
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2));
  } catch (err) {
    console.error("Error writing chats:", err);
    throw err;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function saveChat(title, messages) {
  const chats = readChats();
  const chat = {
    id: generateId(),
    title: title || `Chat ${chats.length + 1}`,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  chats.unshift(chat);
  writeChats(chats);
  return chat;
}

function getChats() {
  return readChats().map((chat) => ({
    id: chat.id,
    title: chat.title,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    messageCount: chat.messages.length,
  }));
}

function getChatById(id) {
  const chats = readChats();
  return chats.find((c) => c.id === id) || null;
}

function deleteChat(id) {
  const chats = readChats();
  const filtered = chats.filter((c) => c.id !== id);
  writeChats(filtered);
  return filtered.length !== chats.length;
}

module.exports = {
  saveChat,
  getChats,
  getChatById,
  deleteChat,
};

