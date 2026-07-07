import Link from "next/link";
import { MatchCard } from "@/components/market/match-card";
import { Card } from "@/components/ui/card";
import { txlineMockClient } from "@/lib/txline/mockClient";

export default function HomePage() {
  const [featuredMatch] = txlineMockClient.getMatches();
  const [featuredOdds] = txlineMockClient.getOddsForMatch(featuredMatch.id);

  return (
    <div className="grid min-h-[calc(100vh-4rem)] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Bloomberg Terminal + AI Copilot</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
          Explainable World Cup market intelligence.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          OmniPredict turns TxLINE-style match data, odds, events, and settlement receipts into probabilities,
          fair-value signals, AI explanations, and risk-aware portfolio intelligence.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-md bg-emerald-400 px-4 py-2 font-semibold text-zinc-950 hover:bg-emerald-300" href="/dashboard">
            Open dashboard
          </Link>
          <Link className="rounded-md border border-white/10 px-4 py-2 font-semibold text-white hover:bg-white/5" href="/docs">
            Read docs
          </Link>
        </div>
      </section>
      <div className="grid gap-4">
        <MatchCard match={featuredMatch} odds={featuredOdds} />
        <Card className="grid gap-3 md:grid-cols-3">
          <Kpi label="Mock matches" value="3" />
          <Kpi label="TxLINE mode" value="Mock" />
          <Kpi label="Risk cap" value="5%" />
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
