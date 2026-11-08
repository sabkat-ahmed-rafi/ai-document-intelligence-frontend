"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  LogOut,
  User as UserIcon,
  KeyRound,
  Sparkles,
  FolderOpen,
  Upload,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const displayName = user.first_name || user.email.split("@")[0] || "User";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                DocIntel AI <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              </span>
              <span className="text-[10px] text-slate-500 block leading-none">
                Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
              <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{user.email}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10">
          <div className="relative z-10 max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {displayName}!
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Your intelligent document repository and conversational search workspace.
            </p>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Document Collections</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Uploaded Documents</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Chat Conversations</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Workspace Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Activity / Documents Area (2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm flex flex-col justify-center items-center text-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              No documents uploaded yet
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              Upload your PDF, Word, or text files to begin semantic indexing, summaries, and AI document chat.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button
                size="md"
                className="gap-2"
                onClick={() => toast.info("Document upload will be available in the upcoming collections release.")}
              >
                <Upload className="h-4 w-4" /> Upload Document
              </Button>
              <Button
                variant="outline"
                size="md"
                className="gap-2"
                onClick={() => toast.info("Collections management will be available in the upcoming collections release.")}
              >
                <FolderOpen className="h-4 w-4" /> Create Collection
              </Button>
            </div>
          </div>

          {/* Account & Security Card (1 col) */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
            {showChangePassword ? (
              <ChangePasswordForm
                onSuccess={() => setShowChangePassword(false)}
                onCancel={() => setShowChangePassword(false)}
              />
            ) : (
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      Account Profile
                    </h2>
                    <p className="text-xs text-slate-500">Your personal account details</p>
                  </div>
                </div>

                <dl className="mt-4 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                    <dt className="text-slate-500">Name</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{fullName}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="font-medium text-slate-900 dark:text-white truncate max-w-[170px]">
                      {user.email}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                    <dt className="text-slate-500">Account Type</dt>
                    <dd className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">
                      {user.role}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-slate-500">Security</dt>
                    <dd className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" /> Protected
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
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
