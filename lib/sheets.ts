import type { SignupPayload } from "@/types/signup";

export async function sendToSheets(payload: SignupPayload): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_SHARED_SECRET;

  if (!url) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL not set");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, secret }),
  });

  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? "GAS error");
}
