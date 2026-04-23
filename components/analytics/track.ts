type EventName =
  | "hero_cta_click"
  | "prototype_interact"
  | "signup_submit"
  | "signup_success"
  | "signup_error";

export function track(name: EventName, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag?.("event", name, params ?? {});
}
