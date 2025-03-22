"use client";

import type React from "react";

import Link from "next/link";
import {
  buildingBlocksIcon,
  graphIcon,
  layout2By2Icon,
  userIcon,
} from "@progress/kendo-svg-icons";
import { SvgIcon, SVGIcon } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { ChevronLeft, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface NavItem {
  text: string;
  route: string;
  svgIcon: SVGIcon;
  selected: boolean;
}

export const getNavItems = (currentPath: string): NavItem[] => [
  {
    text: "Dashboard",
    route: "/admin/dashboard",
    svgIcon: layout2By2Icon,
    selected: currentPath === "/admin/dashboard",
  },
  {
    text: "Properties",
    route: "/admin/properties",
    svgIcon: buildingBlocksIcon,
    selected: currentPath === "/admin/properties",
  },
  {
    text: "Tenants",
    route: "/admin/tenants",
    svgIcon: userIcon,
    selected: currentPath === "/admin/tenants",
  },
  {
    text: "Payments",
    route: "/admin/payments",
    svgIcon: graphIcon,
    selected: currentPath === "/admin/payments",
  },
];

export function SideNavigation({
  expanded,
  currentPath,
  onToggle,
}: {
  expanded: boolean;
  currentPath: string;
  onToggle?: () => void;
}) {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  useEffect(() => {
    setNavItems(getNavItems(currentPath));
  }, [currentPath]);

  return (
    <div className="h-full border-r bg-background">
      <div
        className={`border-b dark:border-gray-500 ${expanded ? "h-12" : "h-20"}`}
      >
        {expanded ? (
          <div className="flex items-center justify-between w-full px-3">
            <h1 className="text-xl font-bold text-center">PropManager</h1>
            {onToggle && (
              <Button
                startIcon={<ChevronLeft />}
                fillMode="flat"
                onClick={onToggle}
                size="small"
              />
            )}
          </div>
        ) : (
          <div className="w-full">
            {onToggle && (
              <Button
                startIcon={<Menu />}
                fillMode="flat"
                onClick={onToggle}
                size="small"
                className="!m-0 px-2"
              />
            )}
            <hr className="border-gray-500 my-1" />
            <h1 className="text-xl font-bold px-2">PM</h1>
          </div>
        )}
      </div>
      <div className={`py-4 ${expanded ? "px-2" : "px-2"}`}>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.route}>
              <Link
                href={item.route}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.selected
                    ? "bg-blue-50 text-primary"
                    : "text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-3">
                  <SvgIcon icon={item.svgIcon} />
                </span>
                {expanded && <span>{item.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
