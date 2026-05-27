import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        indigo: {
          DEFAULT: "#4F46E5",
          600: "#4f46e5",
          700: "#4338ca",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          500: "#06b6d4",
          600: "#0891b2",
        },
        teal: { DEFAULT: "#14B8A6" },
        accent: { DEFAULT: "#F97316" },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "blue-sm": "0 4px 16px rgba(37,99,235,0.12)",
        "blue-md": "0 8px 32px rgba(37,99,235,0.16)",
        "blue-lg": "0 16px 48px rgba(37,99,235,0.24)",
        card: "0 4px 24px rgba(15,23,42,0.06)",
        "card-hover": "0 12px 40px rgba(15,23,42,0.12)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #1e40af 55%, #0891b2 85%, #164e63 100%)",
        "blue-gradient":
          "linear-gradient(135deg, #2563eb, #4f46e5)",
        "card-gradient":
          "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
      },
      animation: {
        "float": "float 5s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
