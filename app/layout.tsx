import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "AI Document Intelligent",
  description: "AI Document Intelligent",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
