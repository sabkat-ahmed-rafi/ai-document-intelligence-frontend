"use client";

import React from "react";
import { X, FileText, File, Image as ImageIcon } from "lucide-react";
import { formatBytes, getFileCategory } from "../../utils/file-helpers";

interface UploadStagedFilesProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  isLoading: boolean;
}

export function UploadStagedFiles({ files, onRemoveFile, isLoading }: UploadStagedFilesProps) {
  if (files.length === 0) return null;

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

  const getFileIcon = (file: File) => {
    const category = getFileCategory(file.type, file.name);
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono font-medium text-stone-500 dark:text-stone-400">
        <span>Selected Files ({files.length})</span>
        <span>Total: {formatBytes(totalBytes)}</span>
      </div>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {files.map((file, idx) => (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              {getFileIcon(file)}
              <div className="min-w-0">
                <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFile(idx);
              }}
              disabled={isLoading}
              className="p-1 rounded-md text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
