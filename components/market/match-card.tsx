import Link from "next/link";
import type { Match, OddsSnapshot } from "@/types";
import { analyzeOdds, formatPercent, formatSignedPercent } from "@/lib/analytics/market";
import { getInsightForMatch } from "@/lib/ai/insights";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProbabilityBar } from "@/components/market/probability-bar";

interface MatchCardProps {
  match: Match;
  odds?: OddsSnapshot;
}

export function MatchCard({ match, odds }: MatchCardProps) {
  const analysis = odds ? analyzeOdds(odds) : [];
  const insight = getInsightForMatch(match);
  const bestEdge = [...analysis].sort((a, b) => b.expectedValue - a.expectedValue)[0];

  return (
    <Card>
      <CardHeader>
        <div>
          <Badge tone={match.status === "live" ? "green" : "amber"}>{match.status.toUpperCase()}</Badge>
          <CardTitle className="mt-3">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </CardTitle>
          <p className="mt-1 text-sm text-zinc-400">{match.round}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-bold text-white">
            {match.score.home}-{match.score.away}
          </div>
          <p className="text-xs text-zinc-500">{match.minute ? `${match.minute}'` : "Pre-match"}</p>
        </div>
      </CardHeader>

      {analysis.length > 0 ? (
        <div className="space-y-4">
          <ProbabilityBar
            values={analysis.slice(0, 3).map((item, index) => ({
              label: item.outcome,
              value: item.marketProbability,
              className: ["bg-emerald-400", "bg-amber-400", "bg-sky-400"][index] ?? "bg-zinc-400"
            }))}
          />
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Metric label="Market" value={formatPercent(analysis[0]?.marketProbability ?? 0)} />
            <Metric label="Model" value={formatPercent(analysis[0]?.modelProbability ?? 0)} />
            <Metric
              label="Best EV"
              value={bestEdge ? formatSignedPercent(bestEdge.expectedValue) : "0%"}
              tone={(bestEdge?.expectedValue ?? 0) > 0 ? "text-emerald-300" : "text-red-300"}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Confidence" value={bestEdge ? formatPercent(bestEdge.confidenceScore) : "0%"} />
            <Metric label="Kelly cap" value={bestEdge ? formatPercent(bestEdge.kellyFraction) : "0%"} tone="text-emerald-300" />
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-sm leading-6 text-zinc-300">{insight.summary}</p>
      <Link className="mt-5 inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200" href={`/match/${match.id}`}>
        Open market intelligence
      </Link>
    </Card>
  );
}

function Metric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-1 font-mono text-lg font-semibold ${tone}`}>{value}</p>
    </div>
  );
}
