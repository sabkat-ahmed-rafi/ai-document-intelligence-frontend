"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  CitationSource,
} from "../types";
import {
  useGetThreadQuery,
  useCreateThreadMutation,
} from "../api/chat-api";
import { streamThreadChat } from "../utils/sse-stream";
import { ChatMessageBubble } from "./chat-message-bubble";
import { ChatPromptInput } from "./chat-prompt-input";
import { ChatWelcomeCanvas } from "./chat-welcome-canvas";
import { CitationInspectorDrawer } from "./citation-inspector-drawer";
import { DocumentUploadModal } from "@/features/documents/components/document-upload-modal";

interface ChatViewProps {
  activeThreadId?: string;
  onSelectThread: (threadId: string) => void;
  activeCollectionId?: string;
  activeCollectionName?: string;
  userInitial?: string;
}

export function ChatView({
  activeThreadId,
  onSelectThread,
  activeCollectionId,
  activeCollectionName,
  userInitial = "U",
}: ChatViewProps) {
  const [selectedCitation, setSelectedCitation] = useState<CitationSource | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Streaming local state
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [streamingCitations, setStreamingCitations] = useState<CitationSource[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // RTK Query hooks
  const [createThread] = useCreateThreadMutation();
  const {
    data: threadRes,
    isLoading: isThreadLoading,
    refetch: refetchThread,
  } = useGetThreadQuery(activeThreadId || "", {
    skip: !activeThreadId,
  });

  const persistedMessages = threadRes?.data?.messages || [];

  // Scroll to bottom as messages or streaming tokens arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [persistedMessages.length, streamingContent]);

  // Send message handler (creates thread if needed, then streams response)
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    let targetThreadId = activeThreadId;

    // 1. If no active thread exists, create one first
    if (!targetThreadId) {
      try {
        const titlePreview = text.length > 40 ? `${text.slice(0, 40)}...` : text;
        const res = await createThread({
          title: titlePreview,
          collection_id: activeCollectionId || null,
        }).unwrap();
        targetThreadId = res.data.id;
        onSelectThread(targetThreadId);
      } catch {
        toast.error("Failed to start new conversation");
        return;
      }
    }

    // 2. Prepare streaming
    setIsStreaming(true);
    setStreamingContent("");
    setStreamingCitations([]);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const generator = streamThreadChat(targetThreadId, text, {
        signal: controller.signal,
      });

      for await (const event of generator) {
        if (event.event === "metadata") {
          if (event.data.citations) {
            setStreamingCitations(event.data.citations);
          }
        } else if (event.event === "token") {
          setStreamingContent((prev) => (prev || "") + event.data.token);
        } else if (event.event === "done") {
          setIsStreaming(false);
          setStreamingContent(null);
          setStreamingCitations([]);
          refetchThread();
          break;
        } else if (event.event === "error") {
          toast.error(event.data.error || "Generation error");
          setIsStreaming(false);
          setStreamingContent(null);
          break;
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        toast.error("An error occurred while streaming response");
      }
      setIsStreaming(false);
      setStreamingContent(null);
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      toast.info("Generation stopped");
      refetchThread();
    }
  };

  const handleFileDrop = () => {
    setIsUploadOpen(true);
  };

  return (
    <div className="flex-1 flex h-full relative overflow-hidden bg-[#FAF8F5] dark:bg-[#0C0A09] transition-colors duration-200">
      {/* Central Chat Stream */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Messages Stream or Welcome Canvas */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {!activeThreadId || (persistedMessages.length === 0 && !streamingContent) ? (
            <ChatWelcomeCanvas
              onSelectPrompt={handleSendMessage}
              activeCollectionName={activeCollectionName}
              onOpenUpload={() => setIsUploadOpen(true)}
              onFileDrop={handleFileDrop}
            />
          ) : isThreadLoading && persistedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2 text-stone-500 font-mono text-xs">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                <span>Loading conversation history...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto pb-4">
              {persistedMessages.map((msg) => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  onSelectCitation={(citation) => setSelectedCitation(citation)}
                  userInitial={userInitial}
                />
              ))}

              {/* In-Flight Streaming Message */}
              {isStreaming && streamingContent !== null && (
                <ChatMessageBubble
                  message={{
                    id: "streaming-temp",
                    thread_id: activeThreadId || "",
                    role: "assistant",
                    content: streamingContent + " ▍",
                    citations: streamingCitations,
                    created_at: new Date().toISOString(),
                  }}
                  onSelectCitation={(citation) => setSelectedCitation(citation)}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating ChatGPT-Style Prompt Input */}
        <ChatPromptInput
          onSendMessage={handleSendMessage}
          isLoading={isStreaming}
          onStopGenerating={handleStopGenerating}
          activeCollectionName={activeCollectionName}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      </div>

      {/* Side-by-Side Source Citation Inspector (NotebookLM style) */}
      {selectedCitation && (
        <CitationInspectorDrawer
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      )}

      {/* Modal for Direct File Ingestion */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultCollectionId={activeCollectionId}
      />
    </div>
  );
}
