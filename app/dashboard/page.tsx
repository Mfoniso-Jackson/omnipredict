import { MatchCard } from "@/components/market/match-card";
import { Card, CardTitle } from "@/components/ui/card";
import { txlineMockClient } from "@/lib/txline/mockClient";

export default function DashboardPage() {
  const matches = txlineMockClient.getMatches();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Live market dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">World Cup intelligence</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          Mock TxLINE data drives match status, odds, implied probabilities, AI explanations, and fair-value signals.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Live matches" value={String(matches.filter((match) => match.status === "live").length)} />
        <SummaryCard label="Markets tracked" value="4" />
        <SummaryCard label="AI insights" value="2" />
        <SummaryCard label="Settlement proofs" value="1" />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} odds={txlineMockClient.getOddsForMatch(match.id)[0]} />
        ))}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <CardTitle className="mt-2 font-mono text-3xl">{value}</CardTitle>
    </Card>
  );
}
