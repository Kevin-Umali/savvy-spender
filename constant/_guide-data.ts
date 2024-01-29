export const GUIDE_MD = `## Installment Options - How I Calculate it and How They Work

### Introduction

I've found that understanding installment options can be incredibly useful when it comes to managing finances and making substantial purchases. In this explanation, I'll share how I calculate installment options and provide a step-by-step guide on how they work. Please note that while I've made every effort to ensure accuracy, I'm not entirely certain if this is the correct calculation. If you have any doubts or corrections, please feel free to share them.

### Key Input Parameters

Before diving into the calculations, it's essential to gather the following key input parameters:

- **Principal Amount**: This is the total amount you want to finance or purchase.
- **Interest Rate**: The monthly interest rate as a decimal (e.g., 1% as 0.01).
- **Processing Fee (optional)**: Any additional fees associated with the installment plan.
- **Number of Installments**: The number of months over which you want to spread your payments.

### Step-by-Step Calculation

Let's walk through the process of calculating installment options with a detailed example using your specific calculation method:

**Example Input**:

- Principal Amount: ₱30,000
- Interest Rate: 1% (monthly interest rate)
- Processing Fee: ₱0
- Number of Installments: 12 months

**Step 1: Calculate Simple Interest**

- Start by calculating the simple interest for the loan period:
  - Simple Interest = **Principal Amount - Monthly Interest Rate - Number of Installments**
  - Simple Interest = **₱30,000 - 0.01 - 12 = ₱3,600**

**Step 2: Calculate Factor Rate**

- Compute the factor rate:
  - Factor Rate = **(1 + (Simple Interest / Principal Amount)) / Number of Installments**
  - Factor Rate = **(1 + (₱3,600 / ₱30,000)) / 12 = 0.0933**

**Step 3: Calculate Monthly Payment**

- Determine the monthly payment:
  - Monthly Payment = **(Principal Amount + Simple Interest) / Number of Installments**
  - Monthly Payment = **(₱30,000 + ₱3,600) / 12 = ₱2,800**

**Step 4: Calculate Effective Interest Rate PA (EIR PA)**

- Calculate the Effective Interest Rate per annum (EIR PA):
  - EIR PA = **RATE(Number of Installments, -Factor Rate, 1) \* 12**
  - EIR PA = **21.46%** _(I'm using the RATE function of the excel)_

**Step 5: Calculate Total Payment**

- Calculate the total payment over the loan period:
  - Total Payment = **(Principal Amount + Simple Interest) + Processing Fee**
  - Total Payment = **(₱30,000 + ₱3,600) + ₱0 = ₱33,600**

**Step 6: Review and Decision**

- Review the installment plan details:
  - Months: **12**
  - Simple Interest: **₱3,600**
  - Factor Rate: **0.0933**
  - EIR PA: **21.46%**
  - Monthly Payment: **₱2,800**
  - Total Payment: **₱33,600**
`;
