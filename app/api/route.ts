import { computeInstallments } from "@/app/calculator/_lib/compute";
import { CalculateFormSchema } from "@/app/calculator/_lib/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = CalculateFormSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid installment inputs." },
      { status: 400 },
    );
  return NextResponse.json(computeInstallments(parsed.data));
}
