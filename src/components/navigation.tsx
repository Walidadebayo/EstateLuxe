"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";
import { Button, DropDownButton } from "@progress/kendo-react-buttons";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Home, Search, Heart, User, Bot } from "lucide-react";
import { SvgIcon } from "@progress/kendo-react-common";
import { menuIcon, userIcon, xIcon } from "@progress/kendo-svg-icons";
import { useTheme } from "next-themes";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import Image from "next/image";

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const link = document.getElementById("theme-stylesheet") as HTMLLinkElement;
    link?.parentNode?.removeChild(link);

    if (theme === "bootstrap") {
      const link = document.createElement("link");
      link.id = "theme-stylesheet";
      link.rel = "stylesheet";
      link.href = "/theme-bootstrap.css";
      document.head.appendChild(link);
    } else if (theme === "customBootstrap") {
      const link = document.createElement("link");
      link.id = "theme-stylesheet";
      link.rel = "stylesheet";
      link.href = "/custom-theme-bootstrap.css";
      document.head.appendChild(link);
    } else if (theme === "dark") {
      const link = document.createElement("link");
      link.id = "theme-stylesheet";
      link.rel = "stylesheet";
      link.href = "/dark-theme-bootstrap.css";
      document.head.appendChild(link);
    }
  }, [theme]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Favourites", href: "/favourites", icon: Heart },
    { name: "Dashboard", href: "/dashboard", icon: User },
    { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <AppBar className="dar: !border-b shadow-sm py-2 px-4 dark:border-gray-700 !sticky top-0 z-50 dark:shadow-slate-600 backdrop-blur-sm backdrop-filter">
        <AppBarSection>
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Image
                src="/logo.png"
                alt="Logo"
                width={45}
                height={45}
                className="rounded-full"
              />
              <span className="text-xl font-bold">EstateLuxe</span>
            </Link>
          </div>
        </AppBarSection>

        <AppBarSpacer />

        <AppBarSection>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </div>
        </AppBarSection>

        <AppBarSpacer />

        <AppBarSection className="ml-auto">
          {/* Search Bar */}

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* User Profile Button */}
            <DropDownButton
              text="Admin"
              svgIcon={userIcon}
              items={[
                "Dashboard",
                "Properties",
                "Tenants",
                "Payments",
                "Settings",
                "Logout",
              ]}
              onItemClick={(e) => {
                router.push(`/admin/${e.item.toLowerCase()}`);
              }}
            ></DropDownButton>

            {/* Theme Toggle Button */}

            <DropDownList
              data={[
                "Default",
                "Bootstrap",
                "Custom Bootstrap",
                "Dark Bootstrap",
              ]}
              defaultValue={theme}
              onChange={(e) => {
                const selectedTheme = e.target.value;
                if (selectedTheme === "Default") {
                  setTheme("default");
                } else if (selectedTheme === "Bootstrap") {
                  setTheme("bootstrap");
                } else if (selectedTheme === "Custom Bootstrap") {
                  setTheme("customBootstrap");
                } else if (selectedTheme === "Dark Bootstrap") {
                  setTheme("dark");
                }
              }}
            />

            {/* Mobile Menu Button */}
            <Button
              className="md:!hidden dark:!text-gray-200 dark:!bg-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <SvgIcon icon={xIcon} />
              ) : (
                <SvgIcon icon={menuIcon} />
              )}
            </Button>
          </div>
        </AppBarSection>
      </AppBar>
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 p-3 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? "bg-gray-900 text-gray-700 dark:text-gray-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
