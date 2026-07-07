import { Card, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "Current milestone",
    body: "Milestone 5 adds the settlement engine: TxLINE proof request payloads, deterministic devnet-ready receipt simulation, payout math, account metadata, and a typed /api/settlement route."
  },
  {
    title: "Architecture",
    body: "The app is organized into app routes, reusable components, pure analytics utilities, AI insight helpers, a TxLINE adapter layer, portfolio logic, settlement helpers, shared types, and data fixtures."
  },
  {
    title: "Mock data",
    body: "Mock matches, odds snapshots, and events live in /data. They model score, status, odds, fair probabilities, event hashes, AI insights, positions, and settlement receipts."
  },
  {
    title: "API routes",
    body: "POST /api/insights with a matchId to receive a structured AIInsight object containing title, summary, sentiment, confidence, drivers, risk notes, and recommendation."
  },
  {
    title: "TxLINE routes",
    body: "GET /api/txline/status reports the active adapter mode. GET /api/txline/stream emits a snapshot event with status, matches, odds, and events for SSE-ready demos."
  },
  {
    title: "Settlement route",
    body: "GET /api/settlement returns the default simulated settlement. POST /api/settlement with matchId, outcome, proofHash, stake, odds, and asset to receive a devnet-ready receipt."
  },
  {
    title: "Next milestones",
    body: "Next steps are an Anchor workspace, on-chain tests, real validate_stat CPI wiring, responsive QA, demo video flow, and Vercel deployment."
  }
];

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Technical docs</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">OmniPredict foundation</h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          A judge- and contributor-friendly overview of the current MVP scope.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardTitle>{section.title}</CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{section.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
