import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatHistory.css";

const API_BASE = process.env.REACT_APP_API_URL || "";

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatHistory({ isOpen, onClose, onLoadChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/chat/history`);
      setChats(data.chats || []);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchChats();
  }, [isOpen]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this saved chat?")) return;
    try {
      await axios.delete(`${API_BASE}/api/chat/history/${id}`);
      setChats((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete chat:", err);
      alert("Failed to delete chat");
    }
  };

  const handleLoad = async (id) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/chat/history/${id}`);
      if (data.chat?.messages) {
        const restored = data.chat.messages.map((m) => ({
          ...m,
          id: Date.now() + Math.random(),
          timestamp: new Date(m.timestamp || Date.now()),
        }));
        onLoadChat(restored);
        onClose();
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
      alert("Failed to load chat");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-history-overlay" onClick={onClose}>
      <div className="chat-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chat-history-header">
          <h3>📜 Saved Chats</h3>
          <button className="chat-history-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="chat-history-list">
          {loading && <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</p>}

          {!loading && chats.length === 0 && (
            <div className="chat-history-empty">
              No saved chats yet.
              <br />
              Start chatting and click 💾 Save to store your conversations.
            </div>
          )}

          {chats.map((chat) => (
            <div
              key={chat.id}
              className="chat-history-item"
              onClick={() => handleLoad(chat.id)}
            >
              <div className="chat-history-item-info">
                <div className="chat-history-item-title">{chat.title}</div>
                <div className="chat-history-item-meta">
                  {formatDate(chat.updatedAt)} · {chat.messageCount} messages
                </div>
              </div>
              <div className="chat-history-item-actions">
                <button
                  className="chat-history-btn chat-history-btn--delete"
                  onClick={(e) => handleDelete(e, chat.id)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

