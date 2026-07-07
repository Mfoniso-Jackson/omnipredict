import { formatPercent } from "@/lib/analytics/market";

interface OddsHistoryChartProps {
  series: Array<{
    minute: number;
    marketProbability: number;
    modelProbability: number;
  }>;
}

export function OddsHistoryChart({ series }: OddsHistoryChartProps) {
  if (series.length === 0) {
    return <p className="text-sm text-zinc-500">No history available yet.</p>;
  }

  const marketPoints = toPolyline(series.map((point) => point.marketProbability));
  const modelPoints = toPolyline(series.map((point) => point.modelProbability));
  const latest = series[series.length - 1];

  return (
    <div>
      <div className="h-44 rounded-lg border border-white/10 bg-zinc-950 p-3">
        <svg aria-label="Probability history chart" className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline fill="none" points={marketPoints} stroke="rgb(52 211 153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <polyline fill="none" points={modelPoints} stroke="rgb(56 189 248)" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Market {formatPercent(latest.marketProbability)}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          Model {formatPercent(latest.modelProbability)}
        </span>
        <span className="font-mono">Latest {latest.minute}&apos;</span>
      </div>
    </div>
  );
}

function toPolyline(values: number[]): string {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 0.01);

  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      const y = 92 - ((value - min) / range) * 84;
      return `${x},${y}`;
    })
    .join(" ");
}
