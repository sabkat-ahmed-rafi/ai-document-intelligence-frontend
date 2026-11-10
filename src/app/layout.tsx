import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "DocIntel AI — Verifiable Document Intelligence",
  description:
    "Next-generation conversational retrieval, multimodal layout understanding, and verifiable citation search across complex knowledge bases.",
};

const antiFOUCScript = `
(function() {
  try {
    var saved = localStorage.getItem('docintel-theme');
    if (saved === 'cream') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFOUCScript }} />
      </head>
      <body className="min-h-full bg-[#FAF8F5] text-stone-900 dark:bg-[#0C0A09] dark:text-stone-100 flex flex-col font-sans selection:bg-amber-100 dark:selection:bg-amber-950/60 selection:text-amber-900 dark:selection:text-amber-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
