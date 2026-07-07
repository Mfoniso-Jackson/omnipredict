import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeOdds, formatPercent, formatSignedPercent } from "@/lib/analytics/market";
import { getInsightForMatch } from "@/lib/ai/insights";
import { txlineMockClient } from "@/lib/txline/mockClient";

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = txlineMockClient.getMatch(params.id);
  if (!match) notFound();

  const odds = txlineMockClient.getOddsForMatch(match.id);
  const events = txlineMockClient.getEventsForMatch(match.id);
  const insight = getInsightForMatch(match);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone={match.status === "live" ? "green" : "amber"}>{match.status.toUpperCase()}</Badge>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </h1>
          <p className="mt-2 text-zinc-400">{match.round} · TxLINE ID {match.txlineMatchId}</p>
        </div>
        <div className="font-mono text-5xl font-black text-white">
          {match.score.home}-{match.score.away}
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Odds and fair value</CardTitle>
            <Badge tone="blue">Mock TxLINE snapshots</Badge>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="pb-3">Market</th>
                  <th className="pb-3">Outcome</th>
                  <th className="pb-3">Odds</th>
                  <th className="pb-3">Market prob</th>
                  <th className="pb-3">Model prob</th>
                  <th className="pb-3">EV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {odds.flatMap((snapshot) =>
                  analyzeOdds(snapshot).map((row) => (
                    <tr key={`${snapshot.id}-${row.outcome}`}>
                      <td className="py-3 text-zinc-400">{snapshot.marketId}</td>
                      <td className="py-3 text-white">{row.outcome}</td>
                      <td className="py-3 font-mono">{row.decimalOdds.toFixed(2)}</td>
                      <td className="py-3 font-mono">{formatPercent(row.marketProbability)}</td>
                      <td className="py-3 font-mono">{formatPercent(row.modelProbability)}</td>
                      <td className={`py-3 font-mono ${row.expectedValue > 0 ? "text-emerald-300" : "text-red-300"}`}>
                        {formatSignedPercent(row.expectedValue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardTitle>AI explanation</CardTitle>
          <p className="mt-3 text-lg font-semibold text-white">{insight.title}</p>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{insight.summary}</p>
          <p className="mt-5 text-xs uppercase tracking-wide text-zinc-500">Confidence</p>
          <p className="mt-1 font-mono text-3xl font-bold text-emerald-300">{formatPercent(insight.confidence)}</p>
        </Card>
      </section>

      <Card>
        <CardTitle>TxLINE event timeline</CardTitle>
        <div className="mt-5 grid gap-4">
          {events.map((event) => (
            <div className="grid gap-3 border-l border-white/10 pl-4 md:grid-cols-[80px_1fr]" key={event.id}>
              <span className="font-mono text-emerald-300">{`${event.minute}'`}</span>
              <div>
                <p className="font-semibold text-white">{event.title}</p>
                <p className="text-sm text-zinc-400">{event.description}</p>
                <p className="mt-1 font-mono text-xs text-zinc-600">{event.txlineEventHash}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
