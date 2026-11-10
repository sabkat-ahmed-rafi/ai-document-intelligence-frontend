"use client";

import React, { DragEvent, useState } from "react";
import { ArrowRight, UploadCloud, Folder, BarChart3, Scale, ShieldCheck, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatWelcomeCanvasProps {
  onSelectPrompt: (prompt: string) => void;
  activeCollectionName?: string;
  onOpenUpload: () => void;
  onFileDrop: (files: File[]) => void;
}

export function ChatWelcomeCanvas({
  onSelectPrompt,
  activeCollectionName,
  onOpenUpload,
  onFileDrop,
}: ChatWelcomeCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);

  const promptStarters = [
    {
      icon: <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      title: "Synthesize Executive Overview",
      prompt: "Synthesize an executive summary of key performance metrics, revenue growth, and risk factors from these documents.",
    },
    {
      icon: <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      title: "Extract Legal Clauses & Obligations",
      prompt: "Identify and extract all termination clauses, liability limits, and confidentiality obligations across the agreements.",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      title: "Audit & Compliance Findings",
      prompt: "What are the primary compliance disclosures, auditor opinions, and regulatory risks highlighted in the text?",
    },
    {
      icon: <FileSearch className="h-4 w-4 text-violet-600 dark:text-violet-400" />,
      title: "Cross-Document Comparison",
      prompt: "Compare key timelines, deliverables, and cost breakdowns stated across the uploaded documentation.",
    },
  ];

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
      onFileDrop(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-4 py-8 text-center space-y-8 transition-colors duration-200",
        isDragging && "bg-amber-500/5 rounded-3xl outline-2 outline-dashed outline-amber-500"
      )}
    >
      {/* Scope Badge & Hero Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-200/90 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 shadow-2xs text-xs font-mono text-stone-600 dark:text-stone-300">
          <Folder className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          <span>Knowledge Scope:</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {activeCollectionName || "All Documents"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          What would you like to explore?
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
          Ask questions across your documents. Responses are grounded with precise layout-aware page citations.
        </p>
      </div>

      {/* 4 Prompt Starters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {promptStarters.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group flex flex-col justify-between p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800/90 bg-white dark:bg-[#141210] hover:border-amber-400/80 dark:hover:border-amber-600/80 hover:shadow-md transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-stone-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                {item.title}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-snug">
                {item.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Ingest Dropzone Card */}
      <div
        onClick={onOpenUpload}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-white/50 dark:bg-stone-900/30 hover:border-amber-500/70 hover:bg-white dark:hover:bg-stone-900/70 transition-all duration-150 cursor-pointer text-xs"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <UploadCloud className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              Drop or upload a new document into this knowledge base
            </p>
            <p className="text-[10px] font-mono text-stone-500">
              PDF, DOCX, TXT, or images up to 50MB
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-[11px]">
          Upload File
        </span>
      </div>
    </div>
  );
}
