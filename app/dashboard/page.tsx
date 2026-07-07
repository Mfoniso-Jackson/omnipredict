import { MatchCard } from "@/components/market/match-card";
import { Badge } from "@/components/ui/badge";
import { MovementAlert } from "@/components/market/movement-alert";
import { Card, CardTitle } from "@/components/ui/card";
import { detectMovement, findBestOpportunity, formatPercent, formatSignedPercent } from "@/lib/analytics/market";
import { txlineClient } from "@/lib/txline/client";

export default async function DashboardPage() {
  const [matches, status] = await Promise.all([txlineClient.getMatches(), txlineClient.getStatus()]);
  const oddsByMatch = await Promise.all(matches.map((match) => txlineClient.getOddsForMatch(match.id)));
  const odds = oddsByMatch.flat();
  const bestOpportunity = findBestOpportunity(odds);
  const primaryMatchId = matches[0]?.id ?? "eng-bra";
  const [primaryHistory, primaryEvents] = await Promise.all([
    txlineClient.getOddsHistoryForMatch(primaryMatchId),
    txlineClient.getEventsForMatch(primaryMatchId)
  ]);
  const movementSignal = detectMovement(primaryHistory, primaryEvents);
  const aiMode = process.env.OPENAI_API_KEY ? "OpenAI enabled" : "Deterministic fallback";

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Live market dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">World Cup intelligence</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          TxLINE adapter data drives match status, odds, implied probabilities, AI explanations, and fair-value signals.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone={status.mode === "live" ? "green" : status.mode === "live-fallback" ? "amber" : "neutral"}>
            TxLINE {status.mode.toUpperCase()}
          </Badge>
          <Badge tone="blue">{status.source}</Badge>
        </div>
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
        {matches.map((match, index) => (
          <MatchCard key={match.id} match={match} odds={oddsByMatch[index]?.[0]} />
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
