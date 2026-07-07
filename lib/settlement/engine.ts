import { createHash } from "crypto";
import type { Match, SettlementProofRequest, SettlementReceipt, SettlementSimulation } from "@/types";

const DEFAULT_AUTHORITY = "OmniPredictKeeper111111111111111111111111111";
const DEFAULT_ORACLE = "TxLINEOracle111111111111111111111111111111111";
const DEFAULT_ESCROW = "OmniPredictEscrow11111111111111111111111111111";

export function createSettlementRequest(match: Match, overrides: Partial<SettlementProofRequest> = {}): SettlementProofRequest {
  const outcome = match.score.home > match.score.away ? `${match.homeTeam.name} win` : match.score.home < match.score.away ? `${match.awayTeam.name} win` : "Draw";

  return {
    matchId: match.id,
    marketId: `${match.id}-winner`,
    outcome,
    proofHash: match.proofHash ?? createProofHash(match.id),
    stake: 250,
    odds: 1.75,
    asset: "USDC",
    walletAddress: DEFAULT_AUTHORITY,
    ...overrides
  };
}

export function simulateSettlement(request: SettlementProofRequest): SettlementSimulation {
  const cluster = getSolanaCluster();
  const programId = process.env.SETTLEMENT_PROGRAM_ID ?? "OmniPredict1111111111111111111111111111111";
  const proofValid = isValidProofHash(request.proofHash);
  const payoutAmount = roundMoney(request.stake * request.odds);
  const txSignature = createDeterministicSignature(request);
  const receiptAddress = createAddress("receipt", request.matchId, request.marketId, request.outcome);

  const receipt: SettlementReceipt = {
    id: `receipt-${request.matchId}-${txSignature.slice(0, 8)}`,
    matchId: request.matchId,
    marketId: request.marketId,
    verifiedOutcome: request.outcome,
    proofHash: request.proofHash,
    status: proofValid ? "paid" : "pending",
    validationPath: ["TxLINE proof", "validate_stat CPI", "settlement program", `${request.asset} payout`],
    settledAsset: request.asset,
    mode: "devnet-ready",
    stake: request.stake,
    odds: request.odds,
    payoutAmount,
    txSignature,
    settledAt: new Date().toISOString(),
    verifier: request.walletAddress ?? DEFAULT_AUTHORITY,
    cluster,
    explorerUrl: createExplorerUrl(txSignature, cluster)
  };

  return {
    request,
    receipt,
    proofValid,
    payoutAmount,
    programId,
    cluster,
    accounts: {
      receipt: receiptAddress,
      authority: request.walletAddress ?? DEFAULT_AUTHORITY,
      txlineOracle: process.env.TXLINE_ORACLE_ACCOUNT ?? DEFAULT_ORACLE,
      escrowVault: process.env.SETTLEMENT_ESCROW_VAULT ?? DEFAULT_ESCROW
    }
  };
}

export function isValidProofHash(proofHash: string) {
  return /^0x[a-fA-F0-9]{16,}$/.test(proofHash);
}

function createProofHash(seed: string) {
  return `0x${createHash("sha256").update(seed).digest("hex")}`;
}

function createDeterministicSignature(request: SettlementProofRequest) {
  return createHash("sha256")
    .update([request.matchId, request.marketId, request.outcome, request.proofHash, request.stake, request.odds].join(":"))
    .digest("hex");
}

function createAddress(...parts: string[]) {
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 44);
}

function createExplorerUrl(signature: string, cluster: SettlementSimulation["cluster"]) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
}

function getSolanaCluster(): SettlementSimulation["cluster"] {
  const cluster = process.env.SOLANA_CLUSTER;
  return cluster === "mainnet-beta" || cluster === "testnet" || cluster === "devnet" ? cluster : "devnet";
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
