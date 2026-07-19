import type { Metadata } from "next";
import Link from "next/link";
import { appUrl } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: "OmniPredict",
  title: "OmniPredict | World Cup Market Intelligence",
  description: "AI-powered prediction market intelligence for the TxODDS World Cup hackathon.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "OmniPredict | World Cup Market Intelligence",
    description: "AI-powered prediction market intelligence for TxLINE World Cup prediction markets.",
    url: appUrl,
    siteName: "OmniPredict",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniPredict | World Cup Market Intelligence",
    description: "AI-powered prediction market intelligence for TxLINE World Cup prediction markets."
  }
};

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/match/eng-bra", label: "Match Intel" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/settlement", label: "Settlement" },
  { href: "/docs", label: "Docs" }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-white/10 bg-black/30 p-5 backdrop-blur lg:min-h-screen lg:border-b-0 lg:border-r">
            <Link className="flex items-center gap-3" href="/">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-400 font-black text-zinc-950">OP</span>
              <span>
                <strong className="block text-white">OmniPredict</strong>
                <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">TxLINE Intelligence</span>
              </span>
            </Link>
            <nav className="mt-8 grid gap-2">
              {navItems.map((item) => (
                <Link
                  className="rounded-md border border-transparent px-3 py-2 text-sm font-medium text-zinc-400 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Milestone 8</p>
              <p className="mt-2 text-sm text-zinc-300">
                Anchor toolchain bootstrap, expanded tests, and devnet readiness path.
              </p>
            </div>
          </aside>
          <main className="min-w-0 p-5 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
