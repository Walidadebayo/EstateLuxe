"use client";

import { useAuth } from "@/lib/auth-context";
import React from "react";
import { NavBar } from "./navbar";

export default function Navigation() {
  const { isAdmin } = useAuth();

  return !isAdmin && <NavBar />;
}
