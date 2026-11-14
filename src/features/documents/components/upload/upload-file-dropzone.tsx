"use client";

import React, { DragEvent, ChangeEvent, RefObject } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadFileDropzoneProps {
  isDragging: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function UploadFileDropzone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  fileInputRef,
  onFileInputChange,
}: UploadFileDropzoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-150 cursor-pointer text-center",
        isDragging
          ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 scale-[0.99]"
          : "border-stone-300 dark:border-stone-800 bg-white/70 dark:bg-stone-900/40 hover:border-amber-400 dark:hover:border-stone-700 hover:bg-white dark:hover:bg-stone-900/70"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp,.tiff,.bmp"
        onChange={onFileInputChange}
        className="hidden"
      />
      <div className="h-12 w-12 rounded-2xl bg-amber-100/70 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-150">
        <UploadCloud className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
        Drag & drop files here, or{" "}
        <span className="text-amber-600 dark:text-amber-500 underline underline-offset-2">
          browse
        </span>
      </p>
      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
        Supports PDF, DOCX, TXT, MD, Images (up to 50MB per file)
      </p>
    </div>
  );
}
