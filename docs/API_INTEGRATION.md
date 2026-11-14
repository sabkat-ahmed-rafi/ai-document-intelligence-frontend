# API Integration & Protocol Specifications

This document catalogs all backend APIs integrated into the frontend, their request/response schemas, and real-time streaming protocols.

---

## 1. Authentication & Session (`src/features/auth`)

| Endpoint | Method | Request Payload | Response / Actions |
|---|---|---|---|
| `/auth/register` | `POST` | `{ email, password, first_name?, last_name? }` | `ApiResponse<User>` |
| `/auth/login` | `POST` | `{ email, password }` | Sets HTTP-only cookies (`access_token`, `refresh_token`), returns user profile |
| `/auth/me` | `GET` | *None (Cookie)* | `ApiResponse<User>` (current user profile & role) |
| `/auth/refresh-token` | `POST` | *None (Refresh Cookie)* | Rotates HTTP-only tokens |
| `/auth/change-password` | `POST` | `{ current_password, new_password }` | `ApiResponse<null>` |
| `/auth/forgot-password` | `POST` | `{ email }` | `ApiResponse<null>` (dispatches reset token) |
| `/auth/reset-password` | `POST` | `{ token, new_password }` | `ApiResponse<null>` |
| `/auth/logout` | `POST` | *None (Cookie)* | Clears HTTP-only cookies, invalidates session |

### Silent Re-Authentication Mutex
All unauthenticated requests triggering `HTTP 401` are intercepted in `src/store/services/api-slice.ts`. Using `async-mutex`, a single lock executes `POST /auth/refresh-token`. When rotation succeeds, all suspended requests retry seamlessly without user disruption.

---

## 2. Collections / Knowledge Bases (`src/features/collections`)

| Endpoint | Method | Request Payload | Cache Invalidation |
|---|---|---|---|
| `/collections` | `GET` | `?limit=50&offset=0` | Provides `Collections: LIST` |
| `/collections` | `POST` | `{ name, description? }` | Invalidates `Collections: LIST` |
| `/collections/{id}` | `GET` | *Path Param* | Provides `Collections: {id}` |
| `/collections/{id}` | `PATCH` | `{ name?, description? }` | Invalidates `Collections: {id}`, `Collections: LIST` |
| `/collections/{id}` | `DELETE` | *Path Param* | Cascade deletes all documents; invalidates `Collections: LIST`, `Documents: LIST` |

---

## 3. Documents & Ingestion Pipeline (`src/features/documents`)

### Ingestion Flow:
1. **Client Upload**: Client submits `multipart/form-data` with `files: File[]`, `file: File`, and optional `collection_id` or `collection_name`.
2. **Server Response (HTTP 202 Accepted)**: Server persists file metadata in PostgreSQL with `status: "pending"`, uploads raw file to Supabase Storage, enqueues background parsing task via Celery, and returns `DocumentBatchUploadResponse`.
3. **Frontend Polling & Status Transition**: The frontend dynamically polls `GET /documents` every 3.5s *only while documents are actively queued or processing* (`status === "pending"` or `"processing"`). As soon as all documents transition into terminal states (`"completed"` or `"failed"`), the polling timer automatically unmounts and halts.
4. **Error Recovery & Diagnostics**: When a document enters `"failed"` state, the polling immediately stops. The card and inspector render the exact `error_message` returned by the backend worker alongside a one-click "Retry" action calling `POST /documents/{id}/process`.

| Endpoint | Method | Params / Payload | Purpose |
|---|---|---|---|
| `/documents/upload` | `POST` | `multipart/form-data` | Ingests 1 to N files (max 50MB each). Supports partial batch failure isolation. |
| `/documents` | `GET` | `?collection_id={id}&limit=50&offset=0` | Lists user documents with status and metadata |
| `/documents/{id}` | `GET` | *Path Param* | Returns document status, page count, chunk count, and signed download URL |
| `/documents/{id}/process` | `POST` | `?run_in_background=true` | Re-triggers parsing, chunking, and embedding |
| `/documents/{id}/summary` | `GET` | *Path Param* | Retrieves pre-generated executive summary and structured entity catalog |
| `/documents/{id}/summarize` | `POST` | *Path Param* | Generates on-demand executive summary from parsed chunks |

---

## 4. Chat Threads & Conversational Memory (`src/features/chat`)

### Real-Time Server-Sent Events (SSE) Protocol:
The frontend connects to `POST /threads/{thread_id}/chat` with `{ message: string, stream: true, search_mode: "hybrid", top_k: 5 }`.
The backend responds with `Content-Type: text/event-stream; charset=utf-8` emitting 4 sequential event types:

```
1. Metadata Event (Emitted first):
event: metadata
data: {"thread_id": "...", "citations": [{"source_number": 1, "document_title": "10-Q Filing", "page_number": 4, "snippet": "...", "similarity": 0.94}], "standalone_query": "..."}

2. Token Events (Emitted word-by-word):
event: token
data: {"token": "According"}

event: token
data: {"token": " to"}

event: token
data: {"token": " page 4 [1]..."}

3. Done Event (Emitted upon completion):
event: done
data: {"assistant_message_id": "...", "execution_time_ms": 142.5}

4. Error Event (If retrieval or synthesis fails):
event: error
data: {"error": "..."}
```

| Endpoint | Method | Payload / Query | Purpose |
|---|---|---|---|
| `/threads` | `POST` | `{ title?, collection_id?, document_id? }` | Creates persistent conversation thread |
| `/threads` | `GET` | `?limit=20&offset=0` | Lists threads with message counts and last activity |
| `/threads/{id}` | `GET` | *Path Param* | Retrieves full thread details and historical messages |
| `/threads/{id}` | `PATCH` | `{ title: string }` | Renames conversation thread |
| `/threads/{id}` | `DELETE` | *Path Param* | Soft-deletes conversation thread |
| `/threads/{id}/chat` | `POST` | `{ message, stream: true, ... }` | Sends message, contextualizes history, and streams tokens |
| `/threads/{id}/messages` | `GET` | `?limit=50&offset=0` | Paginated message history retrieval |
