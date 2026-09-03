import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVA — магазин современной техники",
  description: "Демо-магазин гаджетов и аксессуаров на Next.js.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
