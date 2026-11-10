"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  UploadCloud,
  File,
  Image as ImageIcon,
  Folder,
  Filter,
} from "lucide-react";
import { DocumentStatusBadge } from "./document-status-badge";
import { DocumentUploadModal } from "./document-upload-modal";
import { DocumentDetailModal } from "./document-detail-modal";
import { useListDocumentsQuery } from "../api/documents-api";
import { useListCollectionsQuery } from "@/features/collections/api/collections-api";
import { formatBytes, getFileCategory } from "../utils/file-helpers";
import { Button } from "@/components/ui/button";

interface DocumentListProps {
  initialCollectionId?: string;
  onOpenUpload?: () => void;
}

export function DocumentList({ initialCollectionId, onOpenUpload }: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    initialCollectionId || ""
  );
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Collections list for filtering
  const { data: collectionsRes } = useListCollectionsQuery();
  const collections = useMemo(
    () => collectionsRes?.data?.collections ?? [],
    [collectionsRes?.data?.collections]
  );

  // Query documents with auto-polling if any document is processing
  const {
    data: documentsRes,
    isLoading,
  } = useListDocumentsQuery(
    selectedCollectionId ? { collection_id: selectedCollectionId } : undefined,
    {
      pollingInterval: 3500, // Poll every 3.5s to keep status in sync when documents are processing
    }
  );

  const rawDocuments = useMemo(
    () => documentsRes?.data?.documents ?? [],
    [documentsRes?.data?.documents]
  );

  // Client-side search filtering
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return rawDocuments;
    const q = searchQuery.toLowerCase().trim();
    return rawDocuments.filter(
      (doc) =>
        doc.title?.toLowerCase().includes(q) ||
        doc.original_filename?.toLowerCase().includes(q) ||
        doc.doc_metadata?.summary?.toLowerCase().includes(q)
    );
  }, [rawDocuments, searchQuery]);

  const getFileIcon = (mimeType?: string, filename?: string) => {
    const category = getFileCategory(mimeType, filename);
    switch (category) {
      case "pdf":
        return <FileText className="h-5 w-5 text-rose-500" />;
      case "word":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "image":
        return <ImageIcon className="h-5 w-5 text-emerald-500" />;
      default:
        return <File className="h-5 w-5 text-amber-500" />;
    }
  };

  const collectionMap = useMemo(() => {
    const map = new Map<string, string>();
    collections.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [collections]);

  const handleOpenUpload = () => {
    if (onOpenUpload) {
      onOpenUpload();
    } else {
      setIsUploadOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search documents by title or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-[#141210] pl-10 pr-4 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors shadow-2xs"
          />
        </div>

        {/* Filter by Collection & Upload Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className="appearance-none rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-[#141210] pl-3 pr-8 py-2 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-2xs cursor-pointer"
            >
              <option value="">All Collections ({rawDocuments.length})</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>

          <Button
            size="sm"
            onClick={handleOpenUpload}
            className="gap-1.5 text-xs shadow-xs"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-[#141210]/60 p-4 animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-stone-200 dark:bg-stone-800" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-2/3 bg-stone-200 dark:bg-stone-800 rounded-md" />
                  <div className="h-2.5 w-1/3 bg-stone-100 dark:bg-stone-800/60 rounded-md" />
                </div>
              </div>
              <div className="h-4 w-1/4 bg-stone-100 dark:bg-stone-800 rounded-md" />
            </div>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-white/40 dark:bg-[#141210]/40 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {searchQuery ? "No matching documents found" : "No documents indexed yet"}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
              {searchQuery
                ? `No documents matched "${searchQuery}". Clear your search query to see all indexed documents.`
                : "Upload PDF research reports, contracts, or text files to start conversational semantic search with precise page citations."}
            </p>
          </div>
          {!searchQuery && (
            <Button
              size="sm"
              onClick={handleOpenUpload}
              className="gap-1.5 text-xs shadow-xs"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Document</span>
            </Button>
          )}
        </div>
      ) : (
        /* Document Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredDocuments.map((doc) => {
            const collectionName = doc.collection_id
              ? collectionMap.get(doc.collection_id)
              : null;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className="group relative flex flex-col justify-between rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-4 shadow-xs transition-all duration-150 ease-out hover:border-stone-400 dark:hover:border-stone-700 hover:shadow-md cursor-pointer active:scale-[0.99]"
              >
                <div>
                  {/* Top Header: File Icon + Status Badge */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-150">
                      {getFileIcon(doc.mime_type, doc.original_filename)}
                    </div>
                    <DocumentStatusBadge
                      status={doc.status}
                      errorMessage={doc.error_message}
                    />
                  </div>

                  {/* Title & Collection */}
                  <div className="mt-3 space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {doc.title || doc.original_filename}
                    </h3>
                    <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                      {doc.original_filename}
                    </p>
                  </div>
                </div>

                {/* Bottom Metadata: Size, Pages/Chunks, Collection Pill */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span>{formatBytes(doc.file_size)}</span>
                    {doc.doc_metadata?.chunk_count && (
                      <span className="flex items-center gap-0.5 text-stone-400 dark:text-stone-500">
                        • {doc.doc_metadata.chunk_count} chunks
                      </span>
                    )}
                  </div>

                  {collectionName ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[10px] truncate max-w-[110px]">
                      <Folder className="h-2.5 w-2.5" />
                      {collectionName}
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400">Standalone</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultCollectionId={selectedCollectionId}
      />

      {/* Document Detail Inspector Modal */}
      {selectedDocId && (
        <DocumentDetailModal
          documentId={selectedDocId}
          onClose={() => setSelectedDocId(null)}
        />
      )}
    </div>
  );
}
