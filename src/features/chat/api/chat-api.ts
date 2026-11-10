import { apiSlice } from "@/store/services/api-slice";
import {
  ApiResponse,
  CreateThreadPayload,
  SendThreadChatPayload,
  Thread,
  ThreadChatResponse,
  ThreadDetail,
  ThreadListResponse,
  UpdateThreadPayload,
} from "../types";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. List user conversation threads
    listThreads: builder.query<ApiResponse<ThreadListResponse>, { limit?: number; offset?: number } | void>({
      query: (params) => {
        const limit = params?.limit ?? 30;
        const offset = params?.offset ?? 0;
        return `/threads?limit=${limit}&offset=${offset}`;
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Threads" as const,
                id,
              })),
              { type: "Threads", id: "LIST" },
            ]
          : [{ type: "Threads", id: "LIST" }],
    }),

    // 2. Get thread details with historical messages
    getThread: builder.query<ApiResponse<ThreadDetail>, string>({
      query: (threadId) => `/threads/${threadId}`,
      providesTags: (_result, _error, threadId) => [{ type: "Threads", id: threadId }],
    }),

    // 3. Create a new thread
    createThread: builder.mutation<ApiResponse<Thread>, CreateThreadPayload | void>({
      query: (payload) => ({
        url: "/threads",
        method: "POST",
        body: payload || { title: "New Conversation" },
      }),
      invalidatesTags: [{ type: "Threads", id: "LIST" }],
    }),

    // 4. Update thread title
    updateThread: builder.mutation<ApiResponse<Thread>, { threadId: string; payload: UpdateThreadPayload }>({
      query: ({ threadId, payload }) => ({
        url: `/threads/${threadId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { threadId }) => [
        { type: "Threads", id: threadId },
        { type: "Threads", id: "LIST" },
      ],
    }),

    // 5. Delete thread
    deleteThread: builder.mutation<ApiResponse<null>, string>({
      query: (threadId) => ({
        url: `/threads/${threadId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Threads", id: "LIST" }],
    }),

    // 6. Send message in thread (batch mode)
    sendChatMessageBatch: builder.mutation<
      ApiResponse<ThreadChatResponse>,
      { threadId: string; payload: SendThreadChatPayload }
    >({
      query: ({ threadId, payload }) => ({
        url: `/threads/${threadId}/chat`,
        method: "POST",
        body: { ...payload, stream: false },
      }),
      invalidatesTags: (_result, _error, { threadId }) => [{ type: "Threads", id: threadId }],
    }),
  }),
});

export const {
  useListThreadsQuery,
  useGetThreadQuery,
  useCreateThreadMutation,
  useUpdateThreadMutation,
  useDeleteThreadMutation,
  useSendChatMessageBatchMutation,
} = chatApi;
