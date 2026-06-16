export const p0RouteRegistry = [
  { uiId: "UI-01", route: "/", pagePath: "pages/index/index", state: "mood-home", ownerScenario: "SCN-001", title: "Mood-first Home", apiIds: ["API-010"], requiresCardId: false, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-001.png" },
  { uiId: "UI-02", route: "/create/context", pagePath: "pages/create/context", state: "optional-context", ownerScenario: "SCN-002", title: "Optional Context", apiIds: ["API-010"], requiresCardId: false, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-002.png" },
  { uiId: "UI-03", route: "/create/upload", pagePath: "pages/create/upload", state: "optional-outfit-upload", ownerScenario: "SCN-003", title: "Optional Outfit Upload", apiIds: ["API-010"], requiresCardId: false, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-003.png" },
  { uiId: "UI-04", route: "/create/draw", pagePath: "pages/create/draw", state: "draw-card-selection", ownerScenario: "SCN-004", title: "Draw Card Selection", apiIds: ["API-001", "API-010"], requiresCardId: false, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-004.png" },
  { uiId: "UI-05", route: "/create/draw", pagePath: "pages/create/draw", state: "draw-generation-loading", ownerScenario: "SCN-004", title: "Draw Generation Loading", apiIds: ["API-002", "API-010"], requiresCardId: false, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-004.png" },
  { uiId: "UI-06", route: "/result/:id", pagePath: "pages/result/index", state: "aura-card-result", ownerScenario: "SCN-005", title: "Daily Aura Card Result", apiIds: ["API-003", "API-010"], requiresCardId: true, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-005.png" },
  { uiId: "UI-07", route: "/activate/:id", pagePath: "pages/activate/index", state: "activate-hold-to-seal", ownerScenario: "SCN-006", title: "Activate Today's Aura", apiIds: ["API-004", "API-010"], requiresCardId: true, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-006.png" },
  { uiId: "UI-08", route: "/activated/:id", pagePath: "pages/activated/index", state: "aura-activated", ownerScenario: "SCN-007", title: "Aura Activated", apiIds: ["API-004", "API-007", "API-008", "API-010"], requiresCardId: true, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-007.png" },
  { uiId: "UI-09", route: "/share/:id", pagePath: "pages/share/index", state: "story-preview", ownerScenario: "SCN-008", title: "Share Story Preview", apiIds: ["API-008", "API-009", "API-010"], requiresCardId: true, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-008.png" },
  { uiId: "UI-10", route: "/share/:id/channels", pagePath: "pages/share/index", state: "share-channel-chooser", ownerScenario: "SCN-008", title: "Share Channel Chooser", apiIds: ["API-008", "API-010"], requiresCardId: true, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-008.png" },
  { uiId: "UI-11", route: "/saved/:id", pagePath: "pages/saved/index", state: "save-success", ownerScenario: "SCN-009", title: "Save Success", apiIds: ["API-007", "API-010"], requiresCardId: true, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-009.png" },
  { uiId: "UI-12", route: "/error/network", pagePath: "pages/error/network", state: "network-error", ownerScenario: "SCN-010", title: "Network Error", apiIds: ["API-001", "API-002", "API-010"], requiresCardId: false, sourceReference: "docs/auto-execute/screenshots/web/T15/reference/UI-010.png" }
];

export const requiredApiIds = ["API-001", "API-002", "API-003", "API-004", "API-007", "API-008", "API-009", "API-010"];

export function routeManifest() {
  return {
    status: "PASS",
    sourceOfTruth: "final-prd-v1.0",
    routes: p0RouteRegistry.map((route) => ({ ...route })),
    uiCoverage: p0RouteRegistry.map((route) => route.uiId),
    apiCoverage: requiredApiIds.filter((apiId) => p0RouteRegistry.some((route) => route.apiIds.includes(apiId))),
    demotedLegacyScope: "unlock-pay-invite"
  };
}
