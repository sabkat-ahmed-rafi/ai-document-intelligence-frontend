"use client";

import React from "react";
import {
  Sparkles,
  Users,
  Calendar,
  DollarSign,
  Tag,
  Loader2,
  AlertCircle,
  RotateCw,
  Clock,
} from "lucide-react";
import { DocumentDetail } from "../../types";
import { Button } from "@/components/ui/button";

interface SummaryData {
  title?: string;
  summary?: string;
  entities?: {
    parties?: string[];
    key_dates?: string[];
    financial_values?: string[];
    topics?: string[];
    [key: string]: unknown;
  };
}

interface DocumentSummaryTabProps {
  doc: DocumentDetail;
  summaryData: SummaryData | null;
  isGeneratingSummary: boolean;
  isReprocessing: boolean;
  onGenerateSummary: () => void;
  onReprocess: () => void;
}

export function DocumentSummaryTab({
  doc,
  summaryData,
  isGeneratingSummary,
  isReprocessing,
  onGenerateSummary,
  onReprocess,
}: DocumentSummaryTabProps) {
  if (doc.status === "failed") {
    return (
      <div className="p-6 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-center space-y-3">
        <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
            Document Processing Failed
          </h4>
          <p className="text-xs text-rose-700 dark:text-rose-400 max-w-md mx-auto leading-relaxed font-mono">
            {doc.error_message ||
              "The background AI worker encountered an error while parsing the layout or generating embeddings."}
          </p>
        </div>
        <div className="pt-2">
          <Button
            size="sm"
            onClick={onReprocess}
            disabled={isReprocessing}
            className="gap-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isReprocessing ? "animate-spin" : ""}`} />
            <span>Retry Processing</span>
          </Button>
        </div>
      </div>
    );
  }

  if (doc.status === "pending" || doc.status === "processing") {
    return (
      <div className="p-6 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-center space-y-2">
        <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400 mx-auto" />
        <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
          {doc.status === "pending" ? "Queued in Background" : "Analyzing Layout & Vectors"}
        </h4>
        <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
          Layout parsing and vector indexing are running in the background. AI summary and citations will be available as soon as processing completes.
        </p>
      </div>
    );
  }

  if (summaryData?.summary) {
    return (
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
    );
  }

  // Not yet generated
  return (
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
        onClick={onGenerateSummary}
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
  );
}
