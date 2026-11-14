"use client";

import dynamic from "next/dynamic";

const DashboardView = dynamic(
  () => import("@/features/dashboard").then((mod) => mod.DashboardView),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-[#0C0A09]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
          <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
            Initializing workspace...
          </p>
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  return <DashboardView />;
}

