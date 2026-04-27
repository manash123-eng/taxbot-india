import React from "react";
import "./Sidebar.css";

const QUICK_QUESTIONS = [
  "What are the new tax regime slabs for FY 2024-25?",
  "How do I file ITR online step by step?",
  "What is the Section 80C deduction limit?",
  "New vs Old tax regime – which is better for me?",
  "How is HRA exemption calculated?",
  "What is the last date to file ITR?",
  "What documents do I need for ITR filing?",
  "How to claim home loan tax benefits?",
];

export default function Sidebar({ activeTab, onTabChange, onQuickAsk }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">₹</div>
        <div className="logo-text-group">
          <span className="logo-name">TaxBot India</span>
          <span className="logo-tagline">AI TAX ASSISTANT</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-section-label">Menu</p>

        <NavItem
          icon="💬"
          label="Chat Assistant"
          active={activeTab === "chat"}
          onClick={() => onTabChange("chat")}
        />
        <NavItem
          icon="🧮"
          label="Tax Calculator"
          active={activeTab === "calc"}
          onClick={() => onTabChange("calc")}
        />
        <NavItem
          icon="📋"
          label="Deductions Guide"
          active={activeTab === "ded"}
          onClick={() => onTabChange("ded")}
        />

        {/* Quick Questions */}
        <p className="nav-section-label" style={{ marginTop: 20 }}>
          Quick Ask
        </p>
        <div className="quick-box">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              className="quick-item"
              onClick={() => {
                onTabChange("chat");
                onQuickAsk(q);
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="fy-badge">📅 FY 2024–25 · AY 2025–26</div>
        <p className="disclaimer">
          For guidance only. Consult a CA for professional advice.
        </p>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      className={`nav-item ${active ? "nav-item--active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-item-icon">{icon}</span>
      <span className="nav-item-label">{label}</span>
    </button>
  );
}
