import { Suspense } from "react";
import { DashboardView } from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <DashboardView />
    </Suspense>
  );
}
