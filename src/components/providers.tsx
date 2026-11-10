"use client";

import React, { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { store } from "@/store";
import { AuthInitializer } from "@/features/auth/components/auth-initializer";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return setupListeners(store.dispatch);
  }, []);

  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AuthInitializer>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className:
                "border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 shadow-md",
            }}
          />
        </AuthInitializer>
      </ThemeProvider>
    </ReduxProvider>
  );
}
