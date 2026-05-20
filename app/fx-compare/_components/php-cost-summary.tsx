"use client";

const fmtPhp = (n: number) =>
  `₱${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function PhpCostSummary({
  foreignAmount,
  currencyName,
  phpPerUnit,
}: {
  foreignAmount: number;
  currencyName: string;
  phpPerUnit: number;
}) {
  const base = foreignAmount * phpPerUnit;
  return (
    <div className="mt-5 rounded-sm border bg-muted/20 p-4">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2">
        PHP Cost Summary · {foreignAmount} {currencyName}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-[11px] text-muted-foreground">Base rate (no markup)</p>
          <p className="tabular-nums font-semibold">{fmtPhp(base)}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">With 2% markup (typical)</p>
          <p className="tabular-nums font-semibold">{fmtPhp(base * 1.02)}</p>
        </div>
        <div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Savings with 0% card</p>
          <p className="tabular-nums font-semibold text-emerald-700 dark:text-emerald-400">
            {fmtPhp(base * 0.02)} saved
          </p>
        </div>
      </div>
    </div>
  );
}
