"use client";

import React, { useState } from "react";
import { X, User as UserIcon, KeyRound, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { ChangePasswordForm } from "./change-password-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSettingsModal({ isOpen, onClose }: AccountSettingsModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  if (!isOpen || !user) return null;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-2xl border border-stone-300/90 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#141210] p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <UserIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Account Settings
              </h2>
              <p className="text-[11px] text-stone-500 font-mono">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-stone-200/60 dark:bg-stone-900 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={cn(
              "py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all",
              activeTab === "profile"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            )}
          >
            <UserIcon className="h-3.5 w-3.5" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={cn(
              "py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all",
              activeTab === "security"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            )}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Security</span>
          </button>
        </div>

        {/* Body Content */}
        {activeTab === "profile" ? (
          <div className="space-y-4 text-xs">
            <dl className="space-y-2.5">
              <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800/60">
                <dt className="text-stone-500">Full Name</dt>
                <dd className="font-semibold text-stone-900 dark:text-stone-100">{displayName}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800/60">
                <dt className="text-stone-500">Email Address</dt>
                <dd className="font-mono text-stone-900 dark:text-stone-100">{user.email}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800/60">
                <dt className="text-stone-500">Access Role</dt>
                <dd className="capitalize font-mono font-semibold text-amber-700 dark:text-amber-400">
                  {user.role}
                </dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-stone-500">Verification Status</dt>
                <dd className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified
                </dd>
              </div>
            </dl>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("security")}
                className="w-full gap-2 text-xs"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Change Password
              </Button>
            </div>
          </div>
        ) : (
          <ChangePasswordForm
            onSuccess={() => setActiveTab("profile")}
            onCancel={() => setActiveTab("profile")}
          />
        )}
      </div>
    </div>
  );
}
