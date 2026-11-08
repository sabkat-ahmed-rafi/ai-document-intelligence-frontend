import { Suspense } from "react";
import { HomeView } from "@/features/home";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <HomeView />
    </Suspense>
  );
}
