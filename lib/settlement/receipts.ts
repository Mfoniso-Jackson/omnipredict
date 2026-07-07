import type { Match, SettlementReceipt } from "@/types";

export function createPendingReceipt(match: Match): SettlementReceipt {
  return {
    id: `receipt-${match.id}`,
    matchId: match.id,
    marketId: `${match.id}-winner`,
    verifiedOutcome: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    proofHash: match.proofHash ?? "pending-proof",
    status: "pending",
    validationPath: ["TxLINE proof", "validate_stat CPI", "settlement program", "payout"],
    settledAsset: "SIMULATED"
  };
}
