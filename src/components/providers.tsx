"use client";

import React, { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { store } from "@/store";
import { AuthInitializer } from "@/features/auth/components/auth-initializer";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return setupListeners(store.dispatch);
  }, []);

  return (
    <ReduxProvider store={store}>
      <AuthInitializer>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </AuthInitializer>
    </ReduxProvider>
  );
}
