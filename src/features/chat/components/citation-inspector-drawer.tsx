"use client";

import React, { useState } from "react";
import { X, FileText, Bookmark, Copy, Check, ExternalLink } from "lucide-react";
import { CitationSource } from "../types";
import { Button } from "@/components/ui/button";

interface CitationInspectorDrawerProps {
  citation: CitationSource | null;
  onClose: () => void;
  onOpenDocument?: (documentId: string) => void;
}

export function CitationInspectorDrawer({
  citation,
  onClose,
  onOpenDocument,
}: CitationInspectorDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!citation) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(citation.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const matchPercent = Math.min(100, Math.round((citation.similarity || 0) * 100));

  return (
    <aside className="w-80 sm:w-96 shrink-0 h-full border-l border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/95 dark:bg-[#12100E]/95 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-200 z-20">
      <div className="space-y-5 overflow-y-auto pr-1">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold">
              Source [{citation.source_number}]
            </span>
            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
              Grounded Citation
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Document Info Card */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 p-3.5 space-y-2.5 text-xs shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                {citation.document_title}
              </h4>
              <p className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                ID: {citation.document_id}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px] font-mono">
            <span className="text-stone-500">
              {citation.page_number ? `Page ${citation.page_number}` : `Chunk #${citation.chunk_index + 1}`}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">
              {matchPercent}% Match
            </span>
          </div>
        </div>

        {/* Verbatim Source Excerpt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-medium text-stone-500">
            <span className="flex items-center gap-1.5">
              <Bookmark className="h-3 w-3 text-amber-600" />
              <span>Cited Source Excerpt</span>
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] hover:text-stone-800 dark:hover:text-stone-200"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15 text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-sans whitespace-pre-wrap shadow-2xs">
            {citation.snippet}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800/80">
        {onOpenDocument && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDocument(citation.document_id)}
            className="w-full gap-2 text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Document Inspector</span>
          </Button>
        )}
      </div>
    </aside>
  );
}
