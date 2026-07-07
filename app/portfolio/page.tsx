import { Card, CardTitle } from "@/components/ui/card";
import { formatMoney, formatPercent, formatSignedPercent } from "@/lib/analytics/market";
import { summarizePortfolio } from "@/lib/portfolio/portfolio";
import { txlineClient } from "@/lib/txline/client";

export default async function PortfolioPage() {
  const positions = await txlineClient.getPositions();
  const portfolio = summarizePortfolio(positions);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Simulated portfolio</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Exposure and expected return</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          OmniPredict tracks simulated positions through the same TxLINE adapter boundary used by match intelligence.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Open exposure" value={formatMoney(portfolio.exposure)} />
        <Metric label="Expected return" value={formatMoney(portfolio.expectedReturn)} tone="text-emerald-300" />
        <Metric label="Max payout" value={formatMoney(portfolio.maxPayout)} />
      </section>

      <Card>
        <CardTitle>Mock positions</CardTitle>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="pb-3">Match</th>
                <th className="pb-3">Market</th>
                <th className="pb-3">Outcome</th>
                <th className="pb-3">Stake</th>
                <th className="pb-3">Odds</th>
                <th className="pb-3">Model</th>
                <th className="pb-3">EV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {portfolio.positions.map((position) => (
                <tr key={position.id}>
                  <td className="py-3 text-zinc-400">{position.matchId}</td>
                  <td className="py-3 text-zinc-400">{position.marketId}</td>
                  <td className="py-3 text-white">{position.outcome}</td>
                  <td className="py-3 font-mono">{formatMoney(position.stake)}</td>
                  <td className="py-3 font-mono">{position.odds.toFixed(2)}</td>
                  <td className="py-3 font-mono">{formatPercent(position.modelProbability)}</td>
                  <td className={`py-3 font-mono ${position.expectedValue > 0 ? "text-emerald-300" : "text-red-300"}`}>
                    {formatSignedPercent(position.expectedValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-2 font-mono text-3xl font-bold ${tone}`}>{value}</p>
    </Card>
  );
}
