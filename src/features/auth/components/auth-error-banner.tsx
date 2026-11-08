import React from "react";
import { AlertCircle, X } from "lucide-react";

interface AuthErrorBannerProps {
  error: string | null;
  onDismiss?: () => void;
}

export function AuthErrorBanner({ error, onDismiss }: AuthErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/90 dark:border-rose-900/40 dark:bg-rose-950/40 p-3.5 text-sm text-rose-800 dark:text-rose-200">
      <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
      <div className="flex-1 text-xs sm:text-sm leading-relaxed">{error}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-200 p-0.5 rounded cursor-pointer"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
