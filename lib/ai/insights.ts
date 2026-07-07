import { mockInsights } from "@/data/mockEvents";
import type { AIInsight, Match } from "@/types";

export function getInsightForMatch(match: Match): AIInsight {
  return (
    mockInsights.find((insight) => insight.matchId === match.id) ?? {
      id: `insight-${match.id}`,
      matchId: match.id,
      generatedAt: new Date().toISOString(),
      title: "Market state is being monitored",
      summary:
        "OmniPredict is tracking score, odds, and event movement. No high-conviction inefficiency has been detected in the latest mock snapshot.",
      sentiment: "balanced",
      confidence: 0.64
    }
  );
}
