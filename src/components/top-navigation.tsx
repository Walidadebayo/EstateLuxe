"use client";

import { Button } from "@progress/kendo-react-buttons";
import { Menu } from "lucide-react";
import { Navigation } from "./navigation";

interface TopNavigationProps {
  onMenuToggle: () => void;
}

export function TopNavigation({ onMenuToggle }: TopNavigationProps) {
  return (
    <div className="flex items-center border-b p-2 h-14 bg-white">
      <Button
        startIcon={<Menu />}
        fillMode="flat"
        onClick={onMenuToggle}
        className="mr-4"
      />
      <Navigation isAdminView={true} onMenuToggle={onMenuToggle} />
    </div>
  );
}
