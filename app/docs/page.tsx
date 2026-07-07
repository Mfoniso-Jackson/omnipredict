import { Card, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "Current milestone",
    body: "Milestone 2 extends the typed Next.js foundation with a pure analytics engine for implied probability, EV, Kelly sizing, confidence scoring, odds movement detection, and probability history charts."
  },
  {
    title: "Architecture",
    body: "The app is organized into app routes, reusable components, pure analytics utilities, AI insight helpers, a mock TxLINE client, portfolio logic, settlement helpers, shared types, and data fixtures."
  },
  {
    title: "Mock data",
    body: "Mock matches, odds snapshots, and events live in /data. They model score, status, odds, fair probabilities, event hashes, AI insights, positions, and settlement receipts."
  },
  {
    title: "Next milestones",
    body: "Next steps are OpenAI-backed explanation routes, live TxLINE REST/SSE integration, persistence, Solana devnet settlement, and a final polish pass for the demo video."
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
