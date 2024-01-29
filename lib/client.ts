export const cleanMarkdown = (content: string): string => {
  return content
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
};

export const rowBgColor = (monthlyPayment: number, budget?: number | null) => {
  if (!budget || budget === null || budget === 0) {
    return ""; // No color if budget is nullish or zero
  }

  console.log("bgColor", monthlyPayment, budget, monthlyPayment <= budget);
  return monthlyPayment <= budget ? "bg-green-100 dark:bg-green-800" : "bg-red-100 dark:bg-red-800";
};
