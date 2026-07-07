import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import assert from "node:assert/strict";

describe("omnipredict_settlement", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.OmnipredictSettlement as Program;

  it("settles a valid TxLINE proof receipt", async () => {
    const receipt = anchor.web3.Keypair.generate();
    const txlineOracle = anchor.web3.Keypair.generate().publicKey;
    const txlineProgram = anchor.web3.Keypair.generate().publicKey;
    const escrowVault = anchor.web3.Keypair.generate().publicKey;
    const proofHash = Array.from(Buffer.from("8d4a7e0cb782c14f19a5e3bcd91fae72942d7b32000000000000000000000000", "hex"));

    await program.methods
      .settleMarket("eng-bra", "eng-bra-winner", "England win", new anchor.BN(250_000_000), new anchor.BN(17_500), proofHash)
      .accounts({
        receipt: receipt.publicKey,
        authority: program.provider.publicKey,
        txlineOracle,
        txlineProgram,
        escrowVault,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([receipt])
      .rpc();

    const account = await program.account.settlementReceipt.fetch(receipt.publicKey);
    assert.equal(account.matchId, "eng-bra");
    assert.equal(account.marketId, "eng-bra-winner");
    assert.equal(account.outcome, "England win");
    assert.equal(account.settled, true);
    assert.equal(account.payout.toString(), "437500000");
  });
});
