import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "和小波聊聊｜一个清醒、有趣的对话空间",
  description: "与受理性、幽默、自由和反讽精神启发的虚拟对话者，谈谈爱情、科研、生活和那些不说会憋坏的问题。",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
  openGraph: {
    title: "和小波聊聊",
    description: "一个清醒、有趣的对话空间",
    type: "website",
    locale: "zh_CN",
    images: [{ url: `${siteUrl}/og.png`, width: 1736, height: 905, alt: "和小波聊聊：一个清醒、有趣的对话空间" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "和小波聊聊",
    description: "一个清醒、有趣的对话空间",
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning><body>{children}</body></html>;
}
