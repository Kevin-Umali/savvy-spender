import { NextRequest, NextResponse } from "next/server";
import { computeComparison } from "@/app/loan-compare/_lib/compute";
import type { ScenarioInput } from "@/app/loan-compare/_lib/types";

export async function POST(request: NextRequest) {
  const scenario = (await request.json()) as ScenarioInput;

  if (!scenario?.vehicle || !scenario.vehicle.originalPrice || scenario.vehicle.originalPrice <= 0) {
    return NextResponse.json({ error: "Vehicle price is required." }, { status: 400 });
  }

  return NextResponse.json(computeComparison(scenario));
}
