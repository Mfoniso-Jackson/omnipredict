import { Card, CardTitle } from "@/components/ui/card";
import { formatMoney, formatPercent } from "@/lib/analytics/market";
import type { OutcomeAnalysis } from "@/lib/analytics/market";

interface KellyPanelProps {
  opportunity?: OutcomeAnalysis;
  bankroll?: number;
}

export function KellyPanel({ opportunity, bankroll = 10000 }: KellyPanelProps) {
  if (!opportunity) {
    return (
      <Card>
        <CardTitle>Kelly sizing</CardTitle>
        <p className="mt-3 text-sm text-zinc-400">No opportunity available for sizing.</p>
      </Card>
    );
  }

  const stake = opportunity.kellyFraction * bankroll;

  return (
    <Card>
      <CardTitle>Kelly sizing</CardTitle>
      <p className="mt-3 text-sm text-zinc-400">Risk capped at 5% of bankroll for demo safety.</p>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <Metric label="Outcome" value={opportunity.outcome} />
        <Metric label="Kelly" value={formatPercent(opportunity.kellyFraction)} tone="text-emerald-300" />
        <Metric label="Bankroll" value={formatMoney(bankroll)} />
        <Metric label="Max stake" value={formatMoney(stake)} tone="text-emerald-300" />
      </div>
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
