"use client";

import React, { useState, useEffect } from "react";
import { FileText, X, Download, RotateCw, Layers, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DocumentStatusBadge } from "./document-status-badge";
import { formatBytes } from "../utils/file-helpers";
import {
  useGetDocumentQuery,
  useGetDocumentSummaryQuery,
  useGenerateDocumentSummaryMutation,
  useProcessDocumentMutation,
} from "../api/documents-api";
import { DocumentSummaryTab } from "./detail/document-summary-tab";
import { DocumentPipelineTab } from "./detail/document-pipeline-tab";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentDetailModalProps {
  documentId: string;
  onClose: () => void;
}

export function DocumentDetailModal({ documentId, onClose }: DocumentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "metadata">("summary");

  // Fetch live document details
  const {
    data: docRes,
    isLoading: isDocLoading,
    refetch: refetchDoc,
  } = useGetDocumentQuery(documentId);

  const doc = docRes?.data;
  const isDocActive = doc?.status === "pending" || doc?.status === "processing";

  // Auto-poll ONLY if document is actively being processed or queued
  useEffect(() => {
    if (!isDocActive) return;

    const intervalId = setInterval(() => {
      refetchDoc();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isDocActive, refetchDoc]);

  // Summary query
  const { data: summaryRes, refetch: refetchSummary } = useGetDocumentSummaryQuery(documentId, {
    skip: !doc || doc.status !== "completed",
  });

  const [generateSummary, { isLoading: isGeneratingSummary }] =
    useGenerateDocumentSummaryMutation();
  const [reprocessDocument, { isLoading: isReprocessing }] = useProcessDocumentMutation();

  const handleGenerateSummary = async () => {
    try {
      await generateSummary(documentId).unwrap();
      toast.success("Summary generated successfully");
      refetchSummary();
    } catch {
      toast.error("Failed to generate summary. Please try again.");
    }
  };

  const handleReprocess = async () => {
    try {
      await reprocessDocument({ documentId }).unwrap();
      toast.success("Document re-queued for AI parsing and vector indexing");
      refetchDoc();
    } catch {
      toast.error("Failed to trigger re-processing");
    }
  };

  if (!doc && isDocLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
        <div className="rounded-2xl border border-stone-300 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#141210] p-8 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
          <span className="text-xs font-mono text-stone-600 dark:text-stone-300">
            Loading document details...
          </span>
        </div>
      </div>
    );
  }

  if (!doc) return null;

  const summaryData =
    summaryRes?.data ||
    (doc.doc_metadata?.summary
      ? {
          title: doc.title,
          summary: doc.doc_metadata.summary as string,
          entities: doc.doc_metadata.entities,
        }
      : null);

  const formattedDate = new Date(doc.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-stone-300/90 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#141210] p-6 shadow-2xl space-y-6 transition-all duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 truncate">
                  {doc.title || doc.original_filename}
                </h2>
                <DocumentStatusBadge status={doc.status} errorMessage={doc.error_message} />
              </div>
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400 truncate mt-0.5">
                {doc.original_filename} • {formatBytes(doc.file_size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800/80 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5",
              activeTab === "summary"
                ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-2xs"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Summary & Entities</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("metadata")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5",
              activeTab === "metadata"
                ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-2xs"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800"
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Telemetry & Pipeline</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {activeTab === "summary" ? (
            <DocumentSummaryTab
              doc={doc}
              summaryData={summaryData}
              isGeneratingSummary={isGeneratingSummary}
              isReprocessing={isReprocessing}
              onGenerateSummary={handleGenerateSummary}
              onReprocess={handleReprocess}
            />
          ) : (
            <DocumentPipelineTab doc={doc} formattedDate={formattedDate} />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReprocess}
            disabled={isReprocessing || doc.status === "processing"}
            className="gap-1.5 text-xs text-stone-600 dark:text-stone-300"
          >
            <RotateCw className={cn("h-3.5 w-3.5", isReprocessing && "animate-spin")} />
            <span>Re-Index</span>
          </Button>

          <div className="flex items-center gap-2">
            {doc.download_url && (
              <a
                href={doc.download_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            )}
            <Button size="sm" onClick={onClose} className="text-xs">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
