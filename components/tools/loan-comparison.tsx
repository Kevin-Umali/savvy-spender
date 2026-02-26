"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  compareLoanOffers,
  type LoanComparisonResult,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/client";

const TERM_OPTIONS = [3, 6, 9, 12, 18, 24, 36];

export default function LoanComparison() {
  const [loanAmount, setLoanAmount] = useState("");
  const [bankAName, setBankAName] = useState("");
  const [bankARate, setBankARate] = useState("");
  const [bankAFee, setBankAFee] = useState("");
  const [bankBName, setBankBName] = useState("");
  const [bankBRate, setBankBRate] = useState("");
  const [bankBFee, setBankBFee] = useState("");
  const [results, setResults] = useState<LoanComparisonResult[] | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const principal = parseFloat(loanAmount);
    const rateA = parseFloat(bankARate) / 100;
    const feeA = parseFloat(bankAFee) || 0;
    const rateB = parseFloat(bankBRate) / 100;
    const feeB = parseFloat(bankBFee) || 0;

    if (isNaN(principal) || isNaN(rateA) || isNaN(rateB)) return;

    const offerA = { name: bankAName || "Bank A", rate: rateA, processingFee: feeA };
    const offerB = { name: bankBName || "Bank B", rate: rateB, processingFee: feeB };

    const rows = TERM_OPTIONS.map((months) =>
      compareLoanOffers(principal, offerA, offerB, months)
    );
    setResults(rows);
  };

  const nameA = bankAName || "Bank A";
  const nameB = bankBName || "Bank B";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Comparison</CardTitle>
        <CardDescription>
          Compare two bank loan offers side by side across different terms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lc-amount">Loan Amount</Label>
            <Input
              id="lc-amount"
              type="number"
              placeholder="e.g. 100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              required
              min="0"
              step="any"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-lg border p-4">
              <h4 className="font-medium">Bank A</h4>
              <div className="space-y-2">
                <Label htmlFor="lc-a-name">Name</Label>
                <Input
                  id="lc-a-name"
                  type="text"
                  placeholder="e.g. BDO"
                  value={bankAName}
                  onChange={(e) => setBankAName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lc-a-rate">Monthly Rate (%)</Label>
                <Input
                  id="lc-a-rate"
                  type="number"
                  placeholder="e.g. 1.5"
                  value={bankARate}
                  onChange={(e) => setBankARate(e.target.value)}
                  required
                  min="0"
                  step="any"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lc-a-fee">Processing Fee</Label>
                <Input
                  id="lc-a-fee"
                  type="number"
                  placeholder="e.g. 500"
                  value={bankAFee}
                  onChange={(e) => setBankAFee(e.target.value)}
                  min="0"
                  step="any"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <h4 className="font-medium">Bank B</h4>
              <div className="space-y-2">
                <Label htmlFor="lc-b-name">Name</Label>
                <Input
                  id="lc-b-name"
                  type="text"
                  placeholder="e.g. BPI"
                  value={bankBName}
                  onChange={(e) => setBankBName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lc-b-rate">Monthly Rate (%)</Label>
                <Input
                  id="lc-b-rate"
                  type="number"
                  placeholder="e.g. 1.2"
                  value={bankBRate}
                  onChange={(e) => setBankBRate(e.target.value)}
                  required
                  min="0"
                  step="any"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lc-b-fee">Processing Fee</Label>
                <Input
                  id="lc-b-fee"
                  type="number"
                  placeholder="e.g. 1000"
                  value={bankBFee}
                  onChange={(e) => setBankBFee(e.target.value)}
                  min="0"
                  step="any"
                />
              </div>
            </div>
          </div>

          <Button type="submit">Calculate</Button>
        </form>

        {results && (
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Months</TableHead>
                  <TableHead>{nameA} Monthly</TableHead>
                  <TableHead>{nameA} Total</TableHead>
                  <TableHead>{nameB} Monthly</TableHead>
                  <TableHead>{nameB} Total</TableHead>
                  <TableHead>Savings</TableHead>
                  <TableHead>Winner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row) => (
                  <TableRow key={row.months}>
                    <TableCell>{row.months}</TableCell>
                    <TableCell>
                      {formatCurrency(row.offerA.monthlyPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.offerA.totalPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.offerB.monthlyPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.offerB.totalPayment)}
                    </TableCell>
                    <TableCell>{formatCurrency(row.savings)}</TableCell>
                    <TableCell>
                      {row.winner === "tie" ? (
                        <Badge variant="secondary">Tie</Badge>
                      ) : (
                        <Badge>
                          {row.winner === "A" ? nameA : nameB}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
