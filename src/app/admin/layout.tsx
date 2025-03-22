"use client";

import type React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { NavItem, SideNavigation } from "@/components/side-navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { TopNavigation } from "@/components/top-navigation";
import {
  buildingBlocksIcon,
  graphIcon,
  layout2By2Icon,
  userIcon,
} from "@progress/kendo-svg-icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const navItems: NavItem[] = [
    {
      text: "Dashboard",
      route: "/admin/dashboard",
      svgIcon: layout2By2Icon,
      selected: pathname === "/admin/dashboard",
    },
    {
      text: "Properties",
      route: "/admin/properties",
      svgIcon: buildingBlocksIcon,
      selected: pathname === "/admin/properties",
    },
    {
      text: "Tenants",
      route: "/admin/tenants",
      svgIcon: userIcon,
      selected: pathname === "/admin/tenants",
    },
    {
      text: "Payments",
      route: "/admin/payments",
      svgIcon: graphIcon,
      selected: pathname === "/admin/payments",
    },
  ];

  const toggleDrawer = () => setDrawerExpanded((prev) => !prev);

  return (
    <>
      <TopNavigation onMenuToggle={toggleDrawer} />
      <div className="flex h-screen">
        <Drawer
          expanded={drawerExpanded}
          position="start"
          mode={isMobile ? "overlay" : "push"}
          mini={!isMobile}
          onOverlayClick={() => setDrawerExpanded(false)}
        >
          <DrawerContent>
            <SideNavigation
              expanded={drawerExpanded}
              navItems={navItems}
              onToggle={toggleDrawer}
            />
          </DrawerContent>
        </Drawer>

        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
