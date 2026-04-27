import React from "react";
import "./Header.css";

export default function Header({ activeTab, onTabChange, onClearChat, onSaveChat, onToggleHistory, hasMessages }) {
  const tabLabels = {
    chat: "💬 Chat",
    calc: "🧮 Calculator",
    ded: "📋 Deductions",
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Mobile logo */}
        <div className="header-logo-mobile">
          <span className="header-logo-icon">₹</span>
          <span className="header-logo-text">TaxBot India</span>
        </div>

        {/* Desktop tab bar */}
        <div className="header-tabs">
          {Object.entries(tabLabels).map(([key, label]) => (
            <button
              key={key}
              className={`header-tab ${activeTab === key ? "header-tab--active" : ""}`}
              onClick={() => onTabChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="header-right">
        {activeTab === "chat" && (
          <>
            <button 
              className="header-action-btn" 
              onClick={onSaveChat} 
              title="Save chat"
              disabled={!hasMessages}
            >
              💾 Save
            </button>
            <button 
              className="header-action-btn" 
              onClick={onToggleHistory} 
              title="View history"
            >
              📜 History
            </button>
            <button className="header-action-btn" onClick={onClearChat} title="Clear chat">
              🗑 Clear
            </button>
          </>
        )}
        <div className="header-status">
          <span className="status-dot" />
          <span className="status-text">AI Active</span>
        </div>
      </div>
    </header>
  );
}
