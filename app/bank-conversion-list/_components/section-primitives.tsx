export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-light text-xl tracking-tight mb-3">{children}</h2>
  );
}

export function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>;
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="border border-border rounded overflow-x-auto my-4">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 font-mono-label text-[10px] uppercase tracking-[0.1em] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-muted-foreground align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1 pb-10">{children}</div>;
}

export function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-muted-foreground/60 mt-1 leading-relaxed">{children}</p>
  );
}

export function Divider({ strong = false }: { strong?: boolean }) {
  return <div className={`h-px bg-border opacity-${strong ? "50" : "30"} mb-10`} />;
}
