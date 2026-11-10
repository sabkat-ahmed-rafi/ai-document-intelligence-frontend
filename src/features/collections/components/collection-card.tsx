"use client";

import React, { useState } from "react";
import { Folder, MoreVertical, Edit3, Trash2, FileText, Calendar } from "lucide-react";
import { Collection } from "../types";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
  onSelect?: (collection: Collection) => void;
}

export function CollectionCard({
  collection,
  onEdit,
  onDelete,
  onSelect,
}: CollectionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedDate = new Date(collection.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      onClick={() => onSelect?.(collection)}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-5 shadow-xs transition-all duration-150 ease-out hover:border-stone-400 dark:hover:border-stone-700 hover:shadow-md",
        onSelect && "cursor-pointer active:scale-[0.99]"
      )}
    >
      <div>
        {/* Top Header: Folder Icon & Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-2xs">
            <Folder className="h-5 w-5" />
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors cursor-pointer"
              aria-label="Collection options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1 shadow-lg text-xs font-medium space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEdit(collection);
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Rename</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete(collection);
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Name & Description */}
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
            {collection.name}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed min-h-[32px]">
            {collection.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-5 pt-3.5 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <span>
            {collection.document_count}{" "}
            {collection.document_count === 1 ? "document" : "documents"}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-stone-400 dark:text-stone-500" />
          <span>{formattedDate}</span>
        </span>
      </div>
    </div>
  );
}
