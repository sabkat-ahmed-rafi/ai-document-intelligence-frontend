"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentScenario {
  id: string;
  category: string;
  filename: string;
  meta: {
    pages: number;
    tokens: string | number;
    latency: string;
    precision: string;
  };
  query: string;
  documentContent: {
    header: string;
    subheading: string;
    bodyParagraphs: {
      chunkId: number;
      text: string;
      highlight?: boolean;
    }[];
    tableData?: {
      headers: string[];
      rows: string[][];
    };
  };
  aiAnswer: {
    summary: string;
    citations: {
      id: number;
      page: number;
      section: string;
      chunkId: number;
    }[];
    extractedEntities: {
      label: string;
      value: string;
      confidence: number;
    }[];
    retrievalMetrics: {
      similarity: number;
      rerank: number;
      latencyMs: number;
    };
  };
}

const SCENARIOS: DocumentScenario[] = [
  {
    id: "finance",
    category: "Financial 10-Q Filing",
    filename: "ApexGlobal_Q3_10Q_Consolidated.pdf",
    meta: {
      pages: 64,
      tokens: "48,200",
      latency: "118ms",
      precision: "99.4%",
    },
    query: "What drove the 14.8% contraction in EMEA operating margin during Q3?",
    documentContent: {
      header: "ITEM 2. MANAGEMENT'S DISCUSSION AND ANALYSIS OF FINANCIAL CONDITION",
      subheading: "Regional Operating Segment Analysis — EMEA Geographic Region",
      bodyParagraphs: [
        {
          chunkId: 1,
          text: "EMEA net revenue for the three months ended September 30, 2026 totaled $412.4 million, representing an organic expansion of 3.2% year-over-year. However, regional operating income contracted 14.8% to $58.1 million compared to $68.2 million in the prior year period.",
          highlight: false,
        },
        {
          chunkId: 2,
          text: "The margin contraction was predominantly driven by accelerated enterprise cloud transition infrastructure investments ($14.2M) and higher severance provisions ($6.8M) associated with regional restructuring initiatives. In addition, adverse foreign exchange headwinds against the Euro and GBP reduced adjusted operating margin by approximately 110 basis points.",
          highlight: true,
        },
        {
          chunkId: 3,
          text: "Capital expenditures across European datacenter hubs reached $32.1 million in Q3, up from $19.4 million in Q3 2025. Management anticipates stabilized run-rate efficiencies by Q2 2027 as cloud migration transitions from capital build-out to recurring operational delivery.",
          highlight: false,
        },
      ],
      tableData: {
        headers: ["Segment Cost Driver", "Q3 2026", "Q3 2025", "YoY Impact"],
        rows: [
          ["Cloud Infra Migration", "$14.2M", "$3.8M", "+273%"],
          ["Severance & Restructuring", "$6.8M", "$1.2M", "+466%"],
          ["FX Headwinds (EUR/GBP)", "-110 bps", "-20 bps", "-90 bps"],
        ],
      },
    },
    aiAnswer: {
      summary:
        "The 14.8% contraction in EMEA operating margin was primarily triggered by $14.2M in enterprise cloud transition expenditures and $6.8M in restructuring severance provisions, alongside 110 bps in adverse foreign exchange headwinds against the Euro and GBP.",
      citations: [
        { id: 1, page: 24, section: "§2.B EMEA Segment", chunkId: 2 },
        { id: 2, page: 26, section: "Table 4.1 Cost Drivers", chunkId: 2 },
      ],
      extractedEntities: [
        { label: "Cloud Infra Costs", value: "$14.2M", confidence: 99.7 },
        { label: "Severance Provision", value: "$6.8M", confidence: 99.2 },
        { label: "FX Drag", value: "110 bps", confidence: 98.6 },
        { label: "Target Stabilization", value: "Q2 2027", confidence: 97.9 },
      ],
      retrievalMetrics: {
        similarity: 0.942,
        rerank: 0.986,
        latencyMs: 118,
      },
    },
  },
  {
    id: "legal",
    category: "Master Services Agreement",
    filename: "SaaS_Enterprise_MSA_Executed.pdf",
    meta: {
      pages: 32,
      tokens: "24,800",
      latency: "94ms",
      precision: "99.8%",
    },
    query: "Under what notice window can the Customer terminate for convenience, and is there an early exit fee?",
    documentContent: {
      header: "SECTION 11. TERM AND TERMINATION",
      subheading: "Clause 11.4 — Termination for Convenience and Mutual Sunset",
      bodyParagraphs: [
        {
          chunkId: 1,
          text: "11.4 Termination for Convenience. Customer may terminate this Agreement or any applicable Order Form in whole or in part at any time without cause by providing at least ninety (90) calendar days prior written notice to Service Provider.",
          highlight: true,
        },
        {
          chunkId: 2,
          text: "11.4.1 Fee Structure upon Early Exit. In the event of termination under Clause 11.4, Customer shall remain responsible for fees incurred through the effective termination date, but shall not be subject to liquidated damages, unaccrued penalty fees, or accelerated future commitment payments.",
          highlight: true,
        },
        {
          chunkId: 3,
          text: "11.5 Post-Termination Data Transition. Service Provider shall maintain full encrypted tenant data access for sixty (60) days following termination at no additional charge to facilitate migration exports.",
          highlight: false,
        },
      ],
    },
    aiAnswer: {
      summary:
        "Customer may terminate for convenience with at least ninety (90) calendar days prior written notice. There is no liquidated damages or early exit penalty fee; Customer only pays fees incurred through the effective termination date.",
      citations: [
        { id: 1, page: 18, section: "Clause 11.4", chunkId: 1 },
        { id: 2, page: 19, section: "Clause 11.4.1", chunkId: 2 },
      ],
      extractedEntities: [
        { label: "Notice Window", value: "90 Calendar Days", confidence: 99.9 },
        { label: "Exit Penalty", value: "None ($0)", confidence: 99.5 },
        { label: "Data Retention", value: "60 Days Post-Exit", confidence: 98.9 },
        { label: "Notice Delivery", value: "Written Notice", confidence: 99.1 },
      ],
      retrievalMetrics: {
        similarity: 0.965,
        rerank: 0.994,
        latencyMs: 94,
      },
    },
  },
  {
    id: "biomedical",
    category: "Clinical Research Protocol",
    filename: "NeuroGen_Phase2b_Protocol_Final.pdf",
    meta: {
      pages: 118,
      tokens: "89,400",
      latency: "142ms",
      precision: "99.1%",
    },
    query: "What was the primary efficacy endpoint for Cohort 2 and did it reach statistical significance?",
    documentContent: {
      header: "PROTOCOL SECTION 7: CLINICAL EFFICACY EVALUATION",
      subheading: "7.2 Primary Endpoint Analysis — Cohort 2 (High Dose 120mg)",
      bodyParagraphs: [
        {
          chunkId: 1,
          text: "The primary efficacy endpoint was the change from baseline in the ADAS-Cog13 cognitive composite scale at Week 24 compared to placebo in the modified intent-to-treat (mITT) cohort.",
          highlight: false,
        },
        {
          chunkId: 2,
          text: "At Week 24, subjects in Cohort 2 (120mg BID, n=184) demonstrated a statistically significant reduction in cognitive decline with a mean difference of -3.42 points on ADAS-Cog13 vs placebo (95% CI: -4.81 to -2.03; p < 0.001).",
          highlight: true,
        },
        {
          chunkId: 3,
          text: "Secondary neurofilament light chain (NfL) biomarker levels in CSF exhibited an 18.6% mean reduction from baseline (p = 0.004), corroborating targeted neuroprotective activity with zero treatment-related serious adverse events (SAEs).",
          highlight: false,
        },
      ],
    },
    aiAnswer: {
      summary:
        "The primary endpoint was the mean change from baseline in ADAS-Cog13 at Week 24. Cohort 2 achieved statistical significance with a -3.42 point improvement over placebo (95% CI: -4.81 to -2.03; p < 0.001).",
      citations: [
        { id: 1, page: 48, section: "§7.2 Primary Endpoint", chunkId: 2 },
        { id: 2, page: 51, section: "§7.3 Biomarker Panel", chunkId: 3 },
      ],
      extractedEntities: [
        { label: "Primary Endpoint", value: "ADAS-Cog13 at Wk 24", confidence: 99.8 },
        { label: "Treatment Delta", value: "-3.42 points", confidence: 99.4 },
        { label: "p-value", value: "p < 0.001 (Sig)", confidence: 99.9 },
        { label: "Sample Size", value: "n = 184 (mITT)", confidence: 98.7 },
      ],
      retrievalMetrics: {
        similarity: 0.958,
        rerank: 0.989,
        latencyMs: 142,
      },
    },
  },
];

export function DocumentInspector() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("finance");
  const [activeChunkHighlight, setActiveChunkHighlight] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const scenario =
    SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.aiAnswer.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-stone-300/80 dark:border-stone-800 bg-[#FAF8F5]/80 dark:bg-[#12100E]/90 p-3 sm:p-5 shadow-xl shadow-stone-900/5 backdrop-blur-md">
      {/* Top Bar: Document Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-200/60 dark:bg-stone-900/90 border border-stone-300/70 dark:border-stone-800">
          {SCENARIOS.map((s) => {
            const isActive = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveScenarioId(s.id);
                  setActiveChunkHighlight(null);
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg select-none cursor-pointer transition-all duration-150 active:scale-[0.98]",
                  isActive
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs border border-stone-200/80 dark:border-stone-700"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{s.category}</span>
              </button>
            );
          })}
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
          <span className="inline-flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <strong className="font-semibold text-stone-800 dark:text-stone-200">
              {scenario.meta.latency}
            </strong>{" "}
            retrieval
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <strong className="font-semibold text-stone-800 dark:text-stone-200">
              {scenario.meta.precision}
            </strong>{" "}
            precision
          </span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline text-stone-400 dark:text-stone-500 font-mono">
            {scenario.filename}
          </span>
        </div>
      </div>

      {/* Main Split Inspector View */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Pane: Verified Source Document (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#161311] overflow-hidden shadow-2xs">
          {/* Document Header Bar */}
          <div className="px-4 py-2.5 bg-stone-100/70 dark:bg-stone-900/70 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-medium text-stone-700 dark:text-stone-300 truncate max-w-[240px] sm:max-w-none">
                {scenario.filename}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400">
              <span>{scenario.meta.pages} pages</span>
              <span>•</span>
              <span>{scenario.meta.tokens} tokens</span>
            </div>
          </div>

          {/* Document Content View */}
          <div className="p-4 sm:p-5 space-y-3.5 font-serif text-sm leading-relaxed text-stone-800 dark:text-stone-200 max-h-[460px] overflow-y-auto">
            <div className="font-sans font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b border-stone-200/80 dark:border-stone-800 pb-1">
              {scenario.documentContent.header}
            </div>
            <div className="font-sans font-semibold text-xs text-stone-700 dark:text-stone-300">
              {scenario.documentContent.subheading}
            </div>

            {scenario.documentContent.bodyParagraphs.map((p) => {
              const isTargeted = activeChunkHighlight === p.chunkId;
              return (
                <div
                  key={p.chunkId}
                  className={cn(
                    "relative p-3 rounded-lg border transition-all duration-200",
                    isTargeted
                      ? "bg-amber-100/70 dark:bg-amber-950/40 border-amber-500/80 dark:border-amber-500/70 shadow-xs ring-2 ring-amber-400/20"
                      : p.highlight
                      ? "bg-stone-100/80 dark:bg-stone-900/50 border-stone-300/70 dark:border-stone-800 hover:border-amber-400/60"
                      : "bg-transparent border-transparent hover:bg-stone-50 dark:hover:bg-stone-900/30"
                  )}
                >
                  <div className="flex items-center justify-between pb-1.5 font-sans text-[10px] uppercase tracking-wider font-semibold">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-md font-mono",
                        isTargeted
                          ? "bg-amber-600 text-white"
                          : "bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      )}
                    >
                      Chunk #{p.chunkId}
                    </span>
                    {isTargeted && (
                      <span className="text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> Source Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] leading-relaxed text-stone-800 dark:text-stone-200 font-sans">
                    {p.text}
                  </p>
                </div>
              );
            })}

            {scenario.documentContent.tableData && (
              <div className="mt-3 overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-800 font-sans text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      {scenario.documentContent.tableData.headers.map((h, i) => (
                        <th key={i} className="py-2 px-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                    {scenario.documentContent.tableData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-stone-50 dark:hover:bg-stone-900/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-3 font-mono text-[11px]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Conversational Verified Intelligence (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-[#161311] p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="space-y-4">
            {/* User Query Display */}
            <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <Search className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span>Verified Semantic Query</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 leading-snug">
                &ldquo;{scenario.query}&rdquo;
              </p>
            </div>

            {/* Answer Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 dark:text-stone-100">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  Citation-Backed Synthesis
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs sm:text-[13px] leading-relaxed text-stone-800 dark:text-stone-200">
                {scenario.aiAnswer.summary}
              </div>
            </div>

            {/* Interactive Citations (Click to highlight chunk) */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 block">
                Click Citation to Locate in Document:
              </span>
              <div className="flex flex-wrap gap-2">
                {scenario.aiAnswer.citations.map((cite) => {
                  const isHovered = activeChunkHighlight === cite.chunkId;
                  return (
                    <button
                      key={cite.id}
                      type="button"
                      onClick={() =>
                        setActiveChunkHighlight(
                          activeChunkHighlight === cite.chunkId ? null : cite.chunkId
                        )
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium select-none cursor-pointer border transition-all duration-150 active:scale-[0.97]",
                        isHovered
                          ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                          : "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                      )}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>
                        [{cite.id}] p.{cite.page} {cite.section}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extracted Named Entities with Confidence Gauge */}
            <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-stone-800">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 block">
                Structured Entities & Confidences:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {scenario.aiAnswer.extractedEntities.map((ent, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800"
                  >
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                      {ent.label}
                    </div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100 font-mono text-[11px] truncate">
                      {ent.value}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {ent.confidence}%
                      </span>
                      <div className="w-12 h-1 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${ent.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Retrieval Engine Telemetry Footer */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
            <span>Cos Sim: {scenario.aiAnswer.retrievalMetrics.similarity}</span>
            <span>Rerank: {scenario.aiAnswer.retrievalMetrics.rerank}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              ⚡ {scenario.aiAnswer.retrievalMetrics.latencyMs}ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
