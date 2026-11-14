"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  X,
  Download,
  RotateCw,
  Calendar,
  Layers,
  Sparkles,
  Tag,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DocumentStatusBadge } from "./document-status-badge";
import { formatBytes } from "../utils/file-helpers";
import {
  useGetDocumentQuery,
  useGetDocumentSummaryQuery,
  useGenerateDocumentSummaryMutation,
  useProcessDocumentMutation,
} from "../api/documents-api";
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
  const {
    data: summaryRes,
    refetch: refetchSummary,
  } = useGetDocumentSummaryQuery(documentId, {
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

  // Normalize summary payload whether it comes from the API endpoint or document metadata
  const rawSummarySource = (summaryRes?.data?.summary ?? doc.doc_metadata?.summary) as any;
  const executiveSummaryText: string | null =
    typeof rawSummarySource === "string"
      ? rawSummarySource
      : rawSummarySource?.executive_summary || null;

  const entitiesSource =
    rawSummarySource?.entities || doc.doc_metadata?.entities || (summaryRes?.data as any)?.entities;

  const summaryData = executiveSummaryText
    ? {
        title: doc.title,
        summary: executiveSummaryText,
        entities: entitiesSource,
      }
    : null;

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
            <div className="space-y-4">
              {doc.status === "completed" ? (
                summaryData?.summary ? (
                  <div className="space-y-4">
                    {/* Executive Summary Card */}
                    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 p-4 shadow-2xs space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-mono text-amber-700 dark:text-amber-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Executive Summary</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                        {summaryData.summary}
                      </p>
                    </div>

                    {/* Extracted Structured Entities */}
                    {summaryData.entities && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
                          Extracted Structured Catalog
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {summaryData.entities.parties && summaryData.entities.parties.length > 0 && (
                            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-3 space-y-1.5">
                              <span className="flex items-center gap-1.5 font-mono text-stone-500 dark:text-stone-400">
                                <Users className="h-3.5 w-3.5 text-blue-500" /> Parties Involved
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {summaryData.entities.parties.map((p, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-[11px]"
                                  >
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {summaryData.entities.key_dates && summaryData.entities.key_dates.length > 0 && (
                            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-3 space-y-1.5">
                              <span className="flex items-center gap-1.5 font-mono text-stone-500 dark:text-stone-400">
                                <Calendar className="h-3.5 w-3.5 text-amber-500" /> Key Dates
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {summaryData.entities.key_dates.map((d, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-[11px]"
                                  >
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {summaryData.entities.financial_values && summaryData.entities.financial_values.length > 0 && (
                            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-3 space-y-1.5">
                              <span className="flex items-center gap-1.5 font-mono text-stone-500 dark:text-stone-400">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Financial Values
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {summaryData.entities.financial_values.map((v, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 font-mono text-[11px]"
                                  >
                                    {v}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {summaryData.entities.topics && summaryData.entities.topics.length > 0 && (
                            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-3 space-y-1.5">
                              <span className="flex items-center gap-1.5 font-mono text-stone-500 dark:text-stone-400">
                                <Tag className="h-3.5 w-3.5 text-violet-500" /> Topics & Domain
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {summaryData.entities.topics.map((t, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-[11px]"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 space-y-3">
                    <Sparkles className="h-7 w-7 text-stone-400" />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        Executive Summary Not Generated Yet
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
                        Extract key clauses, entities, parties, and synthesized executive takeaways from parsed chunks.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className="gap-2 text-xs"
                    >
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Generate Summary</span>
                        </>
                      )}
                    </Button>
                  </div>
                )
              ) : doc.status === "failed" ? (
                <div className="p-6 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-center space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                      Document Processing Failed
                    </h4>
                    <p className="text-xs text-rose-700 dark:text-rose-400 max-w-md mx-auto leading-relaxed font-mono">
                      {doc.error_message || "The background AI worker encountered an error while parsing the layout or generating embeddings."}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      onClick={handleReprocess}
                      disabled={isReprocessing}
                      className="gap-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white"
                    >
                      <RotateCw className={cn("h-3.5 w-3.5", isReprocessing && "animate-spin")} />
                      <span>Retry Processing</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-center space-y-2">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400 mx-auto" />
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {doc.status === "pending" ? "Queued in Background" : "Analyzing Layout & Vectors"}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
                    Layout parsing and vector indexing are running in the background. AI summary and citations will be available as soon as processing completes.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Telemetry & Pipeline Tab */
            <div className="space-y-4 text-xs">
              {/* Pipeline Stages */}
              <div className="space-y-2">
                <span className="font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
                  Ingestion & Parsing Pipeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col gap-1">
                    <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Step 1
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Storage Ingest</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">Uploaded</span>
                  </div>

                  <div
                    className={cn(
                      "p-2.5 rounded-xl border flex flex-col gap-1",
                      doc.status === "completed"
                        ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                        : doc.status === "failed"
                        ? "border-rose-200 dark:border-rose-800/60 bg-rose-50/40 dark:bg-rose-950/20"
                        : doc.status === "processing"
                        ? "border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20"
                        : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center gap-1 font-mono text-[10px]",
                        doc.status === "failed"
                          ? "text-rose-600 dark:text-rose-400"
                          : doc.status === "completed"
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-amber-700 dark:text-amber-400"
                      )}
                    >
                      {doc.status === "completed" ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      ) : doc.status === "failed" ? (
                        <AlertCircle className="h-3 w-3 text-rose-600" />
                      ) : (
                        <Clock className="h-3 w-3 text-amber-600" />
                      )}{" "}
                      Step 2
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Docling Parser</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">
                      {doc.status === "failed" ? "Failed" : "Layout & Tables"}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "p-2.5 rounded-xl border flex flex-col gap-1",
                      doc.status === "completed"
                        ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                        : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30"
                    )}
                  >
                    <span className="flex items-center gap-1 font-mono text-[10px] text-stone-500">
                      Step 3
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Hybrid Chunker</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">Tokens & Overlap</span>
                  </div>

                  <div
                    className={cn(
                      "p-2.5 rounded-xl border flex flex-col gap-1",
                      doc.status === "completed"
                        ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                        : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30"
                    )}
                  >
                    <span className="flex items-center gap-1 font-mono text-[10px] text-stone-500">
                      Step 4
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Vector Index</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">pgvector + BM25</span>
                  </div>
                </div>
              </div>

              {/* Document Specs */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/70 p-4 space-y-2">
                <span className="font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold block mb-2">
                  File Specifications
                </span>
                <dl className="grid grid-cols-2 gap-y-2 text-xs">
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">MIME Type</dt>
                    <dd className="font-mono text-stone-900 dark:text-stone-100">{doc.mime_type}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">File Size</dt>
                    <dd className="font-mono text-stone-900 dark:text-stone-100">{formatBytes(doc.file_size)}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">Pages</dt>
                    <dd className="font-mono text-stone-900 dark:text-stone-100">
                      {doc.doc_metadata?.page_count ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">Indexed Chunks</dt>
                    <dd className="font-mono text-stone-900 dark:text-stone-100">
                      {doc.doc_metadata?.chunk_count ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">Uploaded At</dt>
                    <dd className="font-mono text-stone-900 dark:text-stone-100">{formattedDate}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500 dark:text-stone-400">Document UUID</dt>
                    <dd className="font-mono text-stone-900 dark:text-stone-100 truncate max-w-[180px]">
                      {doc.id}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
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
