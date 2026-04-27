import React, { useState } from "react";
import "./DeductionsGuide.css";

const DEDUCTIONS = [
  {
    section: "Section 80C",
    limit: "₹1,50,000",
    icon: "💰",
    color: "gold",
    items: [
      "PPF (Public Provident Fund) – 15-yr lock-in, 7.1% p.a.",
      "ELSS Mutual Funds – 3-year lock-in, market-linked returns",
      "EPF – Employee Provident Fund contributions",
      "Life Insurance Premium (LIC or private)",
      "NSC (National Savings Certificate)",
      "Sukanya Samriddhi Yojana (SSY) – for girl child",
      "5-Year Tax-Saving Bank FD",
      "Home Loan Principal Repayment",
      "Children's Tuition Fees (max 2 children)",
      "ULIP, Senior Citizen Savings Scheme (SCSS)",
    ],
    tip: "ELSS gives market returns + tax benefit. Ideal if you have a 5+ year horizon.",
  },
  {
    section: "Section 80D",
    limit: "₹25,000–₹1,00,000",
    icon: "🏥",
    color: "teal",
    items: [
      "Health insurance premium (self + family): ₹25,000",
      "Additional: Parents' health insurance: ₹25,000 (₹50,000 if senior)",
      "Preventive health check-up: ₹5,000 (within above limits)",
      "Senior citizen without insurance: ₹50,000 medical expenditure",
      "Total max: ₹25,000 + ₹50,000 = ₹75,000 (if parents are senior)",
    ],
    tip: "Buy a family floater plan + separate senior citizen plan for parents.",
  },
  {
    section: "Section 24(b) – Home Loan Interest",
    limit: "₹2,00,000",
    icon: "🏠",
    color: "blue",
    items: [
      "Interest on home loan (self-occupied): max ₹2,00,000 p.a.",
      "Let-out property: No upper limit on interest deduction",
      "Pre-construction interest: deductible in 5 equal instalments",
      "Loan must be taken after 1 April 1999",
      "Construction must complete within 5 years of loan",
    ],
    tip: "Combine with Section 80C (principal) for maximum home loan benefits.",
  },
  {
    section: "Section 80CCD(1B) – NPS",
    limit: "₹50,000 (extra)",
    icon: "👴",
    color: "purple",
    items: [
      "Over and above the ₹1.5L 80C limit",
      "Additional ₹50,000 for NPS (National Pension System)",
      "Available to salaried and self-employed individuals",
      "Partial benefit in New Regime via employer NPS (80CCD(2))",
      "NPS Tier-I account is mandatory for this benefit",
    ],
    tip: "This gives you ₹2,00,000 total (80C + 80CCD) in deductions from a single source.",
  },
  {
    section: "HRA Exemption",
    limit: "Minimum of 3 rules",
    icon: "🏢",
    color: "teal",
    items: [
      "Rule 1: Actual HRA received from employer",
      "Rule 2: 50% of basic salary (metro) OR 40% of basic (non-metro)",
      "Rule 3: Rent paid − 10% of basic salary",
      "Exempt = Minimum of above 3 amounts",
      "Metro cities: Delhi, Mumbai, Kolkata, Chennai",
      "Rent receipts + landlord PAN required if rent > ₹1L/year",
    ],
    tip: "If you pay rent to parents, you can still claim HRA. Get a rent agreement.",
  },
  {
    section: "Section 80E – Education Loan",
    limit: "No limit (8 years)",
    icon: "🎓",
    color: "blue",
    items: [
      "Interest paid on education loan (not principal)",
      "No upper limit on deduction amount",
      "Available for 8 consecutive years from repayment start",
      "Loan must be for higher education (after Class 12)",
      "Can be for self, spouse, children, or dependent student",
    ],
    tip: "Great for professionals with large education loans from premier institutions.",
  },
  {
    section: "Section 80G – Donations",
    limit: "50% or 100% of donation",
    icon: "🤝",
    color: "gold",
    items: [
      "100% deduction: PM Relief Fund, National Defence Fund",
      "50% deduction: PM Citizen Assistance Fund (PM CARES)",
      "50% deduction (with 10% limit): Charitable trusts, temples",
      "Cash donations above ₹2,000 NOT eligible",
      "Online/cheque donations get full benefit",
    ],
    tip: "Always verify 80G registration of the charity before donating.",
  },
  {
    section: "Standard Deduction",
    limit: "₹75,000 (New) / ₹50,000 (Old)",
    icon: "📄",
    color: "purple",
    items: [
      "No documents or proof needed",
      "Automatically applied to salary income",
      "New regime: ₹75,000 from FY 2024-25",
      "Old regime: ₹50,000",
      "Available to all salaried employees and pensioners",
    ],
    tip: "This replaced the earlier transport + medical allowance exemptions.",
  },
  {
    section: "Section 80TTA / 80TTB",
    limit: "₹10,000 / ₹50,000",
    icon: "🏦",
    color: "teal",
    items: [
      "80TTA: ₹10,000 on savings account interest (below 60 yrs)",
      "80TTB: ₹50,000 for senior citizens on all interest income",
      "Covers savings bank, post office, cooperative bank interest",
      "Fixed deposit interest NOT covered under 80TTA",
      "Senior citizens use 80TTB (supersedes 80TTA)",
    ],
    tip: "Keep savings account interest below ₹10,000 to eliminate tax on it.",
  },
];

export default function DeductionsGuide() {
  const [expanded, setExpanded] = useState(null);

  const totalMax = "₹4,75,000+";

  return (
    <div className="ded-panel">
      <div className="ded-header">
        <h2 className="ded-title">Deductions Guide</h2>
        <p className="ded-sub">
          Key deductions under Old Tax Regime · FY 2024-25
        </p>
      </div>

      {/* Summary Banner */}
      <div className="ded-summary">
        <div className="ds-item">
          <span className="ds-label">Max Possible Deductions</span>
          <span className="ds-value">{totalMax}</span>
        </div>
        <div className="ds-divider" />
        <div className="ds-item">
          <span className="ds-label">Sections Covered</span>
          <span className="ds-value">{DEDUCTIONS.length}</span>
        </div>
        <div className="ds-divider" />
        <div className="ds-item">
          <span className="ds-label">Regime</span>
          <span className="ds-value">Old Only *</span>
        </div>
      </div>

      {/* Deductions List */}
      <div className="ded-list">
        {DEDUCTIONS.map((ded, i) => (
          <DeductionCard
            key={ded.section}
            ded={ded}
            isOpen={expanded === i}
            onToggle={() => setExpanded(expanded === i ? null : i)}
          />
        ))}
      </div>

      <p className="ded-note">
        * Standard deduction and 80CCD(2) employer NPS are available in the New
        Regime too. All other deductions require Old Regime.
      </p>
      <div style={{ height: 24 }} />
    </div>
  );
}

function DeductionCard({ ded, isOpen, onToggle }) {
  const colorMap = {
    gold: { border: "var(--gold-border)", bg: "var(--gold-bg)", text: "var(--gold)" },
    teal: { border: "var(--teal-border)", bg: "var(--teal-bg)", text: "var(--teal)" },
    blue: {
      border: "rgba(96,165,250,0.2)",
      bg: "rgba(96,165,250,0.07)",
      text: "var(--blue)",
    },
    purple: {
      border: "rgba(167,139,250,0.2)",
      bg: "rgba(167,139,250,0.07)",
      text: "#a78bfa",
    },
  };
  const c = colorMap[ded.color] || colorMap.gold;

  return (
    <div
      className="ded-card"
      style={{ borderColor: isOpen ? c.border : undefined }}
    >
      <button className="ded-card-head" onClick={onToggle}>
        <div className="ded-card-left">
          <span className="ded-icon">{ded.icon}</span>
          <div>
            <p className="ded-section-name">{ded.section}</p>
            <span
              className="ded-limit-badge"
              style={{ background: c.bg, color: c.text, borderColor: c.border }}
            >
              {ded.limit}
            </span>
          </div>
        </div>
        <span className="ded-chevron" style={{ transform: isOpen ? "rotate(180deg)" : "" }}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="ded-card-body">
          <ul className="ded-items">
            {ded.items.map((item) => (
              <li key={item} className="ded-item">
                {item}
              </li>
            ))}
          </ul>
          {ded.tip && (
            <div className="ded-tip">
              <span className="ded-tip-icon">💡</span>
              <span>{ded.tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
