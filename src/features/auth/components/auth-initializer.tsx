"use client";

import React, { useEffect } from "react";
import { useLazyGetProfileQuery } from "../api/auth-api";
import { useAppSelector } from "@/store/hooks";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const [getProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    if (!isInitialized) {
      getProfile();
    }
  }, [isInitialized, getProfile]);

  return <>{children}</>;
}
