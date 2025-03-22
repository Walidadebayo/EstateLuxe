"use client";
import { NavBar } from "./navbar";

interface TopNavigationProps {
  onMenuToggle: () => void;
}

export function TopNavigation({ onMenuToggle }: TopNavigationProps) {
  return <NavBar isAdminView={true} onMenuToggle={onMenuToggle} />;
}
