import { CitationSource } from "../types";
import { env } from "@/config";

export interface SSEMetadataEvent {
  thread_id?: string;
  citations?: CitationSource[];
  standalone_query?: string | null;
  [key: string]: unknown;
}

export interface SSEDoneEvent {
  assistant_message_id?: string;
  execution_time_ms?: number;
  [key: string]: unknown;
}

export type SSEEvent =
  | { event: "metadata"; data: SSEMetadataEvent }
  | { event: "token"; data: { token: string } }
  | { event: "done"; data: SSEDoneEvent }
  | { event: "error"; data: { error: string } };

export async function* streamThreadChat(
  threadId: string,
  message: string,
  options?: {
    search_mode?: "hybrid" | "vector" | "keyword";
    top_k?: number;
    similarity_threshold?: number;
    signal?: AbortSignal;
  }
): AsyncGenerator<SSEEvent, void, unknown> {
  const url = `${env.API_BASE_URL}/threads/${threadId}/chat`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    credentials: "include",
    body: JSON.stringify({
      message,
      stream: true,
      search_mode: options?.search_mode ?? "hybrid",
      top_k: options?.top_k ?? 5,
      similarity_threshold: options?.similarity_threshold ?? 0.0,
    }),
    signal: options?.signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMessage = `Request failed with status ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      parsedMessage = parsed.message || parsed.detail || parsedMessage;
    } catch {
      // Use fallback error message
    }
    yield { event: "error", data: { error: parsedMessage } };
    return;
  }

  if (!response.body) {
    yield { event: "error", data: { error: "No response body received for streaming" } };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() || "";

      for (const block of blocks) {
        if (!block.trim()) continue;

        let currentEvent = "message";
        let currentData = "";

        const lines = block.split("\n");
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            currentData = line.slice(6).trim();
          }
        }

        if (currentData) {
          try {
            const parsedData = JSON.parse(currentData);
            yield {
              event: currentEvent as SSEEvent["event"],
              data: parsedData,
            } as SSEEvent;
          } catch {
            // Raw text fallback
            yield {
              event: currentEvent as SSEEvent["event"],
              data: { token: currentData },
            } as SSEEvent;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
