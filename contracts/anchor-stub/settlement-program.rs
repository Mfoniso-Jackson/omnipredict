use anchor_lang::prelude::*;

declare_id!("OmniPredict1111111111111111111111111111111");

#[program]
pub mod omnipredict_settlement {
    use super::*;

    pub fn settle_market(
        ctx: Context<SettleMarket>,
        match_id: String,
        market_id: String,
        outcome: String,
        stake: u64,
        odds_bps: u64,
        txline_proof_hash: [u8; 32],
    ) -> Result<()> {
        require!(!ctx.accounts.receipt.settled, SettlementError::AlreadySettled);

        // Production implementation:
        // 1. CPI into TxLINE validate_stat with txline_oracle, txline_program, and proof accounts.
        // 2. Confirm the returned stat maps to the submitted match_id, market_id, and outcome.
        // 3. Release escrowed USDC to the winning claimant.
        let receipt = &mut ctx.accounts.receipt;
        receipt.match_id = match_id;
        receipt.market_id = market_id;
        receipt.outcome = outcome;
        receipt.stake = stake;
        receipt.payout = stake.checked_mul(odds_bps).unwrap().checked_div(10_000).unwrap();
        receipt.txline_proof_hash = txline_proof_hash;
        receipt.status = SettlementStatus::Paid;
        receipt.settled = true;
        receipt.settled_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SettleMarket<'info> {
    #[account(init, payer = authority, space = 8 + SettlementReceipt::MAX_SIZE)]
    pub receipt: Account<'info, SettlementReceipt>,
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: TxLINE oracle account verified by the TxLINE program during validate_stat CPI.
    pub txline_oracle: AccountInfo<'info>,
    /// CHECK: External TxLINE program used for validate_stat CPI in production.
    pub txline_program: AccountInfo<'info>,
    /// CHECK: Escrow vault that will release supported assets such as USDC.
    #[account(mut)]
    pub escrow_vault: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SettlementReceipt {
    pub match_id: String,
    pub market_id: String,
    pub outcome: String,
    pub stake: u64,
    pub payout: u64,
    pub txline_proof_hash: [u8; 32],
    pub status: SettlementStatus,
    pub settled: bool,
    pub settled_at: i64,
}

impl SettlementReceipt {
    pub const MAX_SIZE: usize = 96 + 96 + 64 + 8 + 8 + 32 + 1 + 1 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SettlementStatus {
    Pending,
    Verified,
    Paid,
}

#[error_code]
pub enum SettlementError {
    #[msg("This market has already been settled.")]
    AlreadySettled,
}
