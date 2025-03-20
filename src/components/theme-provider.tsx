"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // React.useEffect(() => {
  //   // Get theme from localStorage or fallback to default
  //   const theme = localStorage.getItem("theme") || "default";
  //   loadTheme(theme);
  // }, []);

  // const loadTheme = (theme: string) => {
  //   let link = document.getElementById("theme-stylesheet") as HTMLLinkElement;

  //   if (link) {
  //     if (link.parentNode) {
  //       link.parentNode.removeChild(link);
  //     }
  //   }

  //   // Create a new link element for the selected theme
  //   link = document.createElement("link");
  //   link.id = "theme-stylesheet";
  //   link.rel = "stylesheet";

  //   switch (theme) {
  //     case "bootstrap":
  //       link.href = "/bootstrap-theme.css";
  //       break;
  //     case "customBootstrap":
  //       link.href = "/custom-theme-bootstrap.css";
  //       break;
  //     default:
  //       link.href = "/default-theme.css";
  //       break;
  //   }

  //   document.head.appendChild(link);
  // };
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
