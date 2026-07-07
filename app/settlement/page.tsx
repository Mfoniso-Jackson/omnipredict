import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { createPendingReceipt } from "@/lib/settlement/receipts";
import { txlineMockClient } from "@/lib/txline/mockClient";

export default function SettlementPage() {
  const [match] = txlineMockClient.getMatches();
  const [verifiedReceipt] = txlineMockClient.getSettlementReceipts();
  const pendingReceipt = createPendingReceipt(match);
  const receipt = verifiedReceipt ?? pendingReceipt;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Settlement demo</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">TxLINE proof receipt</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          Mock settlement flow showing the receipt data OmniPredict will later verify through TxLINE proofs and Solana devnet logic.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {receipt.validationPath.map((step, index) => (
          <Card key={step}>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Step {index + 1}</p>
            <p className="mt-2 font-semibold text-white">{step}</p>
          </Card>
        ))}
      </section>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <CardTitle>Settlement receipt</CardTitle>
          <Badge tone={receipt.status === "verified" ? "green" : "amber"}>{receipt.status.toUpperCase()}</Badge>
        </div>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <ReceiptItem label="Verified outcome" value={receipt.verifiedOutcome} />
          <ReceiptItem label="Settled asset" value={receipt.settledAsset} />
          <ReceiptItem label="Match ID" value={receipt.matchId} />
          <ReceiptItem label="Market ID" value={receipt.marketId} />
          <ReceiptItem label="Proof hash" value={receipt.proofHash} wide />
        </dl>
      </Card>
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
