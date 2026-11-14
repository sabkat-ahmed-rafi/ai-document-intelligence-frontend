"use client";

import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { DocumentDetail } from "../../types";
import { formatBytes } from "../../utils/file-helpers";
import { cn } from "@/lib/utils";

interface DocumentPipelineTabProps {
  doc: DocumentDetail;
  formattedDate: string;
}

export function DocumentPipelineTab({ doc, formattedDate }: DocumentPipelineTabProps) {
  return (
    <div className="space-y-4 text-xs">
      {/* Pipeline Stages */}
      <div className="space-y-2">
        <span className="font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
          Ingestion & Parsing Pipeline
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Step 1: Ingest */}
          <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col gap-1">
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Step 1
            </span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">Storage Ingest</span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">Uploaded</span>
          </div>

          {/* Step 2: Parser */}
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

          {/* Step 3: Chunker */}
          <div
            className={cn(
              "p-2.5 rounded-xl border flex flex-col gap-1",
              doc.status === "completed"
                ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30"
            )}
          >
            <span className="flex items-center gap-1 font-mono text-[10px] text-stone-500">
              {doc.status === "completed" ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              ) : (
                <Clock className="h-3 w-3 text-stone-400" />
              )}{" "}
              Step 3
            </span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">Hybrid Chunker</span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">Tokens & Overlap</span>
          </div>

          {/* Step 4: Indexing */}
          <div
            className={cn(
              "p-2.5 rounded-xl border flex flex-col gap-1",
              doc.status === "completed"
                ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30"
            )}
          >
            <span className="flex items-center gap-1 font-mono text-[10px] text-stone-500">
              {doc.status === "completed" ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              ) : (
                <Clock className="h-3 w-3 text-stone-400" />
              )}{" "}
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
  );
}
