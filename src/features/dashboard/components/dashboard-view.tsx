"use client";

import React, { useEffect, useState, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Menu, Sparkles, ArrowLeft, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { AccountSettingsModal } from "@/features/auth/components/account-settings-modal";
import { CreateCollectionModal, useListCollectionsQuery, Collection } from "@/features/collections";
import { DocumentUploadModal, useListDocumentsQuery } from "@/features/documents";
import { ChatSidebar, ChatView, useListThreadsQuery } from "@/features/chat";
import { LibraryView } from "./library-view";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const emptySubscribe = () => () => {};

export function DashboardView() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Navigation & Workspace State
  const [currentView, setCurrentView] = useState<"chat" | "library">("chat");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(undefined);
  const [activeCollectionId, setActiveCollectionId] = useState<string | undefined>(undefined);

  // Dialog State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Live Domain Data (Guarded by client mount + authentication)
  const { data: collectionsData } = useListCollectionsQuery(undefined, {
    skip: !isMounted || !isAuthenticated,
  });
  const { data: documentsData } = useListDocumentsQuery(undefined, {
    skip: !isMounted || !isAuthenticated,
  });
  const { data: threadsData } = useListThreadsQuery(undefined, {
    skip: !isMounted || !isAuthenticated,
  });

  const collections = useMemo(
    () => collectionsData?.data?.collections ?? [],
    [collectionsData?.data?.collections]
  );
  const collectionsCount = collectionsData?.data?.total ?? collections.length;
  const totalDocuments =
    documentsData?.data?.total ?? documentsData?.data?.documents?.length ?? 0;
  const totalThreads = threadsData?.data?.total ?? threadsData?.data?.items?.length ?? 0;

  const activeCollectionName = useMemo(() => {
    if (!activeCollectionId) return "All Documents";
    const found = collections.find((c) => c.id === activeCollectionId);
    return found ? found.name : "All Documents";
  }, [activeCollectionId, collections]);

  const handleNewChat = () => {
    setActiveThreadId(undefined);
    setCurrentView("chat");
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setCurrentView("chat");
  };

  const handleSelectCollection = (col: Collection) => {
    setActiveCollectionId(col.id);
    toast.info(`Filtered to "${col.name}"`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K triggers new chat
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isMounted || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-[#0C0A09]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
          <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
            Initializing workspace...
          </p>
        </div>
      </div>
    );
  }

  const displayName = user.first_name || user.email.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* 1. Left Collapsible Sidebar */}
      <ChatSidebar
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onNewChat={handleNewChat}
        activeCollectionId={activeCollectionId}
        onSelectCollection={setActiveCollectionId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onSwitchToLibrary={() => setCurrentView("library")}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        userEmail={user.email}
        userDisplayName={displayName}
        onLogout={handleLogout}
      />

      {/* 2. Main Workspace Canvas */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 shrink-0 border-b border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/85 dark:bg-[#0C0A09]/85 backdrop-blur-md px-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 min-w-0">
            {isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
                title="Expand Sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}

            <div className="flex items-center gap-2 truncate">
              {currentView === "chat" ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold truncate text-stone-900 dark:text-stone-100">
                    {activeThreadId ? "AI Document Chat" : "New Chat Session"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentView("chat")}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors mr-1"
                    title="Return to Chat"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Knowledge Base & Documents
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center p-0.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-xs font-medium">
              <button
                type="button"
                onClick={() => setCurrentView("chat")}
                className={`px-3 py-1 rounded-md transition-all ${
                  currentView === "chat"
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold"
                    : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                AI Chat
              </button>
              <button
                type="button"
                onClick={() => setCurrentView("library")}
                className={`px-3 py-1 rounded-md transition-all ${
                  currentView === "library"
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold"
                    : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                Library
              </button>
            </div>

            {currentView === "library" && (
              <Button
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
                className="gap-1.5 text-xs shadow-xs hidden sm:flex"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload</span>
              </Button>
            )}

            <ThemeToggle />
          </div>
        </header>

        {/* View Switch */}
        {currentView === "chat" ? (
          <ChatView
            activeThreadId={activeThreadId}
            onSelectThread={setActiveThreadId}
            activeCollectionId={activeCollectionId}
            activeCollectionName={activeCollectionName}
            userInitial={userInitial}
          />
        ) : (
          <LibraryView
            collectionsCount={collectionsCount}
            totalDocuments={totalDocuments}
            totalThreads={totalThreads}
            activeCollectionId={activeCollectionId}
            onSelectCollection={handleSelectCollection}
            onClearCollectionFilter={() => setActiveCollectionId(undefined)}
            onOpenCreateCollection={() => setIsCreateModalOpen(true)}
            onOpenUploadDocument={() => setIsUploadModalOpen(true)}
          />
        )}
      </div>

      {/* Global Modals */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultCollectionId={activeCollectionId}
      />

      <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
