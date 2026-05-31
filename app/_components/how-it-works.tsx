import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface HowItWorksPoint {
  heading?: string;
  body: React.ReactNode;
}

interface HowItWorksProps {
  points: HowItWorksPoint[];
  docsHref?: string; // optional "Full method →" deep link into /docs
}

/** Plain-language "what this does / what the result means" card. */
export const HowItWorks: React.FC<HowItWorksProps> = ({ points, docsHref }) => (
  <Card className="border-border">
    <CardHeader className="pb-2">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60">
        How it works
      </p>
    </CardHeader>
    <CardContent className="space-y-2.5 text-[12px] text-muted-foreground leading-relaxed">
      {points.map((point, i) => (
        <p key={i}>
          {point.heading && <span className="text-foreground font-medium">{point.heading}. </span>}
          {point.body}
        </p>
      ))}
      {docsHref && (
        <Link
          href={docsHref}
          className="inline-block pt-1 text-[12px] font-medium text-foreground underline underline-offset-4"
        >
          Full method →
        </Link>
      )}
    </CardContent>
  </Card>
);
