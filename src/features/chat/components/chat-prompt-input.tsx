"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ArrowUp, Paperclip, Square, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatPromptInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onStopGenerating?: () => void;
  activeCollectionName?: string;
  onOpenUpload: () => void;
  placeholder?: string;
}

export function ChatPromptInput({
  onSendMessage,
  isLoading,
  onStopGenerating,
  activeCollectionName,
  onOpenUpload,
  placeholder = "Ask anything across your documents...",
}: ChatPromptInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const hasText = input.trim().length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 sm:pb-6">
      <div className="relative rounded-2xl border border-stone-300/90 dark:border-stone-800 bg-white/95 dark:bg-[#141210]/95 backdrop-blur-md shadow-lg transition-all focus-within:border-stone-400 dark:focus-within:border-stone-700 focus-within:shadow-xl p-2.5 space-y-2">
        {/* Scope Pill */}
        <div className="flex items-center justify-between px-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-900 text-[11px] font-mono text-stone-600 dark:text-stone-400">
            <Folder className="h-3 w-3 text-amber-600" />
            <span className="truncate max-w-[200px]">
              {activeCollectionName || "All Documents"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
            <span className="hidden sm:inline">Hybrid Retrieval</span>
          </div>
        </div>

        {/* Input Textarea Area */}
        <div className="flex items-end gap-2 px-1">
          {/* Paperclip Button */}
          <button
            type="button"
            onClick={onOpenUpload}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            title="Attach / Ingest Document"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-0 leading-relaxed py-1.5 min-h-[36px] max-h-[160px]"
          />

          {/* Action Button: Send or Stop */}
          {isLoading ? (
            <button
              type="button"
              onClick={onStopGenerating}
              className="h-8 w-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 hover:bg-rose-500 transition-all active:scale-95 shadow-xs"
              title="Stop generating"
            >
              <Square className="h-3.5 w-3.5 fill-white" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasText}
              className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-xs cursor-pointer",
                hasText
                  ? "bg-amber-600 text-white hover:bg-amber-500 shadow-amber-600/20"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed"
              )}
              title="Send question (Enter)"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-[10px] font-mono text-stone-400 dark:text-stone-500 mt-2">
        DocIntel synthesizes answers from your parsed documents with page citations.
      </p>
    </div>
  );
}
