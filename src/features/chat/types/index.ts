export interface CitationSource {
  source_number: number;
  document_id: string;
  document_title: string;
  chunk_id: string;
  chunk_index: number;
  page_number?: number | string | null;
  snippet: string;
  similarity: number;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: CitationSource[] | null;
  model?: string | null;
  provider?: string | null;
  execution_time_ms?: number | null;
  created_at: string;
}

export interface Thread {
  id: string;
  user_id: string;
  title: string;
  collection_id?: string | null;
  document_id?: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ThreadDetail extends Thread {
  messages: ChatMessage[];
}

export interface ThreadListResponse {
  items: Thread[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateThreadPayload {
  title?: string;
  collection_id?: string | null;
  document_id?: string | null;
}

export interface UpdateThreadPayload {
  title: string;
}

export interface SendThreadChatPayload {
  message: string;
  stream?: boolean;
  search_mode?: "hybrid" | "vector" | "keyword";
  top_k?: number;
  similarity_threshold?: number;
}

export interface ThreadChatResponse {
  user_message: ChatMessage;
  assistant_message: ChatMessage;
  standalone_query?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error_code?: string;
}
