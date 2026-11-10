"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  User as UserIcon,
  KeyRound,
  FolderOpen,
  FolderPlus,
  MessageSquare,
  ShieldCheck,
  UploadCloud,
  Menu,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import {
  CollectionsList,
  CreateCollectionModal,
  useListCollectionsQuery,
  Collection,
} from "@/features/collections";
import {
  DocumentList,
  DocumentUploadModal,
  useListDocumentsQuery,
} from "@/features/documents";
import {
  ChatSidebar,
  ChatView,
  useListThreadsQuery,
} from "@/features/chat";
import { Button } from "@/components/ui/button";

export function DashboardView() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<"chat" | "library">("chat");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(undefined);
  const [activeCollectionId, setActiveCollectionId] = useState<string | undefined>(undefined);

  // Modals & Profile
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Queries
  const { data: collectionsData } = useListCollectionsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: documentsData } = useListDocumentsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: threadsData } = useListThreadsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const collections = useMemo(
    () => collectionsData?.data?.collections ?? [],
    [collectionsData?.data?.collections]
  );
  const collectionsCount = collectionsData?.data?.total ?? collections.length;
  const totalDocuments =
    documentsData?.data?.total ?? documentsData?.data?.documents?.length ?? 0;
  const totalThreads = threadsData?.data?.total ?? threadsData?.data?.items?.length ?? 0;

  // Active collection name
  const activeCollectionName = useMemo(() => {
    if (!activeCollectionId) return "All Documents";
    const found = collections.find((c) => c.id === activeCollectionId);
    return found ? found.name : "All Documents";
  }, [activeCollectionId, collections]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleNewChat = () => {
    setActiveThreadId(undefined);
    setCurrentView("chat");
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setCurrentView("chat");
  };

  const handleSelectCollection = (colId?: string) => {
    setActiveCollectionId(colId);
  };

  // Global Keyboard Shortcut: Cmd/Ctrl + K starts new chat
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-[#0C0A09]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
          <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
            Initializing secure workspace...
          </p>
        </div>
      </div>
    );
  }

  const displayName = user.first_name || user.email.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] dark:bg-[#0C0A09] text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* 1. Left Collapsible AI Sidebar (ChatGPT style) */}
      <ChatSidebar
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onNewChat={handleNewChat}
        activeCollectionId={activeCollectionId}
        onSelectCollection={handleSelectCollection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onSwitchToLibrary={() => setCurrentView("library")}
        userEmail={user.email}
        userDisplayName={displayName}
        onLogout={handleLogout}
      />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Bar */}
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

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* View Switcher Pills */}
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
          </div>
        </header>

        {/* Dynamic Body Content */}
        {currentView === "chat" ? (
          /* Main ChatGPT Style Canvas */
          <ChatView
            activeThreadId={activeThreadId}
            onSelectThread={setActiveThreadId}
            activeCollectionId={activeCollectionId}
            activeCollectionName={activeCollectionName}
            userInitial={userInitial}
          />
        ) : (
          /* Knowledge Library View (Collections & Documents) */
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-7xl w-full mx-auto">
            {/* Library Welcome Banner */}
            <div className="rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-700 dark:text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Knowledge Base Ingestion</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  Document Knowledge Bases
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Manage collections, upload new documentation, and monitor Docling layout-aware parsing and pgvector indexing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-1.5 shadow-xs text-xs"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>New Collection</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="gap-1.5 shadow-xs text-xs"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Document</span>
                </Button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
                    Collections
                  </p>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
                    {collectionsCount}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <FolderOpen className="h-4 w-4" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
                    Indexed Documents
                  </p>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
                    {totalDocuments}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
                    Conversations
                  </p>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono">
                    {totalThreads}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Collections Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                    Collections
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Grouped knowledge bases for isolated document retrieval.
                  </p>
                </div>
                {activeCollectionId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCollectionId(undefined)}
                    className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>

              <CollectionsList
                onSelectCollection={(col: Collection) => {
                  setActiveCollectionId(col.id);
                  toast.info(`Filtered to "${col.name}"`);
                }}
              />
            </section>

            {/* Documents Section */}
            <section className="space-y-4 pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                  Indexed Documents
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Search through all ingested documents, inspect parsed tables, or trigger on-demand executive summaries.
                </p>
              </div>

              <DocumentList
                initialCollectionId={activeCollectionId}
                onOpenUpload={() => setIsUploadModalOpen(true)}
              />
            </section>

            {/* Account Profile Card */}
            <section className="pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="max-w-md rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-5 shadow-xs space-y-4">
                {showChangePassword ? (
                  <ChangePasswordForm
                    onSuccess={() => setShowChangePassword(false)}
                    onCancel={() => setShowChangePassword(false)}
                  />
                ) : (
                  <div>
                    <div className="flex items-center gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                      <div className="h-8 w-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                          Account Profile
                        </h3>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400">
                          Identity & credentials
                        </p>
                      </div>
                    </div>

                    <dl className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800/60">
                        <dt className="text-stone-500">Email</dt>
                        <dd className="font-mono text-stone-900 dark:text-stone-100 truncate max-w-[170px]">
                          {user.email}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800/60">
                        <dt className="text-stone-500">Role</dt>
                        <dd className="capitalize font-mono font-semibold text-amber-700 dark:text-amber-400">
                          {user.role}
                        </dd>
                      </div>
                      <div className="flex justify-between py-1">
                        <dt className="text-stone-500">Status</dt>
                        <dd className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 text-xs"
                        onClick={() => setShowChangePassword(true)}
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
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
    </div>
  );
}
