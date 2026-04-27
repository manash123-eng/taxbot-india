import { useState, useCallback } from "react";

// ─── Tax Slab Calculators ────────────────────────────────────────────────────

function calcNewRegimeTax(taxableIncome) {
  // FY 2024-25 New Regime Slabs
  if (taxableIncome <= 300000) return 0;

  let tax = 0;
  const slabs = [
    { from: 300000, to: 700000, rate: 5 },
    { from: 700000, to: 1000000, rate: 10 },
    { from: 1000000, to: 1200000, rate: 15 },
    { from: 1200000, to: 1500000, rate: 20 },
    { from: 1500000, to: Infinity, rate: 30 },
  ];

  for (const slab of slabs) {
    if (taxableIncome > slab.from) {
      const taxable = Math.min(taxableIncome, slab.to) - slab.from;
      tax += (taxable * slab.rate) / 100;
    }
  }

  // Rebate u/s 87A — no tax if income ≤ ₹7,00,000
  if (taxableIncome <= 700000) tax = 0;

  return tax;
}

function calcOldRegimeTax(taxableIncome, ageGroup) {
  let basicExemption = 250000;
  if (ageGroup === "senior") basicExemption = 300000;
  if (ageGroup === "supersenior") basicExemption = 500000;

  if (taxableIncome <= basicExemption) return 0;

  let tax = 0;
  const above = taxableIncome - basicExemption;

  if (ageGroup === "supersenior") {
    // Super senior: 20% from 0-5L above exemption, 30% above
    const slab1 = Math.min(above, 500000);
    const slab2 = Math.max(0, above - 500000);
    tax = slab1 * 0.2 + slab2 * 0.3;
  } else {
    // General & Senior: 5% first 2.5L, 20% next 5L, 30% above
    const slab1 = Math.min(above, 250000);
    const slab2 = Math.min(Math.max(0, above - 250000), 500000);
    const slab3 = Math.max(0, above - 750000);
    tax = slab1 * 0.05 + slab2 * 0.2 + slab3 * 0.3;
  }

  // Rebate u/s 87A — no tax if income ≤ ₹5,00,000
  if (taxableIncome <= 500000) tax = 0;

  return tax;
}

function calcSurcharge(tax, income) {
  if (income <= 5000000) return 0;
  if (income <= 10000000) return tax * 0.1;
  if (income <= 20000000) return tax * 0.15;
  if (income <= 50000000) return tax * 0.25;
  return tax * 0.37;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

const initialState = {
  regime: "new",
  grossIncome: "",
  ageGroup: "general",
  // Old regime deductions
  d80c: "",
  d80d: "",
  dhra: "",
  d80ccd: "",
  d80e: "",
  d80g: "",
  dother: "",
};

export function useTaxCalculator() {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState(null);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const calculate = useCallback(() => {
    const gross = parseFloat(form.grossIncome) || 0;
    if (gross <= 0) {
      setResult(null);
      return;
    }

    let taxable = gross;
    let totalDeductions = 0;
    let deductionBreakdown = [];

    if (form.regime === "new") {
      // New regime: only standard deduction ₹75,000
      const stdDed = Math.min(75000, gross);
      totalDeductions = stdDed;
      taxable = Math.max(0, gross - stdDed);
      deductionBreakdown = [{ label: "Standard Deduction", amount: stdDed }];
    } else {
      // Old regime: all deductions
      const stdDed = 50000;
      const d80c = Math.min(parseFloat(form.d80c) || 0, 150000);
      const d80d = Math.min(parseFloat(form.d80d) || 0, 100000);
      const hra = parseFloat(form.dhra) || 0;
      const d80ccd = Math.min(parseFloat(form.d80ccd) || 0, 50000);
      const d80e = parseFloat(form.d80e) || 0;
      const d80g = parseFloat(form.d80g) || 0;
      const other = parseFloat(form.dother) || 0;

      const deds = [
        { label: "Standard Deduction", amount: stdDed },
        { label: "Section 80C", amount: d80c },
        { label: "Section 80D", amount: d80d },
        { label: "HRA Exemption", amount: hra },
        { label: "Section 80CCD(1B) NPS", amount: d80ccd },
        { label: "Section 80E (Edu Loan)", amount: d80e },
        { label: "Section 80G (Donations)", amount: d80g },
        { label: "Other Deductions", amount: other },
      ].filter((d) => d.amount > 0);

      totalDeductions = deds.reduce((s, d) => s + d.amount, 0);
      taxable = Math.max(0, gross - totalDeductions);
      deductionBreakdown = deds;
    }

    // Calculate tax
    let baseTax =
      form.regime === "new"
        ? calcNewRegimeTax(taxable)
        : calcOldRegimeTax(taxable, form.ageGroup);

    const surcharge = calcSurcharge(baseTax, taxable);
    const taxAfterSurcharge = baseTax + surcharge;
    const cess = taxAfterSurcharge * 0.04;
    const totalTax = taxAfterSurcharge + cess;
    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;
    const inHandMonthly = (gross - totalTax) / 12;

    setResult({
      gross,
      taxable,
      totalDeductions,
      deductionBreakdown,
      baseTax,
      surcharge,
      cess,
      totalTax,
      effectiveRate,
      inHandMonthly,
      regime: form.regime,
    });
  }, [form]);

  const reset = useCallback(() => {
    setForm(initialState);
    setResult(null);
  }, []);

  return { form, updateField, calculate, result, reset };
}
