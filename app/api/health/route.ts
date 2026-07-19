import { NextResponse } from "next/server";
import { appUrl } from "@/lib/config";
import { txlineClient } from "@/lib/txline/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const [status, matches] = await Promise.all([txlineClient.getStatus(), txlineClient.getMatches()]);

  return NextResponse.json({
    ok: true,
    app: "OmniPredict",
    milestone: 8,
    checks: {
      txline: status.mode,
      ai: process.env.OPENAI_API_KEY ? "openai-ready" : "deterministic-fallback",
      settlement: "anchor-toolchain-ready",
      matches: matches.length
    },
    deployment: {
      appUrl,
      domain: "omnipredict.network",
      node: ">=18",
      port: 4173,
      vercelReady: true
    },
    timestamp: new Date().toISOString()
  });
}
