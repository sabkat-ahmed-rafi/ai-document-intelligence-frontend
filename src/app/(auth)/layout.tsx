import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-[#FAF8F5] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 overflow-x-hidden transition-colors duration-200">
      {/* Refined subtle ambient texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[36rem] w-[36rem] rounded-full bg-amber-500/5 dark:bg-amber-400/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#a8a29e15_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)]" />
      </div>

      <div className="w-full flex justify-center">{children}</div>
    </div>
  );
}
