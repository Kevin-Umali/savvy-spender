export interface ToolMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: "loans" | "credit" | "income" | "planning";
  categoryLabel: string;
  docs: string;
  relatedSlugs: string[];
}

export const TOOL_REGISTRY: ToolMeta[] = [
  // ===== LOANS =====
  {
    id: "affordability",
    slug: "affordability",
    title: "Affordability Calculator",
    description: "Find the max amount you can borrow based on your monthly budget",
    longDescription: "Determine the maximum loan amount you can afford based on your monthly budget, interest rate, and desired loan term. See results across multiple terms at once.",
    category: "loans",
    categoryLabel: "Loan",
    docs: `## How It Works

The affordability calculator reverses the standard loan formula. Instead of calculating the monthly payment from a loan amount, it calculates the maximum loan amount from a given monthly budget.

### Formula

\`\`\`
factor = 1 + (monthlyRate × months)
maxPrincipal = (monthlyBudget × months - processingFee) / factor
\`\`\`

### What You Need
- **Monthly Budget**: The maximum amount you can comfortably pay each month
- **Monthly Interest Rate**: The flat/add-on rate per month (e.g., 0.99%)
- **Term**: Number of months (3–36)

### Key Insight
With add-on interest, longer terms don't always mean lower total cost. The total interest grows linearly with the number of months, so a shorter term saves you money even if the monthly payment is higher.`,
    relatedSlugs: ["loan-comparison", "early-payoff", "in-house-loan"],
  },
  {
    id: "loan-comparison",
    slug: "loan-comparison",
    title: "Loan Comparison",
    description: "Compare two bank offers side-by-side across all terms",
    longDescription: "Put two bank loan offers head-to-head. Compare monthly payments, total interest, and total cost across multiple terms to find the better deal.",
    category: "loans",
    categoryLabel: "Loan",
    docs: `## How It Works

This tool compares two loan offers (Offer A vs Offer B) across the same term. It calculates monthly payment, total interest, and total cost for each offer, then tells you which is cheaper and by how much.

### What's Compared
- **Monthly Payment**: Total payment divided by months
- **Total Interest**: Principal × rate × months
- **Total Cost**: Principal + interest + processing fee
- **Savings**: Absolute difference between the two offers

### When to Use This
- Comparing two credit card balance conversion offers
- Choosing between banks for a personal loan
- Evaluating refinancing options`,
    relatedSlugs: ["affordability", "rate-converter", "early-payoff"],
  },
  {
    id: "early-payoff",
    slug: "early-payoff",
    title: "Early Payoff Calculator",
    description: "See how extra payments accelerate your loan payoff",
    longDescription: "Find out how much time and money you save by making extra payments on your loan. See the impact of even small additional amounts.",
    category: "loans",
    categoryLabel: "Loan",
    docs: `## How It Works

The early payoff calculator shows the effect of adding extra payments to your regular monthly installment. With add-on (flat) interest, extra payments reduce the number of months — and therefore the total interest.

### Formula
\`\`\`
newMonthly = originalMonthly + extraPayment
newMonths = (principal + fee) / (newMonthly - principal × rate)
interestSaved = principal × rate × (originalMonths - newMonths)
\`\`\`

### Key Insight
Even small extra payments can save significant interest over time. For example, adding ₱500/month to a ₱100,000 loan at 0.99% for 24 months can save several months and thousands in interest.`,
    relatedSlugs: ["affordability", "loan-comparison", "credit-card-payoff"],
  },
  {
    id: "in-house-loan",
    slug: "in-house-loan",
    title: "In-House Loan Calculator",
    description: "Calculate developer/dealer direct financing with down payment",
    longDescription: "Calculate in-house financing from developers or dealers. Includes down payment percentage, interest calculation, and optional balloon payment at the end.",
    category: "loans",
    categoryLabel: "Loan",
    docs: `## How It Works

In-house financing is offered directly by real estate developers or car dealers. This calculator handles the unique structure including down payment, add-on interest on the remaining balance, and optional balloon payments.

### Structure
1. **Down Payment**: A percentage of the total price paid upfront
2. **Loan Amount**: Total price minus down payment minus balloon
3. **Monthly Payments**: Flat-rate interest on the loan amount
4. **Balloon Payment**: Optional lump sum due at the end

### When to Use
- Buying a condo unit directly from a developer
- Dealer-financed vehicle purchase
- Any direct seller financing arrangement`,
    relatedSlugs: ["car-loan", "pagibig-loan", "affordability"],
  },
  {
    id: "sss-loan",
    slug: "sss-loan",
    title: "SSS Loan Calculator",
    description: "Compute SSS salary loan amortization and total cost",
    longDescription: "Calculate your SSS (Social Security System) salary loan amortization. See your monthly payment, total interest, and total cost for SSS loan terms.",
    category: "loans",
    categoryLabel: "Loan",
    docs: `## How It Works

The SSS Salary Loan is a benefit for SSS members. This calculator computes the monthly amortization and total cost.

### SSS Loan Details
- **Interest Rate**: 10% per annum (standard rate)
- **Term**: 24 months (standard)
- **Max Loan**: Based on your monthly salary credit and contributions

### Formula
\`\`\`
monthlyRate = annualRate / 12
totalInterest = loanAmount × monthlyRate × termMonths
totalPayment = loanAmount + totalInterest
monthlyAmortization = totalPayment / termMonths
\`\`\`

### Good to Know
SSS salary loans use simple interest calculated on the original principal. The effective rate is higher than the stated 10% annual rate.`,
    relatedSlugs: ["pagibig-loan", "salary", "affordability"],
  },
  {
    id: "pagibig-loan",
    slug: "pagibig-loan",
    title: "Pag-IBIG Housing Loan",
    description: "Estimate Pag-IBIG housing loan payments with MRI and insurance",
    longDescription: "Calculate Pag-IBIG Fund housing loan payments including the declining balance method, MRI (Mortgage Redemption Insurance), and fire insurance estimates.",
    category: "loans",
    categoryLabel: "Loan",
    docs: `## How It Works

Pag-IBIG housing loans use **declining balance** amortization (unlike most PH bank installments which use add-on/flat rates). This means you pay less interest over time as your principal decreases.

### Interest Rates (2024)
- **Loan ≤ ₱750K**: 3% for first 5 years, 5.375% thereafter (blended ~4%)
- **Loan > ₱750K to ₱6M**: 6.375% fixed

### Additional Costs
- **MRI**: ~0.25% of loan amount annually
- **Fire Insurance**: ~0.1% of loan amount annually

### Formula (Declining Balance)
\`\`\`
PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
\`\`\`
Where P = principal, r = monthly rate, n = total months`,
    relatedSlugs: ["sss-loan", "in-house-loan", "affordability"],
  },
  {
    id: "car-loan",
    slug: "car-loan",
    title: "Car Loan Calculator",
    description: "Auto financing with down payment and chattel mortgage fees",
    longDescription: "Calculate car loan payments including down payment, monthly installments with add-on interest, and chattel mortgage registration fees.",
    category: "loans",
    categoryLabel: "Loan",
    docs: `## How It Works

Philippine car loans typically use add-on (flat) interest rates. The calculator includes the chattel mortgage fee (a legal requirement for financed vehicles).

### Structure
1. **Vehicle Price**: The total price of the car
2. **Down Payment**: Usually 20-30% of vehicle price
3. **Loan Amount**: Vehicle price minus down payment
4. **Chattel Mortgage**: ~1.5% of loan amount (registration fee)
5. **Monthly Payment**: (Loan + Interest) / Months

### Typical PH Car Loan Terms
- Down payment: 20-30%
- Interest rate: 0.5% - 1.5% per month (flat)
- Term: 12-60 months
- Chattel mortgage: 1-2% of loan amount`,
    relatedSlugs: ["in-house-loan", "loan-comparison", "affordability"],
  },

  // ===== CREDIT & RATES =====
  {
    id: "rate-converter",
    slug: "rate-converter",
    title: "Interest Rate Converter",
    description: "Convert flat/add-on rates to effective interest rate (EIR)",
    longDescription: "Convert between flat (add-on) rates and effective interest rates (EIR). Understand the true cost of your loan beyond the advertised rate.",
    category: "credit",
    categoryLabel: "Credit",
    docs: `## How It Works

Philippine banks advertise add-on (flat) interest rates, but the **true cost** (Effective Interest Rate) is significantly higher. This tool converts between them.

### Why EIR Matters
With add-on interest, you pay interest on the **original** principal every month, even though your balance decreases. The EIR accounts for this and shows the real annual cost.

### Typical Conversion
- 0.99% monthly flat rate ≈ 21-23% EIR per annum
- 1.25% monthly flat rate ≈ 27-29% EIR per annum

### Outputs
- **Flat Rate**: Monthly and annual add-on rate
- **Total Interest %**: Total interest as percentage of principal
- **EIR**: Monthly and annual effective rate
- **Factor Rate**: The multiplier per month (monthly payment / principal)`,
    relatedSlugs: ["loan-comparison", "break-even", "credit-card-payoff"],
  },
  {
    id: "break-even",
    slug: "break-even",
    title: "Break-Even Analyzer",
    description: "Find when bank installment becomes cheaper than merchant 0%",
    longDescription: "Determine at which term length a bank installment plan becomes cheaper than a merchant's 0% installment offer. Visualize the crossover point.",
    category: "credit",
    categoryLabel: "Credit",
    docs: `## How It Works

When a merchant offers 0% installment, the total price is usually marked up. This tool finds the **break-even point** — the term at which the bank's installment (with interest on the lower cash price) costs less than the merchant's 0% plan.

### The Comparison
- **Bank Installment**: Cash price + (cash price × rate × months) + processing fee
- **Merchant 0%**: Fixed marked-up price regardless of term

### Example
- Cash price: ₱50,000
- 0% installment price: ₱55,000
- Bank rate: 0.99%/month

At shorter terms, the bank installment is cheaper. But as months increase, interest accumulates and may exceed the merchant markup.

### The Chart
The break-even chart shows both costs plotted over months, making it easy to see exactly where they cross.`,
    relatedSlugs: ["rate-converter", "loan-comparison", "credit-card-payoff"],
  },
  {
    id: "credit-card-payoff",
    slug: "credit-card-payoff",
    title: "Credit Card Payoff Calculator",
    description: "Compare minimum payments vs fixed payments to pay off faster",
    longDescription: "See how long it takes to pay off your credit card balance with minimum payments vs. a fixed higher payment. Visualize the dramatic difference in time and interest.",
    category: "credit",
    categoryLabel: "Credit",
    docs: `## How It Works

This calculator compares two strategies for paying off credit card debt:

1. **Minimum Payment**: The bank's required minimum (typically 3% of balance or ₱500, whichever is higher)
2. **Fixed Payment**: A consistent higher amount you choose

### Why Fixed Payments Win
With minimum payments, as your balance drops, your payment drops too — so you barely chip away at the principal. A fixed payment maintains its effectiveness throughout.

### Key Outputs
- **Months to payoff**: How long each method takes
- **Total paid**: Total amount including interest
- **Interest paid**: The cost of carrying the balance
- **Time saved**: Months saved with the fixed payment approach
- **Interest saved**: Money saved by paying more

### Credit Card Interest
Unlike installment loans, credit cards use **declining balance** interest — charged on the remaining balance each month. The typical annual rate is 24-36% in the Philippines.`,
    relatedSlugs: ["debt-planner", "rate-converter", "break-even"],
  },

  // ===== INCOME & TAX =====
  {
    id: "salary",
    slug: "salary",
    title: "Salary Calculator (PH)",
    description: "Compute net take-home pay with SSS, PhilHealth, Pag-IBIG, and tax",
    longDescription: "Calculate your net take-home pay after all mandatory deductions: SSS, PhilHealth, Pag-IBIG contributions, and withholding tax under the TRAIN law.",
    category: "income",
    categoryLabel: "Income",
    docs: `## How It Works

This calculator computes your net monthly take-home pay by deducting all mandatory Philippine contributions and taxes from your gross salary.

### Deduction Order
1. **SSS Contribution** (Employee share: 4.5% of MSC, max MSC ₱30,000)
2. **PhilHealth** (Employee share: 2.5% of salary, floor ₱10K, ceiling ₱100K)
3. **Pag-IBIG** (2% of salary up to ₱10,000 base = max ₱200)
4. **Taxable Income** = Gross - Total Contributions
5. **Withholding Tax** based on TRAIN law brackets

### TRAIN Law Tax Brackets (Annual)
| Income Range | Tax Rate |
|---|---|
| ≤ ₱250,000 | 0% (Exempt) |
| ₱250K - ₱400K | 15% of excess |
| ₱400K - ₱800K | ₱22,500 + 20% of excess |
| ₱800K - ₱2M | ₱102,500 + 25% of excess |
| ₱2M - ₱8M | ₱402,500 + 30% of excess |
| Over ₱8M | ₱2,202,500 + 35% of excess |

### Visualization
The donut chart breaks down your gross salary into take-home pay, contributions, and tax — making it easy to see where your money goes.`,
    relatedSlugs: ["tax", "retirement", "savings-goal"],
  },
  {
    id: "tax",
    slug: "tax",
    title: "Tax Calculator (PH)",
    description: "Income tax based on TRAIN law with freelancer 8% flat rate option",
    longDescription: "Calculate your Philippine income tax under the TRAIN law. Freelancers can compare the graduated tax vs. the 8% flat rate option to find the better deal.",
    category: "income",
    categoryLabel: "Income",
    docs: `## How It Works

The Philippine TRAIN law (Tax Reform for Acceleration and Inclusion) provides two tax computation methods for self-employed / freelancers:

### Graduated Tax
Standard tax brackets applied progressively (see salary calculator docs for the full table).

### 8% Flat Rate (Freelancers Only)
- 8% of gross income exceeding ₱250,000
- Available to self-employed individuals and professionals

### Which Is Better?
Generally, the 8% flat rate is better for freelancers earning **less than ~₱3M/year**. Above that, graduated tax may result in lower taxes. This calculator compares both and recommends the better option.

### Outputs
- Annual and monthly tax due
- Effective tax rate
- After-tax income
- Side-by-side comparison (for freelancers)`,
    relatedSlugs: ["salary", "retirement", "savings-goal"],
  },

  // ===== PLANNING & SAVINGS =====
  {
    id: "debt-planner",
    slug: "debt-planner",
    title: "Debt Snowball / Avalanche Planner",
    description: "Optimize multi-debt payoff with snowball or avalanche strategy",
    longDescription: "Plan your debt payoff strategy. Compare the snowball method (smallest balance first) vs. avalanche method (highest rate first) to find the fastest, cheapest path to debt freedom.",
    category: "planning",
    categoryLabel: "Planning",
    docs: `## How It Works

When you have multiple debts, this planner helps you decide which to pay off first using two proven strategies:

### Snowball Method
- Pay minimums on all debts
- Put extra money toward the **smallest balance** first
- When that's paid off, roll its payment into the next smallest
- **Advantage**: Quick wins keep you motivated

### Avalanche Method
- Pay minimums on all debts
- Put extra money toward the **highest interest rate** first
- When that's paid off, roll its payment into the next highest rate
- **Advantage**: Saves the most money mathematically

### What You Enter
For each debt: name, balance, monthly interest rate, and minimum payment. Plus your total extra payment available.

### What You Get
- Total months to become debt-free
- Total amount paid and total interest
- Payoff order
- Month-by-month schedule showing remaining balances`,
    relatedSlugs: ["credit-card-payoff", "early-payoff", "emergency-fund"],
  },
  {
    id: "savings-goal",
    slug: "savings-goal",
    title: "Savings Goal Calculator",
    description: "How much to save monthly to reach your financial target",
    longDescription: "Calculate exactly how much you need to save each month to reach a financial goal. See milestone markers at 25%, 50%, 75%, and 100% completion.",
    category: "planning",
    categoryLabel: "Planning",
    docs: `## How It Works

This calculator determines the monthly deposit needed to reach a savings target, optionally accounting for compound interest from a savings account or investment.

### Formula (with interest)
\`\`\`
PMT = Target × r / [(1+r)^n - 1]
\`\`\`
Where r = monthly interest rate, n = total months

### Formula (without interest)
\`\`\`
PMT = Target / months
\`\`\`

### Milestones
The calculator shows when you'll hit 25%, 50%, 75%, and 100% of your goal, helping you track progress and stay motivated.

### Use Cases
- Saving for a vacation
- Building a down payment fund
- Funding a major purchase
- Education savings`,
    relatedSlugs: ["emergency-fund", "retirement", "investment"],
  },
  {
    id: "retirement",
    slug: "retirement",
    title: "Retirement Calculator",
    description: "Project your retirement fund and check if you're on track",
    longDescription: "Project your retirement fund based on current savings, monthly contributions, and expected returns. Find out if you're on track or how much more you need to save.",
    category: "planning",
    categoryLabel: "Planning",
    docs: `## How It Works

This calculator projects whether your current savings trajectory will cover your retirement expenses.

### Two Key Numbers
1. **Projected Fund**: What you'll have at retirement based on current savings + monthly contributions + investment returns
2. **Target Fund**: How much you need to cover your monthly expenses throughout retirement

### How the Target Is Calculated
Uses the present value of an annuity formula to determine the lump sum needed at retirement to fund monthly withdrawals for a given number of years.

### Key Inputs
- Current age and retirement age
- Current savings and monthly savings
- Expected investment return rate
- Monthly expense needed in retirement
- Retirement duration (default: 25 years)

### What You Learn
- Whether you're **on track** or have a **gap**
- How much additional monthly savings would close the gap
- Your projected retirement fund value`,
    relatedSlugs: ["investment", "savings-goal", "salary"],
  },
  {
    id: "emergency-fund",
    slug: "emergency-fund",
    title: "Emergency Fund Calculator",
    description: "Calculate your target emergency fund and track progress",
    longDescription: "Determine how much you need in your emergency fund based on monthly expenses, track your current progress, and see how long it will take to reach your goal.",
    category: "planning",
    categoryLabel: "Planning",
    docs: `## How It Works

Financial experts recommend having 3-6 months of living expenses saved as an emergency fund. This calculator helps you set and track that target.

### What It Calculates
- **Target Amount**: Monthly expenses × target months
- **Current Coverage**: How many months your current savings cover
- **Remaining Amount**: How much more you need to save
- **Monthly Savings Needed**: To reach your goal within a reasonable timeframe
- **Months to Goal**: Based on your monthly savings capacity

### Guidelines
| Risk Level | Recommended Months |
|---|---|
| Stable job, no dependents | 3 months |
| Average risk | 6 months |
| Self-employed / variable income | 9-12 months |

### Visualization
The progress bar shows how far along you are, making it easy to track your emergency fund journey.`,
    relatedSlugs: ["savings-goal", "retirement", "salary"],
  },
  {
    id: "remittance",
    slug: "remittance",
    title: "Remittance Calculator",
    description: "Convert currencies with fees for OFW remittances",
    longDescription: "Calculate the effective exchange rate for OFW remittances after transfer fees. See how much your recipient actually receives in PHP.",
    category: "planning",
    categoryLabel: "Planning",
    docs: `## How It Works

For OFWs (Overseas Filipino Workers) sending money home, the actual amount received depends on the exchange rate AND the transfer fee. This calculator shows the effective rate.

### Calculation
\`\`\`
totalCost = sendAmount + fee
receiveAmount = sendAmount × exchangeRate
effectiveRate = receiveAmount / totalCost
\`\`\`

### Why Effective Rate Matters
A remittance service might offer a great exchange rate but charge a high fee, or vice versa. The effective rate combines both into a single number for easy comparison.

### Supported Currencies
You can calculate for any currency pair (USD, EUR, GBP, SGD, AED, JPY, etc.) by entering the current exchange rate to PHP.

### Tips
- Compare multiple remittance services using the effective rate
- Larger amounts tend to have lower effective fees (percentage-wise)
- Consider transfer speed vs. cost trade-offs`,
    relatedSlugs: ["salary", "savings-goal", "investment"],
  },
  {
    id: "investment",
    slug: "investment",
    title: "Investment Returns Calculator",
    description: "Project investment growth with contributions and tax",
    longDescription: "Project how your investment grows over time with compound returns, regular contributions, and Philippine withholding tax on gains.",
    category: "planning",
    categoryLabel: "Planning",
    docs: `## How It Works

This calculator projects investment growth using compound returns with regular monthly contributions, then applies Philippine withholding tax on the gains.

### Formula (Monthly Compounding)
Each month:
\`\`\`
balance = balance × (1 + monthlyRate) + monthlyContribution
\`\`\`

### Withholding Tax
The Philippines imposes a 20% final withholding tax on interest income and dividend income. This is applied to the total returns at the end.

### What You See
- **Final Amount**: Your projected portfolio value
- **Total Contributed**: How much you put in
- **Total Returns**: How much your money earned
- **After-Tax Returns**: Returns minus 20% withholding tax
- **Year-by-Year Breakdown**: A table and chart showing growth over time

### Key Insight
The power of compound interest is most visible over long periods. Even modest monthly contributions can grow significantly over 10-20 years.`,
    relatedSlugs: ["retirement", "savings-goal", "tax"],
  },
];

export const getToolBySlug = (slug: string): ToolMeta | undefined =>
  TOOL_REGISTRY.find((t) => t.slug === slug);

export const getRelatedTools = (slug: string): ToolMeta[] => {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedSlugs
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolMeta => t !== undefined);
};

export const TOOL_CATEGORIES_LIST = [
  { value: "all" as const, label: "All Tools", count: TOOL_REGISTRY.length },
  { value: "loans" as const, label: "Loans", count: TOOL_REGISTRY.filter((t) => t.category === "loans").length },
  { value: "credit" as const, label: "Credit & Rates", count: TOOL_REGISTRY.filter((t) => t.category === "credit").length },
  { value: "income" as const, label: "Income & Tax", count: TOOL_REGISTRY.filter((t) => t.category === "income").length },
  { value: "planning" as const, label: "Planning & Savings", count: TOOL_REGISTRY.filter((t) => t.category === "planning").length },
];
