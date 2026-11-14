"use client";

import React, { useState } from "react";
import { MessageSquare, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Thread } from "../types";
import { cn } from "@/lib/utils";

interface SidebarThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export function SidebarThreadItem({
  thread,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: SidebarThreadItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSaveRename = () => {
    if (editTitle.trim() && editTitle.trim() !== thread.title) {
      onRename(thread.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="px-2.5 py-1">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSaveRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveRename();
            if (e.key === "Escape") setIsEditing(false);
          }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-white dark:bg-stone-950 px-2 py-1 rounded-lg text-xs border border-amber-500 focus:outline-none text-stone-900 dark:text-stone-100"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(thread.id)}
      className={cn(
        "group relative flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer",
        isActive
          ? "bg-stone-200/80 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 font-medium"
          : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-900"
      )}
    >
      <span className="flex items-center gap-2 truncate min-w-0 pr-2">
        <MessageSquare className="h-3.5 w-3.5 shrink-0 text-stone-400 group-hover:text-amber-600" />
        <span className="truncate">{thread.title || "Untitled Chat"}</span>
      </span>

      {/* Options Dropdown Menu */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className={cn(
            "p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-opacity",
            isActive || isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
            />
            <div
              className="absolute right-0 top-6 z-30 w-32 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1 shadow-lg text-xs font-medium space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsEditing(true);
                }}
                className="flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <Edit2 className="h-3 w-3" />
                <span>Rename</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(thread.id);
                }}
                className="flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
