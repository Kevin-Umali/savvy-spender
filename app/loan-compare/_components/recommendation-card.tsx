"use client";

import { useMemo } from "react";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRIORITY_OPTIONS, type Priority } from "../_lib/options";
import { pickByPriority, priorityRationale } from "../_lib/recommendation";
import type { OptionResult, Recommendation } from "../_lib/types";
import { SectionLabel, SelectField } from "./form-controls";

interface RecommendationCardProps {
  results: OptionResult[];
  recommendations: Recommendation[];
  priority: Priority;
  setPriority: (priority: Priority) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  results,
  recommendations,
  priority,
  setPriority,
}) => {
  const winner = useMemo(() => pickByPriority(results, priority), [results, priority]);
  const rationale = useMemo(
    () => priorityRationale(priority, winner, results),
    [priority, winner, results]
  );

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <SectionLabel>Recommendation</SectionLabel>
        <CardTitle className="font-display font-light text-xl tracking-tight mt-0.5">
          Winners by goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {recommendations.map((rec) => (
            <div key={rec.key} className="rounded-sm border border-border p-2.5">
              <p className="font-mono-label text-[9px] uppercase tracking-[0.15em] text-muted-foreground opacity-60">
                {rec.label}
              </p>
              <p className="text-sm font-medium leading-tight mt-0.5">{rec.optionName}</p>
              <p className="text-[11px] text-muted-foreground">{rec.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-[260px_1fr] gap-3 items-start pt-1">
          <SelectField
            label="Your priority"
            value={priority}
            onChange={setPriority}
            options={PRIORITY_OPTIONS}
          />
          <div className="rounded-md border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 flex gap-2.5">
            <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{winner.name}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed mt-0.5">
                {rationale}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
