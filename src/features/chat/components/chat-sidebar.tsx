"use client";

import React from "react";
import {
  Plus,
  MessageSquare,
  Folder,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Files,
  Sparkles,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import {
  useListThreadsQuery,
  useUpdateThreadMutation,
  useDeleteThreadMutation,
} from "../api/chat-api";
import { useListCollectionsQuery } from "@/features/collections/api/collections-api";
import { SidebarThreadItem } from "./sidebar-thread-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  activeThreadId?: string;
  onSelectThread: (threadId: string) => void;
  onNewChat: () => void;
  activeCollectionId?: string;
  onSelectCollection: (collectionId?: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSwitchToLibrary: () => void;
  onOpenSettings: () => void;
  userEmail?: string;
  userDisplayName?: string;
  onLogout: () => void;
}

export function ChatSidebar({
  activeThreadId,
  onSelectThread,
  onNewChat,
  activeCollectionId,
  onSelectCollection,
  isCollapsed,
  onToggleCollapse,
  onSwitchToLibrary,
  onOpenSettings,
  userEmail,
  userDisplayName,
  onLogout,
}: ChatSidebarProps) {
  const { data: threadsRes, isLoading: isThreadsLoading } = useListThreadsQuery();
  const threads = threadsRes?.data?.items || [];

  const { data: collectionsRes } = useListCollectionsQuery();
  const collections = collectionsRes?.data?.collections || [];

  const [deleteThread] = useDeleteThreadMutation();
  const [updateThread] = useUpdateThreadMutation();

  const handleRename = async (id: string, newTitle: string) => {
    try {
      await updateThread({ threadId: id, payload: { title: newTitle } }).unwrap();
      toast.success("Thread renamed");
    } catch {
      toast.error("Failed to rename thread");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteThread(id).unwrap();
      toast.success("Conversation deleted");
      if (activeThreadId === id) {
        onNewChat();
      }
    } catch {
      toast.error("Failed to delete conversation");
    }
  };

  // Compact Collapsed Sidebar
  if (isCollapsed) {
    return (
      <aside className="w-16 shrink-0 h-screen sticky top-0 flex flex-col items-center justify-between py-4 border-r border-stone-200/80 dark:border-stone-800/80 bg-[#F4EFE6]/70 dark:bg-[#0C0A09]/90 backdrop-blur-md transition-all duration-200 z-30">
        <div className="flex flex-col items-center gap-4 w-full">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onNewChat}
            className="h-10 w-10 rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-xs transition-transform active:scale-[0.96]"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </button>

          <div className="h-px w-8 bg-stone-300/80 dark:border-stone-800" />

          <button
            type="button"
            onClick={onSwitchToLibrary}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
            title="Library & Documents"
          >
            <Files className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
    );
  }

  // Full Expanded Sidebar
  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 flex flex-col justify-between border-r border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/95 dark:bg-[#100E0C]/95 backdrop-blur-md transition-all duration-200 z-30">
      {/* Top Header & Actions */}
      <div className="p-4 space-y-4">
        {/* Brand & Collapse */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-stone-900 dark:text-stone-100">
                DocIntel <span className="text-amber-600 font-normal">AI</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={onNewChat}
          className="w-full justify-between bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-100 dark:text-stone-900 h-10 px-3.5 rounded-xl text-xs font-semibold shadow-xs group"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-amber-500 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Chat</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-stone-800 dark:bg-stone-200 text-stone-300 dark:text-stone-700 rounded border border-stone-700 dark:border-stone-300/80">
            ⌘K
          </kbd>
        </Button>

        {/* View Switcher: Chat vs Library */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-stone-200/60 dark:bg-stone-900/80 text-xs font-medium">
          <button
            type="button"
            className="py-1.5 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
            <span>AI Chat</span>
          </button>
          <button
            type="button"
            onClick={onSwitchToLibrary}
            className="py-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center gap-1.5 transition-all"
          >
            <Files className="h-3.5 w-3.5" />
            <span>Library</span>
          </button>
        </div>
      </div>

      {/* Center: Knowledge Bases & Conversation History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5 text-xs">
        {/* Knowledge Scope Selection */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 font-semibold">
            <span>Knowledge Scope</span>
            <span>{collections.length} Bases</span>
          </div>

          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => onSelectCollection(undefined)}
              className={cn(
                "flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl transition-colors text-left",
                !activeCollectionId
                  ? "bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-semibold"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-900"
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <Folder className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span className="truncate">All Documents</span>
              </span>
            </button>

            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => onSelectCollection(col.id)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl transition-colors text-left",
                  activeCollectionId === col.id
                    ? "bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-semibold"
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-900"
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  <Folder className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                  <span className="truncate">{col.name}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 shrink-0">
                  {col.document_count || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversations History */}
        <div className="space-y-1.5">
          <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 font-semibold">
            <span>Conversations</span>
          </div>

          {isThreadsLoading ? (
            <div className="space-y-1.5 px-2 py-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-7 rounded-lg bg-stone-200/60 dark:bg-stone-800/60 animate-pulse"
                />
              ))}
            </div>
          ) : threads.length === 0 ? (
            <div className="px-2 py-4 text-center text-stone-400 dark:text-stone-500 text-[11px]">
              No conversations yet. Start a chat above.
            </div>
          ) : (
            <div className="space-y-0.5">
              {threads.map((thread) => (
                <SidebarThreadItem
                  key={thread.id}
                  thread={thread}
                  isActive={activeThreadId === thread.id}
                  onSelect={onSelectThread}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Bar & Profile Trigger */}
      <div className="p-3 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-2 min-w-0 p-1.5 -ml-1 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/80 transition-colors text-left flex-1"
          title="Manage Account Settings"
        >
          <div className="h-7 w-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
            {(userDisplayName || userEmail || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
              {userDisplayName || "User"}
            </p>
            <p className="text-[10px] font-mono text-stone-500 truncate">{userEmail}</p>
          </div>
          <Settings className="h-3.5 w-3.5 text-stone-400 shrink-0" />
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
