"use client";

import type React from "react";

import Link from "next/link";
import { dataIcon, graphIcon, layout2By2Icon, userIcon } from "@progress/kendo-svg-icons";
import { SvgIcon, SVGIcon } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import { Menu, ChevronLeft } from "lucide-react";

interface NavItem {
    text: string;
    route: string;
    svgIcon: SVGIcon
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
        svgIcon: dataIcon,
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

    const navItems: NavItem[] = getNavItems(currentPath);
    return (
        <div className="h-full border-r bg-white">
            <div className="h-14 flex items-center justify-between border-b px-3">
                {expanded ? (
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-xl font-bold">PropManager</h1>
                        {onToggle && (
                            <Button
                                icon={<ChevronLeft />}
                                fillMode="flat"
                                onClick={onToggle}
                                size="small"
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full">
                        <span className="text-xl font-bold">PM</span>
                        {onToggle && (
                            <Button
                                icon={<Menu />}
                                fillMode="flat"
                                onClick={onToggle}
                                size="small"
                            />
                        )}
                    </div>
                )}
            </div>
            <div className="py-4">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.route}>
                            <Link
                                href={item.route}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${item.selected
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="mr-3"><SvgIcon icon={item.svgIcon} /></span>
                                {expanded && <span>{item.text}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
