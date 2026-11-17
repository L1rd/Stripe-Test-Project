import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      primary: string;
      primaryHover: string;
      text: string;
      textSecondary: string;
      border: string;
      error: string;
      success: string;
    };

    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };

    radius: {
      sm: string;
      md: string;
      lg: string;
    };

    typography: {
      fontFamily: string;
    };
  }
}
