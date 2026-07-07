import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ایران روشن | بازی مصرف درست برق",
  description:
    "کاشی‌های مصرف درست رو ترکیب کن و از یک حرکت ساده به روشنایی یک کشور برس.",
  openGraph: {
    title: "ایران روشن",
    description: "بازی 2048 با پیام مصرف درست برق",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e88e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} antialiased`}>{children}</body>
    </html>
  );
}
