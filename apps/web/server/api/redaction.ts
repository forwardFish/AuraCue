const secretKeyPattern = /(secret|token|password|api[_-]?key|authorization|cookie|credential)/i;
const secretValuePattern = /(sk-[a-z0-9_-]{8,}|client_secret|bearer\s+[a-z0-9._-]+)/i;

export function redactSecretLikeValues(value: unknown): unknown {
  if (typeof value === "string") {
    return secretValuePattern.test(value) ? "[REDACTED]" : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSecretLikeValues(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        secretKeyPattern.test(key) ? "[REDACTED]" : redactSecretLikeValues(entry)
      ])
    );
  }

  return value;
}

export function redactedEnvSnapshot(env: NodeJS.ProcessEnv = process.env) {
  return {
    nodeEnv: env.NODE_ENV ?? "development",
    databaseUrl: env.DATABASE_URL ? "[REDACTED]" : "unset",
    aiProviderKey: env.OPENAI_API_KEY || env.DEEPSEEK_API_KEY ? "[REDACTED]" : "unset"
  };
}
