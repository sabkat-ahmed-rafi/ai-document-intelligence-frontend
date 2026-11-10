import { apiSlice } from "@/store/services/api-slice";
import {
  ApiResponse,
  DocumentBatchUploadResponse,
  DocumentDetail,
  DocumentListResponse,
  DocumentSummaryResponse,
  ListDocumentsParams,
} from "../types";

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Upload Documents (tolerant batch or single)
    uploadDocuments: builder.mutation<ApiResponse<DocumentBatchUploadResponse>, FormData>({
      query: (formData) => ({
        url: "/documents/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Documents", id: "LIST" },
        { type: "Collections", id: "LIST" },
      ],
    }),

    // 2. List Documents (optionally filtered by collection)
    listDocuments: builder.query<ApiResponse<DocumentListResponse>, ListDocumentsParams | void>({
      query: (params) => {
        const queryParts: string[] = [];
        if (params?.collection_id) {
          queryParts.push(`collection_id=${encodeURIComponent(params.collection_id)}`);
        }
        queryParts.push(`limit=${params?.limit ?? 50}`);
        queryParts.push(`offset=${params?.offset ?? 0}`);
        return `/documents?${queryParts.join("&")}`;
      },
      providesTags: (result) =>
        result?.data?.documents
          ? [
              ...result.data.documents.map(({ id }) => ({
                type: "Documents" as const,
                id,
              })),
              { type: "Documents", id: "LIST" },
            ]
          : [{ type: "Documents", id: "LIST" }],
    }),

    // 3. Get Document Details & Status
    getDocument: builder.query<ApiResponse<DocumentDetail>, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Documents", id }],
    }),

    // 4. Trigger / Re-process Document
    processDocument: builder.mutation<
      ApiResponse<unknown>,
      { documentId: string; runInBackground?: boolean }
    >({
      query: ({ documentId, runInBackground = true }) => ({
        url: `/documents/${documentId}/process?run_in_background=${runInBackground}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { documentId }) => [
        { type: "Documents", id: documentId },
        { type: "Documents", id: "LIST" },
      ],
    }),

    // 5. Get Document Summary & Extracted Entities
    getDocumentSummary: builder.query<ApiResponse<DocumentSummaryResponse>, string>({
      query: (documentId) => `/documents/${documentId}/summary`,
      providesTags: (_result, _error, documentId) => [
        { type: "Documents", id: `SUMMARY_${documentId}` },
      ],
    }),

    // 6. Generate Summary On-Demand
    generateDocumentSummary: builder.mutation<ApiResponse<DocumentSummaryResponse>, string>({
      query: (documentId) => ({
        url: `/documents/${documentId}/summarize`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, documentId) => [
        { type: "Documents", id: documentId },
        { type: "Documents", id: `SUMMARY_${documentId}` },
      ],
    }),
  }),
});

export const {
  useUploadDocumentsMutation,
  useListDocumentsQuery,
  useGetDocumentQuery,
  useProcessDocumentMutation,
  useGetDocumentSummaryQuery,
  useGenerateDocumentSummaryMutation,
} = documentsApi;
