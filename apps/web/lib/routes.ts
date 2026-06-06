export type AuraCueRouteId =
  | "Route-001"
  | "Route-002"
  | "Route-003"
  | "Route-004"
  | "Route-005"
  | "Route-006"
  | "Route-007"
  | "Route-008"
  | "Route-009";

export type AuraCueRouteDefinition = {
  id: AuraCueRouteId;
  path: string;
  label: string;
  shellTitle: string;
  uiId: string;
  nextPath?: string;
};

export const auraCueRoutes = [
  {
    id: "Route-001",
    path: "/",
    label: "Home",
    shellTitle: "Daily Aura Card Entry",
    uiId: "UI-001",
    nextPath: "/create/context"
  },
  {
    id: "Route-002",
    path: "/create/context",
    label: "Context",
    shellTitle: "Optional Context",
    uiId: "UI-002",
    nextPath: "/create/upload"
  },
  {
    id: "Route-003",
    path: "/create/upload",
    label: "Upload",
    shellTitle: "Optional Outfit Upload",
    uiId: "UI-003",
    nextPath: "/create/draw"
  },
  {
    id: "Route-004",
    path: "/create/draw",
    label: "Draw",
    shellTitle: "Draw Session",
    uiId: "UI-004",
    nextPath: "/result/demo-card"
  },
  {
    id: "Route-005",
    path: "/result/[id]",
    label: "Result",
    shellTitle: "Daily Aura Card Result",
    uiId: "UI-005"
  },
  {
    id: "Route-006",
    path: "/activate/[id]",
    label: "Activate",
    shellTitle: "Activate Today's Aura",
    uiId: "UI-006"
  },
  {
    id: "Route-007",
    path: "/activated/[id]",
    label: "Activated",
    shellTitle: "Aura Activated",
    uiId: "UI-007"
  },
  {
    id: "Route-008",
    path: "/share/[id]",
    label: "Share",
    shellTitle: "Share Story Preview",
    uiId: "UI-008"
  },
  {
    id: "Route-009",
    path: "/saved/[id]",
    label: "Saved",
    shellTitle: "Save Success",
    uiId: "UI-009"
  }
] as const satisfies readonly AuraCueRouteDefinition[];

export function routeByPath(path: string): AuraCueRouteDefinition | null {
  return auraCueRoutes.find((route) => route.path === path) ?? null;
}

export function materializeRoute(path: string, params: Record<string, string> = {}) {
  return path.replace(/\[([^\]]+)\]/g, (_, key: string) => params[key] ?? `[${key}]`);
}
