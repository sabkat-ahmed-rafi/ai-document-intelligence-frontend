"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateCollectionMutation } from "../api/collections-api";
import { collectionSchema, CollectionFormValues } from "../utils/collection-validation";
import { Collection } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditCollectionModalProps {
  collection: Collection | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditCollectionModal({
  collection,
  isOpen,
  onClose,
  onSuccess,
}: EditCollectionModalProps) {
  const [updateCollection, { isLoading }] = useUpdateCollectionMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: collection?.name || "",
      description: collection?.description || "",
    },
  });

  useEffect(() => {
    if (collection) {
      setValue("name", collection.name);
      setValue("description", collection.description || "");
    }
  }, [collection, setValue]);

  if (!isOpen || !collection) return null;

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (values: CollectionFormValues) => {
    setServerError(null);
    try {
      await updateCollection({
        id: collection.id,
        payload: {
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
        },
      }).unwrap();

      toast.success("Collection updated successfully");
      reset();
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message || "Failed to update collection"
          : "Failed to update collection. Please try again.";
      setServerError(msg);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-collection-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#161311] p-6 shadow-2xl transition-all duration-150 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center">
              <Edit3 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2
                id="edit-collection-title"
                className="text-base font-bold text-stone-900 dark:text-stone-100"
              >
                Edit Collection
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Update collection name or description.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {serverError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <Input
            label="Collection Name"
            placeholder="e.g. Financial Audits 2026"
            error={errors.name?.message}
            {...register("name")}
            autoFocus
          />

          <div className="w-full space-y-1.5 text-left">
            <label
              htmlFor="edit-collection-description"
              className="block text-xs font-medium tracking-wide text-stone-700 dark:text-stone-300"
            >
              Description (Optional)
            </label>
            <textarea
              id="edit-collection-description"
              rows={3}
              placeholder="e.g. Annual balance sheets, SEC 10-K filings, and auditor opinions."
              className="flex w-full rounded-xl border border-stone-300 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus-visible:outline-none focus-visible:border-stone-600 dark:focus-visible:border-stone-400 focus-visible:ring-3 focus-visible:ring-stone-400/15 dark:focus-visible:ring-stone-500/15 transition-all duration-150 resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 dark:text-rose-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-stone-200 dark:border-stone-800">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
