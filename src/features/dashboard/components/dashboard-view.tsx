"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  LogOut,
  User as UserIcon,
  KeyRound,
  FolderOpen,
  Upload,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardView() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-[#0C0A09]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
          <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
            Initializing secure workspace...
          </p>
        </div>
      </div>
    );
  }

  const displayName = user.first_name || user.email.split("@")[0] || "User";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/85 dark:bg-[#0C0A09]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center font-bold shadow-xs">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                DocIntel <span className="text-amber-600 dark:text-amber-500 font-normal">AI</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 block leading-none">
                Workspace · Production Node
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-stone-300/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 text-xs">
              <div className="h-5 w-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[150px]">
                {user.email}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:border-rose-300 dark:hover:border-rose-900"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Editorial Greeting Header */}
        <div className="rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-700 dark:text-amber-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Workspace Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Welcome back, {displayName}.
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Your documents are organized in private collections with instant citation synthesis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              onClick={() =>
                toast.info("Document upload pipeline is active. Drag and drop any PDF/DOCX below.")
              }
            >
              <Upload className="h-3.5 w-3.5 mr-1" /> Quick Upload
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.info("Collections manager available in the upcoming collections release.")
              }
            >
              <FolderOpen className="h-3.5 w-3.5 mr-1" /> New Collection
            </Button>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
                Active Collections
              </p>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
                0
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
              <FolderOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
                Indexed Documents
              </p>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
                0
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
                Verified Queries
              </p>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
                0
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Content Layout: Documents Area & Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Activity Area (2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 sm:p-10 shadow-xs flex flex-col justify-center items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 flex items-center justify-center mb-4 border border-stone-200 dark:border-stone-700">
              <Upload className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              No documents indexed in this workspace
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mt-1.5 leading-relaxed">
              Drag and drop your PDF agreements, technical research, or quarterly filings to begin
              deterministic chunk indexing and citation-backed synthesis.
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center mt-6">
              <Button
                size="sm"
                onClick={() =>
                  toast.info("Document upload pipeline is ready for collections integration.")
                }
              >
                <Upload className="h-3.5 w-3.5 mr-1" /> Upload PDF Document
              </Button>
            </div>
          </div>

          {/* Account Profile Card (1 col) */}
          <div className="rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 shadow-xs flex flex-col justify-between">
            {showChangePassword ? (
              <ChangePasswordForm
                onSuccess={() => setShowChangePassword(false)}
                onCancel={() => setShowChangePassword(false)}
              />
            ) : (
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div className="h-9 w-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Account Profile
                    </h2>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Identity & access credentials
                    </p>
                  </div>
                </div>

                <dl className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800/60">
                    <dt className="text-stone-500 dark:text-stone-400">Name</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100">{fullName}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800/60">
                    <dt className="text-stone-500 dark:text-stone-400">Email</dt>
                    <dd className="font-mono text-stone-900 dark:text-stone-100 truncate max-w-[170px]">
                      {user.email}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800/60">
                    <dt className="text-stone-500 dark:text-stone-400">Role</dt>
                    <dd className="capitalize font-mono font-semibold text-amber-700 dark:text-amber-400">
                      {user.role}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-stone-500 dark:text-stone-400">Account Status</dt>
                    <dd className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-xs"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Change Password
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
