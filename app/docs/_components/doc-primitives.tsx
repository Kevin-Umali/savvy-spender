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

export function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-foreground mt-6 mb-2">
      {children}
    </h3>
  );
}

export function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>;
}

export function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs leading-relaxed border-l-2 border-border pl-4 my-3 text-muted-foreground space-y-0.5">
      {children}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground border border-border rounded px-3 py-2 my-3 leading-relaxed">
      {children}
    </p>
  );
}

export function DocSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1 pb-10">{children}</div>;
}

export function Divider({ strong = false }: { strong?: boolean }) {
  return <div className={`h-px bg-border opacity-${strong ? "50" : "30"} mb-10`} />;
}
