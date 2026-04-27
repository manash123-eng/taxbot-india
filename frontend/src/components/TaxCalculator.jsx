import React from "react";
import { useTaxCalculator } from "../hooks/useTaxCalculator";
import "./TaxCalculator.css";

const fmt = (n) =>
  "₹" +
  Math.round(n).toLocaleString("en-IN");

const fmtPct = (n) => n.toFixed(2) + "%";

export default function TaxCalculator() {
  const { form, updateField, calculate, result, reset } = useTaxCalculator();

  return (
    <div className="calc-panel">
      <div className="calc-header">
        <div>
          <h2 className="calc-title">Income Tax Calculator</h2>
          <p className="calc-sub">FY 2024-25 · AY 2025-26 · Both regimes supported</p>
        </div>
        <button className="reset-btn" onClick={reset}>Reset</button>
      </div>

      {/* Regime Toggle */}
      <div className="form-card">
        <p className="card-label">Select Tax Regime</p>
        <div className="regime-toggle">
          <button
            className={`regime-tab ${form.regime === "new" ? "regime-tab--active" : ""}`}
            onClick={() => updateField("regime", "new")}
          >
            🆕 New Regime
          </button>
          <button
            className={`regime-tab ${form.regime === "old" ? "regime-tab--active" : ""}`}
            onClick={() => updateField("regime", "old")}
          >
            📜 Old Regime
          </button>
        </div>
        {form.regime === "new" ? (
          <div className="info-box">
            <strong>New Regime (Default from FY 2023-24):</strong> Lower rates, fewer deductions.
            Standard deduction of ₹75,000. Rebate u/s 87A for income ≤ ₹7L (zero tax).
          </div>
        ) : (
          <div className="info-box">
            <strong>Old Regime:</strong> Higher rates but allows all deductions (80C, 80D, HRA,
            NPS, home loan interest, etc.). Good if total deductions exceed ~₹3–3.5L.
          </div>
        )}
      </div>

      {/* Income Details */}
      <div className="form-card">
        <p className="card-label">Income Details</p>

        <div className="form-row">
          <label className="form-label">Gross Annual Income (₹)</label>
          <input
            className="form-input"
            type="number"
            placeholder="e.g. 1200000"
            value={form.grossIncome}
            onChange={(e) => updateField("grossIncome", e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Age Group</label>
          <select
            className="form-select"
            value={form.ageGroup}
            onChange={(e) => updateField("ageGroup", e.target.value)}
          >
            <option value="general">Below 60 years (General)</option>
            <option value="senior">60–80 years (Senior Citizen)</option>
            <option value="supersenior">Above 80 years (Super Senior)</option>
          </select>
        </div>
      </div>

      {/* Old Regime Deductions */}
      {form.regime === "old" && (
        <div className="form-card">
          <p className="card-label">Deductions (Old Regime)</p>

          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">
                Section 80C
                <span className="form-hint">Max ₹1,50,000</span>
              </label>
              <input
                className="form-input"
                type="number"
                placeholder="PPF, ELSS, LIC, EPF…"
                value={form.d80c}
                onChange={(e) => updateField("d80c", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                Section 80D – Health Insurance
                <span className="form-hint">Max ₹25,000–₹1,00,000</span>
              </label>
              <input
                className="form-input"
                type="number"
                placeholder="Health insurance premiums…"
                value={form.d80d}
                onChange={(e) => updateField("d80d", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                HRA Exemption
                <span className="form-hint">As calculated</span>
              </label>
              <input
                className="form-input"
                type="number"
                placeholder="Exempt HRA amount…"
                value={form.dhra}
                onChange={(e) => updateField("dhra", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                80CCD(1B) – NPS
                <span className="form-hint">Max ₹50,000</span>
              </label>
              <input
                className="form-input"
                type="number"
                placeholder="NPS contribution…"
                value={form.d80ccd}
                onChange={(e) => updateField("d80ccd", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                Section 80E – Education Loan Interest
                <span className="form-hint">No limit</span>
              </label>
              <input
                className="form-input"
                type="number"
                placeholder="Education loan interest…"
                value={form.d80e}
                onChange={(e) => updateField("d80e", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                Section 80G – Donations
                <span className="form-hint">50% or 100%</span>
              </label>
              <input
                className="form-input"
                type="number"
                placeholder="Eligible donation amount…"
                value={form.d80g}
                onChange={(e) => updateField("d80g", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                Other Deductions
                <span className="form-hint">80TTA, 80G, etc.</span>
              </label>
              <input
                className="form-input"
                type="number"
                placeholder="Any other deductions…"
                value={form.dother}
                onChange={(e) => updateField("dother", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <button className="calc-btn" onClick={calculate}>
        Calculate Tax →
      </button>

      {/* Results */}
      {result && (
        <div className="result-card">
          <p className="card-label">Tax Computation Result</p>

          {/* Summary Grid */}
          <div className="result-grid">
            <ResultBox label="Gross Income" value={fmt(result.gross)} />
            <ResultBox label="Total Deductions" value={fmt(result.totalDeductions)} color="teal" />
            <ResultBox label="Taxable Income" value={fmt(result.taxable)} />
            <ResultBox label="Base Tax" value={fmt(result.baseTax)} color="danger" />
            {result.surcharge > 0 && (
              <ResultBox label="Surcharge" value={fmt(result.surcharge)} color="danger" />
            )}
            <ResultBox label="Health & Edu Cess (4%)" value={fmt(result.cess)} color="danger" />
            <ResultBox label="Total Tax Payable" value={fmt(result.totalTax)} big color="gold" />
            <ResultBox label="Effective Tax Rate" value={fmtPct(result.effectiveRate)} />
            <ResultBox
              label="Monthly In-Hand (approx)"
              value={fmt(result.inHandMonthly)}
              color="teal"
            />
          </div>

          {/* Tax Bar */}
          <div className="tax-bar-wrap">
            <div className="tax-bar-label">
              <span>Tax Burden</span>
              <span style={{ color: "var(--gold)" }}>{fmtPct(result.effectiveRate)}</span>
            </div>
            <div className="tax-bar">
              <div
                className="tax-bar-fill"
                style={{ width: `${Math.min(result.effectiveRate * 2.5, 100)}%` }}
              />
            </div>
          </div>

          {/* Deduction Breakdown */}
          {result.deductionBreakdown.length > 0 && (
            <div className="breakdown">
              <p className="breakdown-title">Deduction Breakdown</p>
              {result.deductionBreakdown.map((d) => (
                <div key={d.label} className="breakdown-row">
                  <span>{d.label}</span>
                  <span style={{ color: "var(--teal)" }}>{fmt(d.amount)}</span>
                </div>
              ))}
              <div className="breakdown-row breakdown-row--total">
                <span>Total Deductions</span>
                <span>{fmt(result.totalDeductions)}</span>
              </div>
            </div>
          )}

          <p className="result-note">
            * Calculation based on FY 2024-25 tax slabs. Surcharge applicable for income above ₹50L.
            Consult a CA for accurate filing.
          </p>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}

function ResultBox({ label, value, color, big }) {
  const colorMap = {
    gold: "var(--gold)",
    teal: "var(--teal)",
    danger: "var(--text-danger)",
  };
  return (
    <div className={`result-box ${big ? "result-box--big" : ""}`}>
      <p className="result-box-label">{label}</p>
      <p
        className="result-box-value"
        style={{ color: colorMap[color] || "var(--text-primary)", fontSize: big ? 20 : undefined }}
      >
        {value}
      </p>
    </div>
  );
}
