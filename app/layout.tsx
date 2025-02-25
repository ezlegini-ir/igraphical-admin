import type { Metadata } from "next";
import "./globals.css";
// import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`antialiased scroll-smooth ${scrollbarStyles}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
        {/* <Toaster /> */}
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: "Admin - iGraphical",
    template: "%s - iGraphical",
  },
  description: "iGraphical Panel",
};

export const scrollbarStyles = `overflow-y-scroll
  [&::-webkit-scrollbar]:w-2.5
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-200
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-slate-400/70
  hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
 `;
