"use client";

import React, { useState } from "react";
import { FolderPlus, Search, Folder, RefreshCw } from "lucide-react";
import { useListCollectionsQuery } from "../api/collections-api";
import { Collection } from "../types";
import { CollectionCard } from "./collection-card";
import { CreateCollectionModal } from "./create-collection-modal";
import { EditCollectionModal } from "./edit-collection-modal";
import { DeleteCollectionDialog } from "./delete-collection-dialog";
import { Button } from "@/components/ui/button";

interface CollectionsListProps {
  onSelectCollection?: (collection: Collection) => void;
  className?: string;
}

export function CollectionsList({ onSelectCollection, className }: CollectionsListProps) {
  const { data, isLoading, isError, refetch } = useListCollectionsQuery();
  const collections = data?.data?.collections || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={className}>
      {/* Top Controls: Search & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9.5 pl-10 pr-3.5 rounded-xl border border-stone-300 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus-visible:outline-none focus-visible:border-stone-600 dark:focus-visible:border-stone-400 focus-visible:ring-3 focus-visible:ring-stone-400/15"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9.5 px-3 text-xs"
            aria-label="Refresh collections"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="h-9.5 gap-1.5"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Collection</span>
          </Button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-8 text-center space-y-3">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
            Failed to load your collections.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && collections.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-white/60 dark:bg-[#141210]/60 p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-2xs">
            <Folder className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              No collections yet
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Collections are smart knowledge bases. Create your first collection to group documents
              and start conversational Q&amp;A.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsCreateOpen(true)} className="gap-1.5">
            <FolderPlus className="h-4 w-4" />
            <span>Create Your First Collection</span>
          </Button>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && !isError && collections.length > 0 && filteredCollections.length === 0 && (
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-[#141210]/60 p-8 text-center text-xs text-stone-500 dark:text-stone-400">
          No collections match &ldquo;{searchQuery}&rdquo;.
        </div>
      )}

      {/* Collections Grid */}
      {!isLoading && !isError && filteredCollections.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              onEdit={(c) => setEditingCollection(c)}
              onDelete={(c) => setDeletingCollection(c)}
              onSelect={onSelectCollection}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateCollectionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditCollectionModal
        collection={editingCollection}
        isOpen={Boolean(editingCollection)}
        onClose={() => setEditingCollection(null)}
      />

      <DeleteCollectionDialog
        collection={deletingCollection}
        isOpen={Boolean(deletingCollection)}
        onClose={() => setDeletingCollection(null)}
      />
    </div>
  );
}
