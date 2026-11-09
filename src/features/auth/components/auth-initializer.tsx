"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLazyGetProfileQuery } from "../api/auth-api";
import { useAppSelector } from "@/store/hooks";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const [getProfile] = useLazyGetProfileQuery();

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    if (!isInitialized && !isAuthRoute) {
      getProfile();
    }
  }, [isInitialized, isAuthRoute, getProfile]);

  return <>{children}</>;
}
