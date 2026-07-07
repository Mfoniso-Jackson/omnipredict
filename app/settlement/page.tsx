import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/analytics/market";
import { createSettlementRequest, simulateSettlement } from "@/lib/settlement/engine";
import { txlineClient } from "@/lib/txline/client";

export default async function SettlementPage() {
  const [matches, existingReceipts] = await Promise.all([txlineClient.getMatches(), txlineClient.getSettlementReceipts()]);
  const [match] = matches;

  if (!match) {
    return (
      <Card>
        <CardTitle>Settlement receipt unavailable</CardTitle>
        <p className="mt-3 text-sm text-zinc-400">No match data is available from the active TxLINE adapter.</p>
      </Card>
    );
  }

  const request = createSettlementRequest(match);
  const simulation = simulateSettlement(request);
  const receipt = simulation.receipt;
  const [existingReceipt] = existingReceipts;
  const displayReceipt = existingReceipt ?? receipt;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Settlement engine</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Devnet-ready proof receipt</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          OmniPredict simulates the TxLINE proof validation and Solana payout path with the same receipt contract shape a
          devnet Anchor program will emit.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="green">{simulation.cluster.toUpperCase()}</Badge>
          <Badge tone={simulation.proofValid ? "green" : "amber"}>{simulation.proofValid ? "PROOF VALID" : "PROOF PENDING"}</Badge>
          <Badge tone="blue">{displayReceipt.mode ?? "simulated"}</Badge>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {displayReceipt.validationPath.map((step, index) => (
          <Card key={step}>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Step {index + 1}</p>
            <p className="mt-2 font-semibold text-white">{step}</p>
          </Card>
        ))}
      </section>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <CardTitle>Settlement receipt</CardTitle>
          <Badge tone={displayReceipt.status === "paid" || displayReceipt.status === "verified" ? "green" : "amber"}>
            {displayReceipt.status.toUpperCase()}
          </Badge>
        </div>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <ReceiptItem label="Verified outcome" value={displayReceipt.verifiedOutcome} />
          <ReceiptItem label="Settled asset" value={displayReceipt.settledAsset} />
          <ReceiptItem label="Payout" value={formatMoney(displayReceipt.payoutAmount ?? simulation.payoutAmount)} />
          <ReceiptItem label="Program ID" value={simulation.programId} />
          <ReceiptItem label="Match ID" value={displayReceipt.matchId} />
          <ReceiptItem label="Market ID" value={displayReceipt.marketId} />
          <ReceiptItem label="Proof hash" value={displayReceipt.proofHash} wide />
          <ReceiptItem label="Transaction signature" value={displayReceipt.txSignature ?? simulation.receipt.txSignature ?? "pending"} wide />
        </dl>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardTitle>Settlement accounts</CardTitle>
          <dl className="mt-6 grid gap-4">
            <ReceiptItem label="Receipt PDA" value={simulation.accounts.receipt} />
            <ReceiptItem label="Authority" value={simulation.accounts.authority} />
            <ReceiptItem label="TxLINE oracle" value={simulation.accounts.txlineOracle} />
            <ReceiptItem label="Escrow vault" value={simulation.accounts.escrowVault} />
          </dl>
        </Card>

        <Card>
          <CardTitle>API payload</CardTitle>
          <pre className="mt-5 overflow-x-auto rounded-md border border-white/10 bg-black/30 p-4 text-xs leading-6 text-zinc-300">
            {JSON.stringify(request, null, 2)}
          </pre>
        </Card>
      </section>
    </div>
  );
}

function ReceiptItem({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2" : undefined}>
      <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 break-words font-mono text-sm text-white">{value}</dd>
    </div>
  );
}
