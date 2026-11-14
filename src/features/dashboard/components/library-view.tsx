"use client";

import React from "react";
import { FolderOpen, FileText, MessageSquare, FolderPlus, UploadCloud } from "lucide-react";
import { CollectionsList, Collection } from "@/features/collections";
import { DocumentList } from "@/features/documents";
import { Button } from "@/components/ui/button";

interface LibraryViewProps {
  collectionsCount: number;
  totalDocuments: number;
  totalThreads: number;
  activeCollectionId?: string;
  onSelectCollection: (col: Collection) => void;
  onClearCollectionFilter: () => void;
  onOpenCreateCollection: () => void;
  onOpenUploadDocument: () => void;
}

export function LibraryView({
  collectionsCount,
  totalDocuments,
  totalThreads,
  activeCollectionId,
  onSelectCollection,
  onClearCollectionFilter,
  onOpenCreateCollection,
  onOpenUploadDocument,
}: LibraryViewProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* Knowledge Base Header Banner */}
      <div className="rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-700 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Knowledge Base Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Collections & Documents
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Manage your collections, upload documentation, and inspect parsed tables and vector embeddings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCreateCollection}
            className="gap-1.5 shadow-xs text-xs"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Collection</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenUploadDocument}
            className="gap-1.5 shadow-xs text-xs"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
              Collections
            </p>
            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
              {collectionsCount}
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <FolderOpen className="h-4 w-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
              Indexed Documents
            </p>
            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
              {totalDocuments}
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
              Active Threads
            </p>
            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
              {totalThreads}
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <MessageSquare className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Collections
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Knowledge bases containing your grouped research, contracts, and financial documents.
            </p>
          </div>
          {activeCollectionId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCollectionFilter}
              className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            >
              Clear Filter
            </Button>
          )}
        </div>

        <CollectionsList onSelectCollection={onSelectCollection} />
      </section>

      {/* Documents Section */}
      <section className="space-y-4 pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Indexed Documents
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Search through all ingested documents, inspect parsed tables, or trigger on-demand executive summaries.
          </p>
        </div>

        <DocumentList
          initialCollectionId={activeCollectionId}
          onOpenUpload={onOpenUploadDocument}
        />
      </section>
    </div>
  );
}
