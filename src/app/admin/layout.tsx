"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  type DrawerContentProps,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Menu } from "lucide-react";
import { getNavItems, SideNavigation } from "@/components/side-navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { TopNavigation } from "@/components/top-navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [navItems, setNavItems] = useState(getNavItems(pathname));

  useEffect(() => {
    setNavItems(getNavItems(pathname));
  }, [pathname]);

  // Custom drawer renderer
  const CustomDrawerContent = (props: DrawerContentProps) => {
    return (
      <DrawerContent {...props}>
        <SideNavigation
          expanded={drawerExpanded}
          currentPath={pathname}
          onToggle={() => setDrawerExpanded(!drawerExpanded)}
        />
      </DrawerContent>
    );
  };

  return (
    <>
      <TopNavigation onMenuToggle={() => setDrawerExpanded(!drawerExpanded)} />
      <Drawer
        expanded={drawerExpanded}
        position="start"
        mode={isMobile ? "overlay" : "push"}
        mini={!isMobile}
        items={navItems}
        item={CustomDrawerContent}
        onOverlayClick={() => setDrawerExpanded(false)}
      >
        <div className="flex flex-col h-screen w-screen">
          <div className="flex-1 p-6 overflow-auto">
            {isMobile && !drawerExpanded && (
              <Button
                startIcon={<Menu />}
                fillMode="flat"
                onClick={() => setDrawerExpanded(true)}
                className="mb-4 lg:hidden"
              />
            )}
            {children}
          </div>
        </div>
      </Drawer>
    </>
  );
}
