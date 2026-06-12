import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0c0d10",
          50: "#12141a",
          100: "#181b22",
          200: "#22262f",
          300: "#2e333d",
        },
        accent: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          muted: "#60a5fa",
          soft: "rgba(59, 130, 246, 0.1)",
          ring: "rgba(59, 130, 246, 0.22)",
        },
      },
      boxShadow: {
        panel: "0 20px 40px -12px rgba(0, 0, 0, 0.45)",
        "panel-lg": "0 24px 48px -16px rgba(0, 0, 0, 0.5)",
        subtle: "0 1px 2px rgba(0, 0, 0, 0.24)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [daisyui],
};
