"use client";

import React from "react";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import { DocumentStatus } from "../types";
import { cn } from "@/lib/utils";

interface DocumentStatusBadgeProps {
  status: DocumentStatus | string;
  errorMessage?: string | null;
  className?: string;
}

export function DocumentStatusBadge({
  status,
  errorMessage,
  className,
}: DocumentStatusBadgeProps) {
  switch (status) {
    case "completed":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 font-mono",
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <CheckCircle2 className="h-3 w-3" />
          <span>Processed</span>
        </span>
      );

    case "processing":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60 font-mono",
            className
          )}
        >
          <Loader2 className="h-3 w-3 animate-spin text-amber-600 dark:text-amber-400" />
          <span>Analyzing...</span>
        </span>
      );

    case "pending":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 font-mono",
            className
          )}
        >
          <Clock className="h-3 w-3 text-stone-500 dark:text-stone-400" />
          <span>Queued</span>
        </span>
      );

    case "failed":
      return (
        <span
          title={errorMessage || "Processing failed"}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60 font-mono cursor-help",
            className
          )}
        >
          <AlertCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
          <span>Error</span>
        </span>
      );

    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono",
            className
          )}
        >
          {status}
        </span>
      );
  }
}
