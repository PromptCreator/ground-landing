import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validators";
import { sendToSheets } from "@/lib/sheets";
import type { SignupPayload } from "@/types/signup";

export async function POST(req: NextRequest) {
  let body: Partial<SignupPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (!body.email || !isValidEmail(body.email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ ok: false, error: "consent required" }, { status: 400 });
  }

  const payload: SignupPayload = {
    email: body.email.trim(),
    industry: body.industry ?? "",
    region: body.region ?? "",
    consent: true,
    utm_source: body.utm_source ?? "",
    utm_medium: body.utm_medium ?? "",
    utm_campaign: body.utm_campaign ?? "",
    referrer: body.referrer ?? "",
    user_agent: req.headers.get("user-agent") ?? "",
  };

  try {
    await sendToSheets(payload);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
