import React from "react";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Search,
  Zap,
  Lock,
  Layers,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DocumentInspector } from "./document-inspector";

export function HomeView() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 dark:bg-[#0C0A09] dark:text-stone-100 flex flex-col transition-colors duration-200">
      {/* Editorial Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-stone-200/80 dark:border-stone-800/80 bg-[#FAF8F5]/85 dark:bg-[#0C0A09]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Version Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center font-bold shadow-xs transition-transform duration-150 group-hover:scale-105">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-semibold text-base tracking-tight text-stone-900 dark:text-stone-100">
                DocIntel <span className="text-amber-600 dark:text-amber-500 font-normal">AI</span>
              </span>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600 dark:text-stone-400">
            <a
              href="#inspector"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Interactive Inspector
            </a>
            <a
              href="#capabilities"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#architecture"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Architecture
            </a>
            <a
              href="#get-started"
              className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Get Started
            </a>
          </nav>

          {/* Right Controls: Theme Toggle & Auth Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-300 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 shadow-2xs text-xs font-medium text-stone-700 dark:text-stone-300 backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Verifiable Document Intelligence for Critical Workflows</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.12]">
              Turn complex documents into{" "}
              <span className="italic font-serif font-normal text-amber-700 dark:text-amber-400">
                verifiable
              </span>{" "}
              answers.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
              Extract facts, cross-examine agreements, and query dense financial filings with
              pixel-coordinate citations. Engineered for teams where hallucination is not an option.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-sm">
                  Start Free Workspace
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <a href="#inspector">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Try Live Inspector
                </Button>
              </a>
            </div>

            {/* Value Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Traceable Page Citations
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Fast Conversational Search
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-stone-600 dark:text-stone-400" />
                Private & Isolated Workspace
              </span>
            </div>
          </div>

          {/* Interactive Document Inspector */}
          <div id="inspector" className="mt-12 sm:mt-16 scroll-mt-20">
            <div className="mb-3 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Interactive Live Inspector
                </span>
                <span className="hidden sm:inline">— Click citations below to trace evidence</span>
              </div>
              <span className="font-mono text-[11px]">Real-time Sandbox Demo</span>
            </div>
            <DocumentInspector />
          </div>
        </section>

        {/* Capabilities Section — Asymmetric Architectural Grid */}
        <section
          id="capabilities"
          className="py-16 sm:py-24 border-t border-stone-200/80 dark:border-stone-800 bg-[#F5F2EB]/50 dark:bg-[#0E0C0B]/60 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Core Capabilities
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Built specifically for document density, tables, and precision audits.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                Standard RAG pipelines fail when faced with merged tables, nested hierarchies, and
                clause cross-references. Our engine re-architects document processing from the ground
                up.
              </p>
            </div>

            {/* Asymmetric 4-Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Card 1: Wide Layout Understanding (7 cols) */}
              <div className="md:col-span-7 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Multimodal Layout & Table Extraction
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Preserves complex multi-column reading flows, financial tables, headers, and
                  footnotes. Financial models and contracts maintain their structural relationships
                  instead of being flattened into unreadable plaintext strings.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                    PDF / DOCX / Scanned OCR
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                    Bounding Box Coordinates
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                    Table Matrix Retention
                  </span>
                </div>
              </div>

              {/* Card 2: Hybrid Search (5 cols) */}
              <div className="md:col-span-5 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-200">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Hybrid Dense-Sparse Reranking
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Fuses exact BM25 keyword matching with high-dimensional vector embeddings. Never
                  misses specific clause numbers or balance sheet figures.
                </p>
                <div className="pt-2 text-xs font-mono text-stone-500 dark:text-stone-400">
                  Cross-encoder neural rerank ensures top-3 relevance accuracy &gt; 98.7%.
                </div>
              </div>

              {/* Card 3: Deterministic Source Attribution (5 cols) */}
              <div className="md:col-span-5 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-200">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Verifiable Sentence Citations
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Every single synthesis paragraph includes interactive citations. Click to visually
                  inspect the original source highlight on page and paragraph coordinates.
                </p>
                <div className="pt-2 text-xs font-mono text-stone-500 dark:text-stone-400">
                  Auditors and compliance teams can verify claims in seconds.
                </div>
              </div>

              {/* Card 4: Enterprise Air-Gapped Security (7 cols) */}
              <div className="md:col-span-7 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Strict Multi-Tenant Isolation & Zero Retention
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Your documents are encrypted both at rest and in transit with isolated vector
                  namespaces per organization. We never store raw documents on external LLM servers
                  or use your data for training.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                    Row-Level Security (RLS)
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                    Encrypted Cookie Sessions
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                    Granular RBAC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Pipeline Section */}
        <section
          id="architecture"
          className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Deterministic Processing Pipeline
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              From raw binary upload to verified truth.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
              Three orchestrated stages engineered to eliminate hallucinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] space-y-3">
              <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                01 / INGESTION & PARSING
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Structure-Aware Parsing
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Documents are split into semantic chunks that honor paragraph boundaries, lists, and
                table cell relationships rather than arbitrary character splits.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] space-y-3">
              <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                02 / HYBRID INDEXING
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Vector & Lexical Fusion
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Chunks are dual-indexed into an approximate nearest-neighbor vector space and an
                inverted lexical index, scored via Reciprocal Rank Fusion (RRF).
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#141210] space-y-3">
              <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                03 / CITATION SYNTHESIS
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Constraint-Bound Answering
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                The conversational LLM generates answers strictly grounded in retrieved evidence.
                Unverifiable claims are automatically discarded before output.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          id="get-started"
          className="py-16 sm:py-24 border-t border-stone-200/80 dark:border-stone-800 bg-[#F4EFE6] text-stone-900 dark:bg-[#141210] dark:text-stone-100 scroll-mt-16 transition-colors duration-200"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border border-stone-300/80 dark:border-stone-800 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Instant Setup
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Ready to explore your documents?
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Create an account in 30 seconds. Upload your first PDF and query it with instant,
              traceable citations.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-sm">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Sign In to Workspace
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800/80 py-8 text-xs text-stone-500 dark:text-stone-400 bg-[#FAF8F5] dark:bg-[#0C0A09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Fast Conversational Document Intelligence</span>
          </div>
          <div>© 2026 DocIntel AI Inc. Verifiable Document Intelligence. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
