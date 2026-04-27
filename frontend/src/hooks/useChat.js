import { useState, useCallback } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convert displayed messages to API format
  const toApiMessages = (msgs) =>
    msgs.map((m) => ({ role: m.role, content: m.content }));

  const sendMessage = useCallback(
    async (userText) => {
      if (!userText.trim() || isLoading) return;

      const userMsg = {
        id: Date.now(),
        role: "user",
        content: userText.trim(),
        timestamp: new Date(),
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axios.post(
          `${API_BASE}/api/chat`,
          { messages: toApiMessages(nextMessages) },
          { timeout: 30000 }
        );

        const botMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        const errorText =
          err.response?.data?.error ||
          (err.code === "ECONNABORTED"
            ? "Request timed out. Please try again."
            : "Connection failed. Make sure the backend server is running.");

        setError(errorText);

        // Add error message to chat
        const errMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: `⚠️ ${errorText}`,
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const loadMessages = useCallback((newMessages) => {
    setMessages(newMessages);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat, loadMessages };
}
