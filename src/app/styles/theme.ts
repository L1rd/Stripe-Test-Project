import type { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    background: "#F7F8FC",
    surface: "#FFFFFF",
    primary: "#635BFF",
    primaryHover: "#5148E5",
    text: "#202124",
    textSecondary: "#737782",
    border: "#E5E7EB",
    error: "#DC2626",
    success: "#16A34A",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  radius: {
    sm: "6px",
    md: "12px",
    lg: "20px",
  },

  typography: {
    fontFamily: "'Inter', sans-serif",
  },
};
