import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Ticketing System",
  description: "Template for building a ticketing system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900`}
      >
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Ticketing System
            </h1>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link
                href="/events"
                className="hover:text-slate-900 transition-colors"
              >
                Events
              </Link>
              <Link
                href="/my-bookings"
                className="hover:text-slate-900 transition-colors"
              >
                My Bookings
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
