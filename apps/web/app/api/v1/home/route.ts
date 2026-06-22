import { createRequestContext, jsonOk } from "@/server/api/envelope";

const homeContent = {
  dateLabel: "Jun 13",
  weekdayLabel: "Saturday",
  rulingPlanet: "Saturn",
  traits: [
    { label: "Structure", icon: "shield.png" },
    { label: "Boundaries", icon: "lock.png" },
    { label: "Stability", icon: "scales.png" }
  ],
  firstAuraCta: "Start My First Aura",
  ritualCta: "Begin Today's Ritual",
  firstAuraHref: "/onboarding/birth-aura",
  ritualHref: "/today/check-in"
};

export async function GET(request: Request) {
  const context = createRequestContext(request);
  return jsonOk(context, homeContent);
}
