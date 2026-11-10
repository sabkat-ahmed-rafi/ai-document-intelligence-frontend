export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export type FileCategory = "pdf" | "word" | "image" | "text" | "spreadsheet" | "default";

export function getFileCategory(mimeType?: string, filename?: string): FileCategory {
  const mime = mimeType?.toLowerCase() || "";
  const ext = filename?.split(".").pop()?.toLowerCase() || "";

  if (mime.includes("pdf") || ext === "pdf") return "pdf";
  if (
    mime.includes("word") ||
    mime.includes("officedocument.wordprocessingml") ||
    ext === "docx" ||
    ext === "doc"
  )
    return "word";
  if (
    mime.includes("image") ||
    ["png", "jpg", "jpeg", "webp", "tiff", "bmp", "gif"].includes(ext)
  )
    return "image";
  if (
    mime.includes("text") ||
    mime.includes("markdown") ||
    ["txt", "md", "csv", "json"].includes(ext)
  )
    return "text";
  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    ["xlsx", "xls"].includes(ext)
  )
    return "spreadsheet";

  return "default";
}
