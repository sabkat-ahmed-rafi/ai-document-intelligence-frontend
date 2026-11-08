"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Sparkles,
  ArrowRight,
  Search,
  Bot,
  Lock,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function HomeView() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 text-base">
              DocIntel AI <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 sm:py-24 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-144 w-xl rounded-full bg-linear-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[32px_32px]" />
        </div>

        <div className="max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen Document Intelligence & RAG
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Transform documents into <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-indigo-500 to-purple-600">instant knowledge</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            AI-driven document processing, intelligent search, and conversational insights for your team&apos;s knowledge base.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl w-full mt-16 sm:mt-24">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm space-y-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Lock className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Enterprise Security
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Private and encrypted document workspaces with protected sessions and access control.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm space-y-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Search className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Hybrid Search
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Precision retrieval blending semantic meaning and keyword matching for fast answers.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm space-y-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Conversational Insights
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask questions directly to your documents with contextual memory and citations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>&copy; 2026 DocIntel AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
