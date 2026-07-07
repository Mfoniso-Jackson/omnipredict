import { NextResponse } from "next/server";
import { txlineClient } from "@/lib/txline/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const [status, matches] = await Promise.all([txlineClient.getStatus(), txlineClient.getMatches()]);

  return NextResponse.json({
    ok: true,
    app: "OmniPredict",
    milestone: 6,
    checks: {
      txline: status.mode,
      ai: process.env.OPENAI_API_KEY ? "openai-ready" : "deterministic-fallback",
      settlement: "devnet-ready-simulation",
      matches: matches.length
    },
    deployment: {
      node: ">=18",
      port: 4173,
      vercelReady: true
    },
    timestamp: new Date().toISOString()
  });
}
