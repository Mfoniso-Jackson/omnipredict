import { MatchCard } from "@/components/market/match-card";
import { MovementAlert } from "@/components/market/movement-alert";
import { Card, CardTitle } from "@/components/ui/card";
import { detectMovement, findBestOpportunity, formatPercent, formatSignedPercent } from "@/lib/analytics/market";
import { txlineMockClient } from "@/lib/txline/mockClient";

export default function DashboardPage() {
  const matches = txlineMockClient.getMatches();
  const odds = matches.flatMap((match) => txlineMockClient.getOddsForMatch(match.id));
  const bestOpportunity = findBestOpportunity(odds);
  const movementSignal = detectMovement(
    txlineMockClient.getOddsHistoryForMatch("eng-bra"),
    txlineMockClient.getEventsForMatch("eng-bra")
  );
  const aiMode = process.env.OPENAI_API_KEY ? "OpenAI enabled" : "Deterministic fallback";

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
        <SummaryCard label="Top EV" value={bestOpportunity ? formatSignedPercent(bestOpportunity.expectedValue) : "0%"} />
        <SummaryCard label="Best confidence" value={bestOpportunity ? formatPercent(bestOpportunity.confidenceScore) : "0%"} />
      </section>
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Best current opportunity</p>
          <CardTitle className="mt-2">{bestOpportunity?.outcome ?? "No signal"}</CardTitle>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Expected value {bestOpportunity ? formatSignedPercent(bestOpportunity.expectedValue) : "0%"} with a Kelly
            allocation of {bestOpportunity ? formatPercent(bestOpportunity.kellyFraction) : "0%"} after risk capping.
          </p>
          <p className="mt-4 text-xs uppercase tracking-wide text-emerald-300">AI mode: {aiMode}</p>
        </Card>
        <MovementAlert signal={movementSignal} />
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
