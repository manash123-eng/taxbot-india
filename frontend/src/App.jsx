import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatPanel from "./components/ChatPanel";
import TaxCalculator from "./components/TaxCalculator";
import DeductionsGuide from "./components/DeductionsGuide";
import MobileNav from "./components/MobileNav";
import ChatHistory from "./components/ChatHistory";
import { useChat } from "./hooks/useChat";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_URL || "";

export default function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [pendingInput, setPendingInput] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const { messages, isLoading, sendMessage, clearChat, loadMessages } = useChat();
  const pendingClear = useRef(null);

  const handleQuickAsk = useCallback((question) => {
    setActiveTab("chat");
    clearTimeout(pendingClear.current);
    setPendingInput(question);
    pendingClear.current = setTimeout(() => setPendingInput(null), 500);
  }, []);

  const handleSend = useCallback(
    (text) => {
      sendMessage(text);
      setPendingInput(null);
    },
    [sendMessage]
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleSaveChat = useCallback(async () => {
    if (messages.length === 0) return;
    const firstUserMsg = messages.find((m) => m.role === "user");
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? "..." : "")
      : `Chat ${new Date().toLocaleDateString()}`;

    try {
      await axios.post(`${API_BASE}/api/chat/save`, {
        title,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
      });
      alert("Chat saved successfully!");
    } catch (err) {
      console.error("Failed to save chat:", err);
      alert("Failed to save chat. Please try again.");
    }
  }, [messages]);

  const handleLoadChat = useCallback(
    (restoredMessages) => {
      loadMessages(restoredMessages);
    },
    [loadMessages]
  );

  return (
    <div className="app-layout">
      {/* Left Sidebar (desktop only) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onQuickAsk={handleQuickAsk}
      />

      {/* Main Content */}
      <div className="main-area">
        <Header
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onClearChat={clearChat}
          onSaveChat={handleSaveChat}
          onToggleHistory={() => setShowHistory((s) => !s)}
          hasMessages={messages.length > 0}
        />

        {/* Panels */}
        <div className="panels-container">
          <div className={`panel-wrapper ${activeTab === "chat" ? "panel-wrapper--active" : ""}`}>
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              onSend={handleSend}
              pendingInput={activeTab === "chat" ? pendingInput : null}
            />
          </div>

          <div className={`panel-wrapper ${activeTab === "calc" ? "panel-wrapper--active" : ""}`}>
            <TaxCalculator />
          </div>

          <div className={`panel-wrapper ${activeTab === "ded" ? "panel-wrapper--active" : ""}`}>
            <DeductionsGuide />
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Chat History Modal */}
      <ChatHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadChat={handleLoadChat}
      />
    </div>
  );
}

