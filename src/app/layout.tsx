import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import AiAssistant from "@/components/ai-assistant";
import "@progress/kendo-theme-default/dist/all.css";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Estate Management System",
  description:
    "A comprehensive estate management system with AI-powered recommendations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="customBootstrap"
          value={{
            default: "theme-default",
            bootstrap: "theme-bootstrap",
            customBootstrap: "theme-custom-bootstrap",
            dark: "dark",
          }}
        >
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <div className="flex-1 ">{children}</div>
            <AiAssistant />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
