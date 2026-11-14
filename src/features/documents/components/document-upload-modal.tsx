"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, X, Folder, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUploadDocumentsMutation } from "../api/documents-api";
import { useListCollectionsQuery } from "@/features/collections/api/collections-api";
import { UploadFileDropzone } from "./upload/upload-file-dropzone";
import { UploadStagedFiles } from "./upload/upload-staged-files";
import { Button } from "@/components/ui/button";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCollectionId?: string;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  defaultCollectionId,
}: DocumentUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    defaultCollectionId || ""
  );
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: collectionsData } = useListCollectionsQuery();
  const collections = collectionsData?.data?.collections || [];

  const [uploadDocuments, { isLoading }] = useUploadDocumentsMutation();

  if (!isOpen) return null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const maxSizeBytes = 50 * 1024 * 1024; // 50MB limit

    for (const file of newFiles) {
      if (file.size > maxSizeBytes) {
        toast.error(`"${file.name}" exceeds the 50MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one document to upload.");
      return;
    }

    const formData = new FormData();

    if (files.length === 1) {
      formData.append("file", files[0]);
      formData.append("files", files[0]);
      if (customTitle.trim()) {
        formData.append("title", customTitle.trim());
      }
    } else {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    if (isCreatingCollection && newCollectionName.trim()) {
      formData.append("collection_name", newCollectionName.trim());
    } else if (selectedCollectionId) {
      formData.append("collection_id", selectedCollectionId);
    }

    try {
      const res = await uploadDocuments(formData).unwrap();

      if (res.data.total_failed > 0 && res.data.total_uploaded === 0) {
        const firstError = res.data.failed[0]?.error || "Upload failed";
        toast.error(`Upload failed: ${firstError}`);
        return;
      }

      if (res.data.total_failed > 0) {
        toast.warning(
          `${res.data.total_uploaded} documents queued. ${res.data.total_failed} failed: ${res.data.failed[0]?.error}`
        );
      } else {
        toast.success(
          `${res.data.total_uploaded} document${res.data.total_uploaded > 1 ? "s" : ""} queued for processing.`
        );
      }

      // Reset & Close
      setFiles([]);
      setCustomTitle("");
      setNewCollectionName("");
      setIsCreatingCollection(false);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error(errorObj?.data?.message || "Failed to upload document. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-stone-300/90 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#141210] p-6 shadow-2xl space-y-6 transition-all duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Upload Documents
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Parsed and indexed with layout-aware Docling & pgvector
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="space-y-5 overflow-y-auto pr-1 flex-1">
          {/* Target Collection Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 font-mono uppercase tracking-wider">
              Target Collection
            </label>
            {!isCreatingCollection ? (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    disabled={isLoading}
                    className="w-full appearance-none rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/90 px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                  >
                    <option value="">No Collection (Standalone Document)</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        📁 {c.name} ({c.document_count || 0} docs)
                      </option>
                    ))}
                  </select>
                  <Folder className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingCollection(true)}
                  className="gap-1 text-xs whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter new collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="flex-1 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/90 px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreatingCollection(false);
                    setNewCollectionName("");
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Optional Title for Single File */}
          {files.length === 1 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 font-mono uppercase tracking-wider">
                Document Title (Optional)
              </label>
              <input
                type="text"
                placeholder="Defaults to original file name"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/90 px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>
          )}

          {/* Drag & Drop Area */}
          <UploadFileDropzone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            fileInputRef={fileInputRef}
            onFileInputChange={handleFileInputChange}
          />

          {/* Staged File List */}
          <UploadStagedFiles files={files} onRemoveFile={removeFile} isLoading={isLoading} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Hybrid vector & keyword indexed</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              disabled={isLoading || files.length === 0}
              className="gap-2 text-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Upload {files.length > 0 ? `(${files.length})` : ""}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
