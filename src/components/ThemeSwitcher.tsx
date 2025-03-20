"use client";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    loadTheme(newTheme);
  };

  const loadTheme = (theme: string) => {
    let link = document.getElementById("theme-stylesheet") as HTMLLinkElement;

    if (link) {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }

    link = document.createElement("link");
    link.id = "theme-stylesheet";
    link.rel = "stylesheet";

    switch (theme) {
      case "bootstrap":
        link.href = "/bootstrap-theme.css";
        break;
      case "customBootstrap":
        link.href = "/custom-theme-bootstrap.css";
        break;
      case "dark":
        link.href = "/dark-theme-bootstrap.css";
        break;
      default:
        link.href = "/default-theme.css";
        break;
    }

    document.head.appendChild(link);
  };

  if (!mounted) return null;

  return (
    // <div style={{ textAlign: "right", marginBottom: "20px" }}>
    //   <button
    //     onClick={() =>
    //       switchTheme(theme === "default" ? "bootstrap" : "default")
    //     }
    //     className="k-button k-primary"
    //   >
    //     {theme === "default"
    //       ? "Switch to Bootstrap 🌐"
    //       : "Switch to Default 🌟"}
    //   </button>
    // </div>
    <DropDownList
      data={["Default", "Bootstrap", "Custom Bootstrap", "Dark Mode"]}
      defaultValue="Default"
      onChange={(e) => {
        const selectedTheme = e.target.value;
        if (selectedTheme === "Default") {
          switchTheme("default");
        } else if (selectedTheme === "Bootstrap") {
          switchTheme("bootstrap");
        } else if (selectedTheme === "Custom Bootstrap") {
          switchTheme("customBootstrap");
        } else if (selectedTheme === "Dark Mode") {
          switchTheme("dark");
        }
      }}
    />
  );
};

export default ThemeSwitcher;
