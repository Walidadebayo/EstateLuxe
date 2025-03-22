"use client";

import type React from "react";

import Link from "next/link";
import { SvgIcon, SVGIcon } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { chevronLeftIcon, chevronRightIcon } from "@progress/kendo-svg-icons";

export interface NavItem {
  text: string;
  route: string;
  svgIcon: SVGIcon;
  selected: boolean;
}

export function SideNavigation({
  expanded,
  navItems,
  onToggle,
}: {
  expanded: boolean;
  navItems: NavItem[];
  onToggle?: () => void;
}) {
  return (
    <div className="h-screen border-r">
      <div className={`border-b dark:border-gray-500 mt-2 py-3`}>
        {expanded ? (
          <div className="flex items-center justify-between gap-10 w-full px-3">
            <h1 className="text-xl font-bold text-center">PropManager</h1>
            {onToggle && (
              <Button
                startIcon={<SvgIcon icon={chevronLeftIcon} />}
                fillMode="flat"
                onClick={onToggle}
                size="small"
              />
            )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center px-2">
            <h1 className="text-xl font-bold">PM</h1>
            {onToggle && (
              <Button
                startIcon={<SvgIcon icon={chevronRightIcon} />}
                fillMode="flat"
                onClick={onToggle}
                size="small"
                className="!m-0"
              />
            )}
          </div>
        )}
      </div>
      <div className={`py-4 ${expanded ? "px-2" : "px-2"}`}>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.route}>
              <Link
                href={item.route}
                className={`flex items-center px-3 py-2 ${!expanded && "justify-center"} rounded-md text-sm font-medium transition-colors ${
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
