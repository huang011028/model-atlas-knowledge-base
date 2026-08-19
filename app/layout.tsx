import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "模见 · 大模型时代知识库",
    template: "%s | 模见",
  },
  description: "将大模型的架构、训练、Agent 与应用知识，用文章、图谱和 QA 连接起来。",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "article",
    locale: "zh_CN",
    siteName: "模见 · Model Atlas",
    title: "Qwen 系列模型的演进",
    description: "从标准 Transformer 到 Hybrid Attention，一条路线看清 Qwen 如何走向 Agent 基座。",
    images: [{ url: "/og.png", width: 1731, height: 908, alt: "Qwen 系列模型的演进" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qwen 系列模型的演进",
    description: "从标准 Transformer 到 Hybrid Attention。",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
