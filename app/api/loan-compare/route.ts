import { NextRequest, NextResponse } from "next/server";
import { computeComparison } from "@/app/loan-compare/_lib/compute";
import { scenarioSchema } from "@/app/loan-compare/_lib/schema";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = scenarioSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid comparison inputs." },
      { status: 400 },
    );
  const scenario = parsed.data;

  if (
    !scenario?.vehicle ||
    !scenario.vehicle.originalPrice ||
    scenario.vehicle.originalPrice <= 0
  ) {
    return NextResponse.json(
      { error: "Vehicle price is required." },
      { status: 400 },
    );
  }

  if (!Array.isArray(scenario.options) || scenario.options.length === 0) {
    return NextResponse.json(
      { error: "Add at least one financing option." },
      { status: 400 },
    );
  }

  return NextResponse.json(computeComparison(scenario));
}
