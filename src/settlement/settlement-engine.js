export const SettlementStatus = Object.freeze({
  PENDING: "Pending",
  VERIFIED: "Verified",
  PAID: "Paid"
});

export function createSettlementReceipt(match, { marketSide = "home", asset = "USDC" } = {}) {
  const winningTeam = marketSide === "home" ? match.home : match.away;

  return {
    verifiedOutcome: `${winningTeam} won ${match.score[0]}-${match.score[1]}`,
    proofHash: match.proofHash,
    matchId: match.id,
    marketId: `winner:${match.id}:${marketSide}`,
    asset,
    status: SettlementStatus.PAID,
    validationPath: "TxLINE proof -> validate_stat CPI -> settlement program -> payout"
  };
}

export function canSettle(receipt) {
  return Boolean(receipt.proofHash && receipt.matchId && receipt.marketId);
}
