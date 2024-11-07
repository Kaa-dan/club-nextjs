import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "#22B573",
        secondary: "#001915",
        success: "#198754",
        danger: "#DC3545",
        warning: "#FFC107",
        info: "#0DCAF0",
        light: "#F8F9FA",
        dark: "#212529",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "blue-100": "#E7F1FF",
        "blue-200": "#9EC5FE",
        "blue-300": "#6EA8FE",
        "blue-400": "#3D8BFD",
        "blue-500": "#0D6EFD",
        "blue-600": "#0D6EFD",
        "blue-700": "#084298",
        "blue-800": "#052C65",
        "blue-900": "#031633",

        "indigo-100": "#E0CFFC",
        "indigo-200": "#C29FFA",
        "indigo-300": "#A370F7",
        "indigo-400": "#8540F5",
        "indigo-500": "#6610F2",
        "indigo-600": "#520DC2",
        "indigo-700": "#3D0A91",
        "indigo-800": "#290661",
        "indigo-900": "#140330",

        "purple-100": "#E2D9F3",
        "purple-200": "#C5B3E6",
        "purple-300": "#A98EDA",
        "purple-400": "#8C68CD",
        "purple-500": "#6F42C1",
        "purple-600": "#59359A",
        "purple-700": "#432874",
        "purple-800": "#2C1A4D",
        "purple-900": "#160D27",

        "pink-100": "#F7D6E6",
        "pink-200": "#EFADCE",
        "pink-300": "#E685B5",
        "pink-400": "#DE5C9D",
        "pink-500": "#D63384",
        "pink-600": "#AB296A",
        "pink-700": "#801F4F",
        "pink-800": "#561435",
        "pink-900": "#2B0A1A",

        "red-100": "#F8D7DA",
        "red-200": "#F1AEB5",
        "red-300": "#EA868F",
        "red-400": "#E35D6A",
        "red-500": "#DC3545",
        "red-600": "#B02A37",
        "red-700": "#842029",
        "red-800": "#58151C",
        "red-900": "#2C0B0E",

        "orange-100": "#FFE5D0",
        "orange-200": "#FECBA1",
        "orange-300": "#FEB272",
        "orange-400": "#FD9843",
        "orange-500": "#FD7E14",
        "orange-600": "#CA6510",
        "orange-700": "#984C0C",
        "orange-800": "#653208",
        "orange-900": "#331904",

        "yellow-100": "#FFF3CD",
        "yellow-200": "#FFE69C",
        "yellow-300": "#FFDA6A",
        "yellow-400": "#FFCD39",
        "yellow-500": "#FFC107",
        "yellow-600": "#CC9A06",
        "yellow-700": "#997404",
        "yellow-800": "#664D03",
        "yellow-900": "#332701",

        "green-100": "#D1E7DD",
        "green-200": "#A3CFBB",
        "green-300": "#75B798",
        "green-400": "#479F76",
        "green-500": "#198754",
        "green-600": "#146C43",
        "green-700": "#0F5132",
        "green-800": "#0A3622",
        "green-900": "#051B11",

        "teal-100": "#D2F4EA",
        "teal-200": "#A6E9D5",
        "teal-300": "#79DFC1",
        "teal-400": "#4DD4AC",
        "teal-500": "#20C997",
        "teal-600": "#1AA179",
        "teal-700": "#13795B",
        "teal-800": "#0D503C",
        "teal-900": "#06281E",

        "cyan-100": "#CFF4FC",
        "cyan-200": "#9EEAF9",
        "cyan-300": "#6EDFF6",
        "cyan-400": "#3DD5F3",
        "cyan-500": "#0DCAF0",
        "cyan-600": "#0AA2C0",
        "cyan-700": "#087990",
        "cyan-800": "#055160",
        "cyan-900": "#032830",

        "gray-100": "#F8F9FA",
        "gray-200": "#E9ECEF",
        "gray-300": "#DEE2E6",
        "gray-400": "#CED4DA",
        "gray-500": "#ADB5BD",
        "gray-600": "#6C757D",
        "gray-700": "#495057",
        "gray-800": "#343A40",
        "gray-900": "#212529",
      },
      fontSize: {
        "body-regular": [
          "1rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.5rem",
          },
        ],
        "body-bold": [
          "1rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.5rem",
          },
        ],
        "body-italic": [
          "1rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.5rem",
          },
        ],
        "body-small": [
          "0.88rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.31rem",
          },
        ],
        "body-code": [
          "0.88rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.31rem",
          },
        ],
        "body-lead": [
          "1.25rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.88rem",
          },
        ],
        "body-blockquote": [
          "1.25rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.88rem",
          },
        ],
        "heading-h1": [
          "2.5rem",
          {
            letterSpacing: "0rem",
            lineHeight: "3rem",
          },
        ],
        "heading-h2": [
          "2rem",
          {
            letterSpacing: "0rem",
            lineHeight: "2.4rem",
          },
        ],
        "heading-h3": [
          "1.75rem",
          {
            letterSpacing: "0rem",
            lineHeight: "2.1rem",
          },
        ],
        "heading-h4": [
          "1.5rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.8rem",
          },
        ],
        "heading-h5": [
          "1.25rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.5rem",
          },
        ],
        "heading-h6": [
          "1rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.2rem",
          },
        ],
        "display-h1": [
          "5rem",
          {
            letterSpacing: "0rem",
            lineHeight: "6rem",
          },
        ],
        "display-h2": [
          "4.5rem",
          {
            letterSpacing: "0rem",
            lineHeight: "5.4rem",
          },
        ],
        "display-h3": [
          "4rem",
          {
            letterSpacing: "0rem",
            lineHeight: "4.8rem",
          },
        ],
        "display-h4": [
          "3.5rem",
          {
            letterSpacing: "0rem",
            lineHeight: "4.2rem",
          },
        ],
        "display-h5": [
          "3rem",
          {
            letterSpacing: "0rem",
            lineHeight: "3.6rem",
          },
        ],
        "display-h6": [
          "2.5rem",
          {
            letterSpacing: "0rem",
            lineHeight: "3rem",
          },
        ],
        "components-badge-h1": [
          "1.88rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.88rem",
          },
        ],
        "components-badge-h2": [
          "1.5rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.5rem",
          },
        ],
        "components-badge-h3": [
          "1.31rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.31rem",
          },
        ],
        "components-badge-h4": [
          "1.12rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.12rem",
          },
        ],
        "components-badge-h5": [
          "0.94rem",
          {
            letterSpacing: "0rem",
            lineHeight: "0.94rem",
          },
        ],
        "components-badge-h6": [
          "0.75rem",
          {
            letterSpacing: "0rem",
            lineHeight: "0.75rem",
          },
        ],
        "components-dropdowns-item-header": [
          "0.88rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.05rem",
          },
        ],
        "components-dropdowns-dropdown-header": [
          "0.88rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.05rem",
          },
        ],
        "components-progress-label": [
          "0.75rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.12rem",
          },
        ],
        "components-toast-header-title": [
          "0.88rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.31rem",
          },
        ],
        "components-toast-header-time": [
          "0.77rem",
          {
            letterSpacing: "0rem",
            lineHeight: "1.15rem",
          },
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        larger: "0px 16px 48px rgba(0, 0, 0, 0.175)",
        regular: "0px 8px 16px rgba(0, 0, 0, 0.15)",
        small: "0px 2px 4px rgba(0, 0, 0, 0.075)",
        "full-screen-overlay": "0 0 0 100vmax rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
} satisfies Config;

export default config;
