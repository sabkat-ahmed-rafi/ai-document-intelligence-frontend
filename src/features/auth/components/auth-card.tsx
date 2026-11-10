import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

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
      {/* Top Bar with Theme Toggle */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-stone-300/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 shadow-2xs backdrop-blur-xs transition-transform hover:scale-105"
        >
          <div className="h-5 w-5 rounded-lg bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-stone-100 dark:text-stone-900 shadow-2xs">
            <FileText className="h-3 w-3" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1">
            DocIntel <span className="text-amber-600 dark:text-amber-400">AI</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Card */}
      <div
        className={cn(
          "rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white/95 dark:bg-[#141210]/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 dark:shadow-black/60 transition-all",
          className
        )}
      >
        <div className="text-left mb-6 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div>{children}</div>

        {footer && (
          <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800/80 text-center text-xs text-stone-600 dark:text-stone-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
