"use client";

import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  Folder,
  Trash2,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Files,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  useListThreadsQuery,
  useUpdateThreadMutation,
  useDeleteThreadMutation,
} from "../api/chat-api";
import { useListCollectionsQuery } from "@/features/collections/api/collections-api";
import { ThemeToggle } from "@/components/theme-toggle";
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

  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [menuThreadId, setMenuThreadId] = useState<string | null>(null);

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingThreadId(id);
    setEditTitle(currentTitle);
    setMenuThreadId(null);
  };

  const handleSaveRename = async (id: string) => {
    if (!editTitle.trim()) {
      setEditingThreadId(null);
      return;
    }
    try {
      await updateThread({ threadId: id, payload: { title: editTitle.trim() } }).unwrap();
      toast.success("Thread renamed");
    } catch {
      toast.error("Failed to rename thread");
    } finally {
      setEditingThreadId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setMenuThreadId(null);
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

        <div className="flex flex-col items-center gap-3">
          <ThemeToggle />
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

  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 flex flex-col justify-between border-r border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/95 dark:bg-[#100E0C]/95 backdrop-blur-md transition-all duration-200 z-30">
      {/* Top Header & New Chat */}
      <div className="p-4 space-y-4">
        {/* Brand & Collapse Button */}
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

      {/* Scrollable Center: Knowledge Bases & Recent Chats */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5 text-xs">
        {/* Knowledge Base Scoping */}
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

        {/* Recent Conversations */}
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
              {threads.map((thread) => {
                const isActive = activeThreadId === thread.id;
                const isEditing = editingThreadId === thread.id;

                return (
                  <div
                    key={thread.id}
                    className={cn(
                      "group relative flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer",
                      isActive
                        ? "bg-stone-200/80 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 font-medium"
                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-900"
                    )}
                    onClick={() => onSelectThread(thread.id)}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveRename(thread.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveRename(thread.id);
                          if (e.key === "Escape") setEditingThreadId(null);
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white dark:bg-stone-950 px-2 py-0.5 rounded text-xs border border-amber-500 focus:outline-none"
                      />
                    ) : (
                      <>
                        <span className="flex items-center gap-2 truncate min-w-0 pr-2">
                          <MessageSquare className="h-3.5 w-3.5 shrink-0 text-stone-400 group-hover:text-amber-600" />
                          <span className="truncate">{thread.title || "Untitled Chat"}</span>
                        </span>

                        {/* Options Menu on Hover */}
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuThreadId(menuThreadId === thread.id ? null : thread.id);
                            }}
                            className={cn(
                              "p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-opacity",
                              isActive || menuThreadId === thread.id
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            )}
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>

                          {menuThreadId === thread.id && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuThreadId(null);
                                }}
                              />
                              <div
                                className="absolute right-0 top-6 z-30 w-32 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1 shadow-lg text-xs font-medium space-y-0.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleStartRename(thread.id, thread.title)}
                                  className="flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  <span>Rename</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(thread.id)}
                                  className="flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Profile & Theme Toggle */}
      <div className="p-3 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {(userDisplayName || userEmail || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
              {userDisplayName || "User"}
            </p>
            <p className="text-[10px] font-mono text-stone-500 truncate">{userEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ThemeToggle />
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
