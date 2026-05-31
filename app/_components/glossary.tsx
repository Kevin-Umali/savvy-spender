import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface GlossaryItem {
  term: string;
  def: React.ReactNode;
}

/** Definition list of the jargon a tool uses. Two columns from md up. */
export const Glossary: React.FC<{ items: GlossaryItem[]; title?: string }> = ({
  items,
  title = "Glossary",
}) => (
  <Card className="border-border">
    <CardHeader className="pb-2">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
        {title}
      </p>
    </CardHeader>
    <CardContent>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {items.map((item) => (
          <div key={item.term}>
            <dt className="font-mono-label text-[10px] uppercase tracking-[0.16em] text-foreground mb-0.5">
              {item.term}
            </dt>
            <dd className="text-[12px] text-muted-foreground leading-relaxed">{item.def}</dd>
          </div>
        ))}
      </dl>
    </CardContent>
  </Card>
);
