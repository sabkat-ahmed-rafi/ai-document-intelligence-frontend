"use client";

import React, { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme, Theme } from "./theme-provider";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div
        className={cn(
          "h-8 w-20 rounded-full bg-stone-200/50 dark:bg-stone-800/50 animate-pulse",
          className
        )}
      />
    );
  }

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "cream", label: "Cream", icon: <Sun className="h-3.5 w-3.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className={cn(
        "inline-flex items-center p-0.5 rounded-full border border-stone-300/80 dark:border-stone-800 bg-stone-100/80 dark:bg-stone-900/80 backdrop-blur-md shadow-2xs",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${opt.label} mode`}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full cursor-pointer select-none transition-all duration-150 active:scale-[0.96]",
              isActive
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold"
                : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
            )}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
