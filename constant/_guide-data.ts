export const GUIDE_MD = `## Savvy Spender — How the Calculators Work

### Introduction

Understanding your installment and loan options is key to making smart financial decisions. Savvy Spender supports three types of calculations commonly used in the Philippines:

1. **Balance Conversion** — Compare bank installment vs. 0% merchant installment when you buy something with a credit card.
2. **Credit-to-Cash** — Calculate how much you'll pay when converting available credit into cash.
3. **Personal Loan** — Estimate payments for a bank personal loan including Documentary Stamp Tax (DST).

All calculations use the **add-on (flat) rate method**, which is the standard used by Philippine banks for credit card installments and most unsecured personal loans.

---

### How Add-On (Flat) Interest Works

Philippine banks charge interest on the **original principal** for the entire term — not on the declining balance. This is called the "add-on" or "flat" method.

- **Monthly Interest** = Principal × Monthly Rate
- **Total Interest** = Principal × Monthly Rate × Number of Months
- **Monthly Payment** = (Principal + Total Interest) / Number of Months

This is simpler to compute, but the **Effective Interest Rate (EIR)** is roughly 1.8×–2.0× higher than the stated add-on rate.

> **BSP Regulation:** The Bangko Sentral ng Pilipinas caps the monthly add-on rate for credit card installment loans at **1.00% per month** (BSP Circular No. 1098, retained by Circular No. 1165).

---

### Calculator 1: Balance Conversion

This is for when you **buy something with your credit card** and want to compare your options:

- **Full cash payment** — Pay the cash price outright.
- **0% merchant installment** — The merchant may offer a 0% interest plan (often at a slightly higher total price).
- **Bank balance conversion** — The bank converts your balance to installments with monthly add-on interest.

#### Key Input Parameters

- **Principal / Amount** — The full cash price of the item.
- **Interest Rate** — Monthly add-on rate (e.g., 0.99%).
- **Installment Amount** (optional) — The total amount under a 0% merchant installment plan.
- **Processing Fee** (optional) — Typically ₱300–₱500 per availment.
- **Monthly Budget** (optional) — Highlights which plans fit your budget.

#### Step-by-Step Example

**Input:** ₱30,000 item, 1% monthly rate, 12 months, no processing fee.

**Step 1 — Simple Interest:**
Simple Interest = ₱30,000 × 0.01 × 12 = **₱3,600**

**Step 2 — Factor Rate:**
Factor Rate = (1 + 3,600 / 30,000) / 12 = **0.0933**

**Step 3 — Monthly Payment:**
Monthly Payment = (₱30,000 + ₱3,600) / 12 = **₱2,800**

**Step 4 — Effective Interest Rate PA (EIR PA):**
Using the Excel RATE function: EIR PA = **~21.46%**

**Step 5 — Total Payment:**
Total Payment = ₱30,000 + ₱3,600 + ₱0 (processing fee) = **₱33,600**

#### Optimal Principal Insight

If you provide a 0% installment amount, the calculator uses binary search to find the ideal principal where the bank's total installment (with interest) stays just under the 0% plan total. This helps you decide: *should I take the bank conversion or the 0% merchant plan?*

---

### Calculator 2: Credit-to-Cash

Credit-to-Cash (also called Cash2Go, CashLite, Ready Cash, YourCash depending on the bank) converts your **available credit limit** into actual cash deposited to your bank account.

#### How It Differs from Balance Conversion

| Feature | Balance Conversion | Credit-to-Cash |
|---------|-------------------|----------------|
| Source | Existing purchases already on card | Unused available credit limit |
| Output | Balance restructured into installments | Cash deposited to your account |
| Use case | Managing a large purchase | Emergency cash, paying bills |

#### Calculation

The math is **identical** to Balance Conversion (add-on/flat rate). The only difference is context — you're converting unused credit to cash rather than restructuring a purchase.

#### Typical Fees

- Processing fee: ₱250–₱500 per availment
- Terms: 3–36 months (up to 60 at some banks)
- Rates: 0.49%–1.00% monthly add-on (varies by bank and promo)

---

### Calculator 3: Personal Loan

Personal loans are standalone, unsecured bank loans — separate from credit cards.

#### Key Difference: Documentary Stamp Tax (DST)

Personal loans above ₱250,000 are subject to **Documentary Stamp Tax** under the Philippine NIRC:

- **Rate:** ₱1.50 per ₱200 of loan face value (~0.75%)
- **Exemption:** Loans of ₱250,000 and below for personal use are exempt
- **DST is deducted from loan proceeds** at disbursement

#### Example

**Input:** ₱500,000 loan, 1.25% monthly rate, 36 months, ₱1,500 origination fee.

- DST = (500,000 / 200) × 1.50 = **₱3,750**
- Net Proceeds = ₱500,000 − ₱3,750 − ₱1,500 = **₱494,750** (what you actually receive)
- Total Interest = ₱500,000 × 0.0125 × 36 = **₱225,000**
- Monthly Payment = (₱500,000 + ₱225,000) / 36 = **₱20,138.89**
- Total Payable = ₱725,000 + ₱5,250 (fees) = **₱730,250**

> You borrow ₱500K but only receive ₱494,750 — yet you pay interest on the full ₱500K.

#### Typical Personal Loan Rates (PH Banks)

| Bank | Monthly Add-On Rate | Approx. EIR (Annual) | Terms |
|------|--------------------|--------------------|-------|
| BDO | 1.39%–1.79% | 18%–24% | 6–36 months |
| BPI | ~1.20% | 25%–29% | 12–36 months |
| Metrobank | ~1.25% | 30%–33% | 12–36 months |

---

### Understanding the Results

#### Simple Interest (%)
Total interest as a percentage of the principal. Formula: (Principal × Rate × Months) / Principal × 100.

#### Factor Rate
The multiplier that converts 1 unit of principal into the per-period payment. Formula: (1 + Simple Interest %) / Months.

#### Effective Interest Rate PA (EIR PA)
The true annualized cost of borrowing, accounting for the declining balance effect. Calculated using the Excel RATE function internally. This is always significantly higher than the stated add-on rate.

#### Monthly Budget Highlighting
If you provide a monthly budget, plans where the monthly payment fits within your budget appear in **green**. Plans that exceed your budget appear in **red**.

---

### Disclaimer

Different banks may offer varying conversion terms, rates, and promos. The information provided here is for **reference purposes only**. Rates shown are add-on (flat) rates — the effective interest rate (EIR) will always be higher. Always verify details directly with the respective banks before making financial decisions.
`;
