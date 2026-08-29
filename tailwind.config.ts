import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        bg: {
          primary: "#0d1117",
          secondary: "#161b27",
          card: "#1c2235",
          elevated: "#212840",
          border: "#2a3352",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          blue: "#4f7eff",
          indigo: "#6366f1",
          violet: "#7c3aed",
        },
        gate: {
          answered: "#22c55e",
          unanswered: "#ef4444",
          review: "#8b5cf6",
          visited: "#64748b",
          notVisited: "#374151",
        },
        text: {
          primary: "#e2e8f0",
          secondary: "#94a3b8",
          muted: "#64748b",
          accent: "#818cf8",
        },
        difficulty: {
          easy: "#10b981",
          medium: "#f59e0b",
          hard: "#ef4444",
          unrated: "#6b7280",
        },
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.3)",
        glow: "0 0 20px rgba(79,126,255,0.25)",
        "glow-sm": "0 0 10px rgba(79,126,255,0.15)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #4f7eff 0%, #8b5cf6 100%)",
        "gradient-card": "linear-gradient(135deg, #1c2235 0%, #212840 100%)",
        "gradient-dark": "linear-gradient(180deg, #0d1117 0%, #161b27 100%)",
        "mesh-glow": "radial-gradient(ellipse at 20% 50%, rgba(79,126,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 60%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(79,126,255,0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(79,126,255,0.45)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
