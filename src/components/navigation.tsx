"use client";

import React from "react";
import { NavBar } from "./navbar";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const isAdminView = pathname.startsWith("/admin");

  return !isAdminView && <NavBar />;

}
