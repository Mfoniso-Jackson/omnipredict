import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { formatSignedPercent } from "@/lib/analytics/market";
import type { MarketMovementSignal } from "@/types";

interface MovementAlertProps {
  signal?: MarketMovementSignal;
}

export function MovementAlert({ signal }: MovementAlertProps) {
  if (!signal) {
    return (
      <Card>
        <CardTitle>Sharp movement detector</CardTitle>
        <p className="mt-3 text-sm text-zinc-400">No sharp odds movement is currently above the configured threshold.</p>
      </Card>
    );
  }

  return (
    <Card className={signal.explained ? "border-sky-400/30" : "border-amber-400/40 bg-amber-400/5"}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <CardTitle>Sharp movement detector</CardTitle>
        <Badge tone={signal.explained ? "blue" : "amber"}>{signal.label}</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-300">
        {signal.outcome} odds {signal.direction} from {signal.previousOdds.toFixed(2)} to {signal.currentOdds.toFixed(2)}.
        The move equals <span className="font-mono text-white">{formatSignedPercent(signal.deltaPercent)}</span>.
      </p>
    </Card>
  );
}
