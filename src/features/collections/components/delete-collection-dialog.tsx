"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useDeleteCollectionMutation } from "../api/collections-api";
import { Collection } from "../types";
import { Button } from "@/components/ui/button";

interface DeleteCollectionDialogProps {
  collection: Collection | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteCollectionDialog({
  collection,
  isOpen,
  onClose,
  onSuccess,
}: DeleteCollectionDialogProps) {
  const [deleteCollection, { isLoading }] = useDeleteCollectionMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen || !collection) return null;

  const handleDelete = async () => {
    setServerError(null);
    try {
      await deleteCollection(collection.id).unwrap();
      toast.success(`Deleted collection "${collection.name}"`);
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message || "Failed to delete collection"
          : "Failed to delete collection. Please try again.";
      setServerError(msg);
    }
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-collection-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-md rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#161311] p-6 shadow-2xl transition-all duration-150 animate-in zoom-in-95 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h2
              id="delete-collection-title"
              className="text-base font-bold text-stone-900 dark:text-stone-100"
            >
              Delete Collection?
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-stone-900 dark:text-stone-100 font-semibold">
                &ldquo;{collection.name}&rdquo;
              </strong>
              ?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {collection.document_count > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Cascade Warning:</strong> This collection contains{" "}
            <strong>{collection.document_count} document(s)</strong>. Deleting this collection
            will permanently erase all associated documents, chunks, and vector embeddings.
          </div>
        )}

        {serverError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
            {serverError}
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isLoading}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
