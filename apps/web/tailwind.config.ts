import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        auracue: {
          ink: "#101B37",
          muted: "#6B7280",
          cream: "#FDF9F3",
          coral: "#DB8A86",
          gold: "#D4AF37"
        }
      },
      boxShadow: {
        "auracue-card": "0 8px 32px rgba(0, 0, 0, 0.05)"
      },
      borderRadius: {
        "auracue-card": "16px"
      }
    }
  },
  plugins: []
};

export default config;
