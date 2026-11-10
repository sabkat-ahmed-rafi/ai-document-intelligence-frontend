"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { ChatMessage, CitationSource } from "../types";
import { cn } from "@/lib/utils";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onSelectCitation?: (citation: CitationSource) => void;
  userInitial?: string;
}

export function ChatMessageBubble({
  message,
  onSelectCitation,
  userInitial = "U",
}: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find citation by source number
  const getCitation = (sourceNum: number): CitationSource | undefined => {
    return message.citations?.find((c) => c.source_number === sourceNum);
  };

  // Parse inline [Source N] or [N] tags to make them interactive clickable pills
  const renderFormattedContent = (content: string) => {
    // Regex matching [Source 1], [Source 2], [1], [2], etc.
    const citationRegex = /\[(Source\s*)?(\d+)\]/gi;
    const parts = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = citationRegex.exec(content)) !== null) {
      const matchStart = match.index;
      const matchEnd = citationRegex.lastIndex;

      if (matchStart > lastIndex) {
        parts.push(content.substring(lastIndex, matchStart));
      }

      const sourceNum = parseInt(match[2], 10);
      const citation = getCitation(sourceNum);

      parts.push(
        <button
          key={`cite-${matchStart}`}
          type="button"
          onClick={() => {
            if (citation && onSelectCitation) {
              onSelectCitation(citation);
            }
          }}
          className={cn(
            "inline-flex items-center gap-0.5 px-1.5 py-0.2 mx-0.5 rounded text-[10px] font-mono font-bold align-baseline transition-all cursor-pointer",
            citation
              ? "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/80 hover:bg-amber-200 dark:hover:bg-amber-900 active:scale-95 shadow-2xs"
              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
          )}
          title={citation ? `View Source: ${citation.document_title}` : "Citation"}
        >
          <span>[{sourceNum}]</span>
        </button>
      );

      lastIndex = matchEnd;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 max-w-3xl w-full mx-auto my-3 px-4">
        <div className="max-w-xl rounded-2xl rounded-tr-xs bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 px-4 py-3 text-xs sm:text-sm font-medium leading-relaxed shadow-xs">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="h-7 w-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
          {userInitial}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 max-w-3xl w-full mx-auto my-4 px-4">
      {/* DocIntel Assistant Avatar */}
      <div className="h-7 w-7 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
        <Sparkles className="h-3.5 w-3.5" />
      </div>

      <div className="flex-1 space-y-3 min-w-0">
        {/* Main Answer Card */}
        <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#141210] p-4 sm:p-5 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed shadow-xs space-y-3">
          <div className="whitespace-pre-wrap space-y-2">
            {renderFormattedContent(message.content)}
          </div>

          {/* Citations Pill Bar */}
          {message.citations && message.citations.length > 0 && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                Source Citations ({message.citations.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.citations.map((cite) => (
                  <button
                    key={cite.source_number}
                    type="button"
                    onClick={() => onSelectCitation?.(cite)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-900/90 hover:border-amber-400 dark:hover:border-amber-600 text-[11px] text-stone-700 dark:text-stone-300 font-mono transition-colors shadow-2xs active:scale-[0.98] cursor-pointer"
                  >
                    <span className="h-4 w-4 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      {cite.source_number}
                    </span>
                    <span className="truncate max-w-[140px] font-sans font-medium">
                      {cite.document_title}
                    </span>
                    {cite.page_number && (
                      <span className="text-stone-400 text-[10px]">p.{cite.page_number}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta: Telemetry & Copy Action */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-stone-400">
          <div className="flex items-center gap-2">
            {message.execution_time_ms && (
              <span className="inline-flex items-center gap-1">
                <span>⚡ {Math.round(message.execution_time_ms)}ms</span>
                <span>•</span>
                <span>Hybrid RRF</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
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
      </div>
    </div>
  );
}
