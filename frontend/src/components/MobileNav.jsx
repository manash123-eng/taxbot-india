import React from "react";
import "./MobileNav.css";

export default function MobileNav({ activeTab, onTabChange }) {
  const tabs = [
    { key: "chat", icon: "💬", label: "Chat" },
    { key: "calc", icon: "🧮", label: "Calculator" },
    { key: "ded", icon: "📋", label: "Deductions" },
  ];

  return (
    <nav className="mobile-nav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`mobile-nav-item ${activeTab === tab.key ? "mobile-nav-item--active" : ""}`}
          onClick={() => onTabChange(tab.key)}
        >
          <span className="mobile-nav-icon">{tab.icon}</span>
          <span className="mobile-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
