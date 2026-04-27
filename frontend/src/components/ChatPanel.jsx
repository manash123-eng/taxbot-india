import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatPanel.css";

const WELCOME_CHIPS = [
  { label: "Tax slabs 2024-25", q: "What are the income tax slabs for FY 2024-25 under both regimes?" },
  { label: "Save maximum tax", q: "How can I save maximum tax legally for FY 2024-25?" },
  { label: "File ITR online", q: "How do I file ITR online step by step?" },
  { label: "New vs Old regime", q: "Which tax regime is better – new or old? Help me decide." },
  { label: "HRA calculation", q: "How is HRA exemption calculated? Explain with an example." },
  { label: "ITR documents needed", q: "What documents do I need to file my ITR?" },
];

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TypingIndicator() {
  return (
    <div className="msg-row msg-row--bot">
      <div className="avatar avatar--bot">₹</div>
      <div className="typing-bubble">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`msg-row ${isUser ? "msg-row--user" : "msg-row--bot"}`}>
      <div className={`avatar ${isUser ? "avatar--user" : "avatar--bot"}`}>
        {isUser ? "U" : "₹"}
      </div>
      <div className="msg-content-wrap">
        <div className={`bubble ${isUser ? "bubble--user" : "bubble--bot"} ${msg.isError ? "bubble--error" : ""}`}>
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="md-p">{children}</p>,
                strong: ({ children }) => <strong className="md-strong">{children}</strong>,
                ul: ({ children }) => <ul className="md-ul">{children}</ul>,
                ol: ({ children }) => <ol className="md-ol">{children}</ol>,
                li: ({ children }) => <li className="md-li">{children}</li>,
                h1: ({ children }) => <h3 className="md-h">{children}</h3>,
                h2: ({ children }) => <h3 className="md-h">{children}</h3>,
                h3: ({ children }) => <h3 className="md-h">{children}</h3>,
                code: ({ children }) => <code className="md-code">{children}</code>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
        <span className="msg-time">{formatTime(msg.timestamp)}</span>
      </div>
    </div>
  );
}

export default function ChatPanel({ messages, isLoading, onSend, pendingInput }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasSentPending = useRef(false);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle pending quick-ask input from sidebar
  useEffect(() => {
    if (pendingInput && !hasSentPending.current) {
      hasSentPending.current = true;
      onSend(pendingInput);
    }
    if (!pendingInput) {
      hasSentPending.current = false;
    }
  }, [pendingInput, onSend]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="chat-panel">
      {/* Messages */}
      <div className="chat-window">
        {/* Welcome card shown when no messages */}
        {messages.length === 0 && (
          <div className="welcome-card">
            <div className="wc-emoji">🇮🇳</div>
            <h2 className="wc-title">Indian Tax Assistant</h2>
            <p className="wc-subtitle">
              Ask me anything about Indian income tax, ITR filing, deductions,
              tax-saving tips, TDS, GST, and more. I'm powered by AI and
              focused exclusively on tax matters.
            </p>
            <div className="wc-chips">
              {WELCOME_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  className="wc-chip"
                  onClick={() => onSend(chip.q)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-box">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask a tax question… e.g. 'What is the last date to file ITR?'"
            rows={1}
            disabled={isLoading}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            {isLoading ? <span className="send-spinner" /> : "➤"}
          </button>
        </div>
        <p className="input-hint">
          Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
