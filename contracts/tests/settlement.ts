import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import assert from "node:assert/strict";

describe("omnipredict_settlement", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.OmnipredictSettlement as Program;
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const validProofHash = Array.from(Buffer.from("8d4a7e0cb782c14f19a5e3bcd91fae72942d7b32000000000000000000000000", "hex"));

  async function settleMarket(overrides: Partial<{ stake: anchor.BN; oddsBps: anchor.BN; proofHash: number[]; receipt: anchor.web3.Keypair }> = {}) {
    const receipt = anchor.web3.Keypair.generate();
    const txlineOracle = anchor.web3.Keypair.generate().publicKey;
    const txlineProgram = anchor.web3.Keypair.generate().publicKey;
    const escrowVault = anchor.web3.Keypair.generate().publicKey;

    const selectedReceipt = overrides.receipt ?? receipt;
    const rpc = () => program.methods
      .settleMarket(
        "eng-bra",
        "eng-bra-winner",
        "England win",
        overrides.stake ?? new anchor.BN(250_000_000),
        overrides.oddsBps ?? new anchor.BN(17_500),
        overrides.proofHash ?? validProofHash
      )
      .accounts({
        receipt: selectedReceipt.publicKey,
        authority: provider.wallet.publicKey,
        txlineOracle,
        txlineProgram,
        escrowVault,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([selectedReceipt])
      .rpc();

    return { receipt: selectedReceipt, rpc };
  }

  it("settles a valid TxLINE proof receipt", async () => {
    const { receipt, rpc } = await settleMarket();
    await rpc();

    const account = await program.account.settlementReceipt.fetch(receipt.publicKey);
    assert.equal(account.matchId, "eng-bra");
    assert.equal(account.marketId, "eng-bra-winner");
    assert.equal(account.outcome, "England win");
    assert.equal(account.settled, true);
    assert.equal(account.payout.toString(), "437500000");
  });

  it("rejects a zero stake", async () => {
    const { rpc } = await settleMarket({ stake: new anchor.BN(0) });
    await assert.rejects(rpc(), /InvalidStake/);
  });

  it("rejects odds below 1.0", async () => {
    const { rpc } = await settleMarket({ oddsBps: new anchor.BN(9_999) });
    await assert.rejects(rpc(), /InvalidOdds/);
  });

  it("rejects an empty TxLINE proof hash", async () => {
    const { rpc } = await settleMarket({ proofHash: Array(32).fill(0) });
    await assert.rejects(rpc(), /InvalidProof/);
  });

  it("rejects duplicate settlement for an initialized receipt", async () => {
    const duplicateReceipt = anchor.web3.Keypair.generate();
    const first = await settleMarket({ receipt: duplicateReceipt });
    await first.rpc();

    const second = await settleMarket({ receipt: duplicateReceipt });
    await assert.rejects(second.rpc());
  });
});
