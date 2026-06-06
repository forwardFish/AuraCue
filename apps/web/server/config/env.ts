import { redactedEnvSnapshot } from "../api/redaction";

export type WebApiConfig = {
  apiVersion: string;
  mode: "local-first";
  services: {
    db: "prisma-local-sqlite-validation";
    ai: "deterministic-local-fallback";
    storage: "local-artifacts-only";
    analytics: "local-collector-only";
  };
  env: ReturnType<typeof redactedEnvSnapshot>;
};

export function getWebApiConfig(): WebApiConfig {
  return {
    apiVersion: "0.1.0-t04",
    mode: "local-first",
    services: {
      db: "prisma-local-sqlite-validation",
      ai: "deterministic-local-fallback",
      storage: "local-artifacts-only",
      analytics: "local-collector-only"
    },
    env: redactedEnvSnapshot()
  };
}
