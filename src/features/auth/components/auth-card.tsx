import React from "react";
import Link from "next/link";
import { Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 mb-4 transition-transform hover:scale-105"
        >
          <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-indigo-950 dark:text-indigo-200 flex items-center gap-1">
            DocIntel AI <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Card */}
      <div
        className={cn(
          "rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/40 transition-all",
          className
        )}
      >
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-6 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
}
