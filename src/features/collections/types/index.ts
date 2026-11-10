export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  document_count: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionsResponseData {
  collections: Collection[];
  total: number;
}

export interface CreateCollectionPayload {
  name: string;
  description?: string;
}

export interface UpdateCollectionPayload {
  name?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
