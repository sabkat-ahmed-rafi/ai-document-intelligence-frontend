import React, { Suspense } from "react";
import { LoginForm } from "./login-form";

export function LoginView() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse h-96" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
