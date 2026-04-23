export function getUtmParams(): {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
} {
  if (typeof window === "undefined") {
    return { utm_source: "", utm_medium: "", utm_campaign: "", referrer: "" };
  }
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") ?? "",
    utm_medium: p.get("utm_medium") ?? "",
    utm_campaign: p.get("utm_campaign") ?? "",
    referrer: document.referrer,
  };
}
