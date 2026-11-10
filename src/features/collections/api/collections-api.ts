import { apiSlice } from "@/store/services/api-slice";
import {
  Collection,
  CollectionsResponseData,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  ApiResponse,
} from "../types";

export const collectionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. List Collections
    listCollections: builder.query<
      ApiResponse<CollectionsResponseData>,
      { limit?: number; offset?: number } | void
    >({
      query: (params) => {
        const limit = params?.limit ?? 50;
        const offset = params?.offset ?? 0;
        return `/collections?limit=${limit}&offset=${offset}`;
      },
      providesTags: (result) =>
        result?.data?.collections
          ? [
              ...result.data.collections.map(({ id }) => ({
                type: "Collections" as const,
                id,
              })),
              { type: "Collections", id: "LIST" },
            ]
          : [{ type: "Collections", id: "LIST" }],
    }),

    // 2. Get Collection Details
    getCollection: builder.query<ApiResponse<Collection>, string>({
      query: (id) => `/collections/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Collections", id }],
    }),

    // 3. Create Collection
    createCollection: builder.mutation<ApiResponse<Collection>, CreateCollectionPayload>({
      query: (body) => ({
        url: "/collections",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Collections", id: "LIST" }],
    }),

    // 4. Update Collection
    updateCollection: builder.mutation<
      ApiResponse<Collection>,
      { id: string; payload: UpdateCollectionPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/collections/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Collections", id },
        { type: "Collections", id: "LIST" },
      ],
    }),

    // 5. Delete Collection (Cascade)
    deleteCollection: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Collections", id: "LIST" }],
    }),
  }),
});

export const {
  useListCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionsApi;
