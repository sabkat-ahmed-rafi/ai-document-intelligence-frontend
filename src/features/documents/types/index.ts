export type DocumentStatus = "pending" | "processing" | "completed" | "failed";

export interface DocumentDetail {
  id: string;
  user_id: string;
  collection_id: string | null;
  file_id: string;
  title: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  status: DocumentStatus;
  error_message?: string | null;
  doc_metadata?: {
    page_count?: number;
    chunk_count?: number;
    token_count?: number;
    tables_count?: number;
    summary?: string;
    entities?: {
      classification?: string;
      parties?: string[];
      key_dates?: string[];
      financial_values?: string[];
      topics?: string[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  } | null;
  download_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentUploadItem {
  document_id: string;
  collection_id?: string | null;
  status: string;
  filename: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

export interface FailedDocumentUpload {
  filename: string;
  error: string;
}

export interface DocumentBatchUploadResponse {
  collection_id?: string | null;
  uploaded: DocumentUploadItem[];
  failed: FailedDocumentUpload[];
  total_uploaded: number;
  total_failed: number;
  document_id?: string | null;
}

export interface DocumentListResponse {
  documents: DocumentDetail[];
  total: number;
}

export interface DocumentSummaryResponse {
  document_id: string;
  title: string;
  summary: string;
  entities?: {
    classification?: string;
    parties?: string[];
    key_dates?: string[];
    financial_values?: string[];
    topics?: string[];
    [key: string]: unknown;
  };
}

export interface ListDocumentsParams {
  collection_id?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error_code?: string;
}
