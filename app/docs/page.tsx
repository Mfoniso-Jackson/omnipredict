import { Card, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "Current milestone",
    body: "Milestone 7 adds the Anchor workspace scaffold: program source, devnet program id wiring, TxLINE validate_stat CPI account shape, receipt event, and contract test skeleton."
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
    title: "Submission assets",
    body: "README, ARCHITECTURE, SUBMISSION, DEMO, DEPLOYMENT, Codespaces config, API routes, and the Anchor-shaped settlement stub are included in the public repo."
  },
  {
    title: "Next milestone",
    body: "Next technical step is installing Anchor/Solana in CI or Codespaces, compiling the program, deploying to devnet, and replacing simulated signatures with real transactions."
  }
];

const endpointExamples = [
  { label: "Health", command: "curl http://127.0.0.1:4173/api/health" },
  { label: "TxLINE status", command: "curl http://127.0.0.1:4173/api/txline/status" },
  { label: "TxLINE stream", command: "curl -N http://127.0.0.1:4173/api/txline/stream" },
  {
    label: "AI insight",
    command:
      "curl -X POST http://127.0.0.1:4173/api/insights -H \"Content-Type: application/json\" -d '{\"matchId\":\"eng-bra\"}'"
  },
  {
    label: "Settlement",
    command:
      "curl -X POST http://127.0.0.1:4173/api/settlement -H \"Content-Type: application/json\" -d '{\"matchId\":\"eng-bra\",\"outcome\":\"England win\",\"proofHash\":\"0x8d4a7e0cb782c14f19a5e3bcd91fae72942d7b32\",\"stake\":250,\"odds\":1.75,\"asset\":\"USDC\"}'"
  }
];

const demoFlow = ["Overview", "Dashboard", "Match Intel", "Portfolio", "Settlement", "Docs"];

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
      <section className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardTitle>Demo flow</CardTitle>
          <div className="mt-5 grid gap-3">
            {demoFlow.map((step, index) => (
              <div className="flex items-center gap-3" key={step}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-emerald-400 font-mono text-sm font-bold text-zinc-950">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-white">{step}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>API smoke tests</CardTitle>
          <div className="mt-5 grid gap-3">
            {endpointExamples.map((example) => (
              <div className="rounded-md border border-white/10 bg-black/30 p-3" key={example.label}>
                <p className="text-xs uppercase tracking-wide text-emerald-300">{example.label}</p>
                <code className="mt-2 block break-words text-xs leading-5 text-zinc-300">{example.command}</code>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
