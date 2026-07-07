use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWxTWqkVg7j1j6x4VJ5L9XQ3o5y");

const BPS_DENOMINATOR: u64 = 10_000;

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
        require!(stake > 0, SettlementError::InvalidStake);
        require!(odds_bps >= BPS_DENOMINATOR, SettlementError::InvalidOdds);
        require!(!match_id.is_empty(), SettlementError::InvalidMarket);
        require!(!market_id.is_empty(), SettlementError::InvalidMarket);
        require!(!outcome.is_empty(), SettlementError::InvalidOutcome);

        // Production CPI hook:
        // invoke TxLINE validate_stat with txline_oracle, txline_program, and proof accounts.
        // The returned stat should map to match_id, market_id, outcome, and txline_proof_hash.
        let payout = stake
            .checked_mul(odds_bps)
            .and_then(|value| value.checked_div(BPS_DENOMINATOR))
            .ok_or(SettlementError::PayoutOverflow)?;

        let receipt = &mut ctx.accounts.receipt;
        receipt.authority = ctx.accounts.authority.key();
        receipt.txline_oracle = ctx.accounts.txline_oracle.key();
        receipt.escrow_vault = ctx.accounts.escrow_vault.key();
        receipt.match_id = match_id;
        receipt.market_id = market_id;
        receipt.outcome = outcome;
        receipt.stake = stake;
        receipt.odds_bps = odds_bps;
        receipt.payout = payout;
        receipt.txline_proof_hash = txline_proof_hash;
        receipt.status = SettlementStatus::Paid;
        receipt.settled = true;
        receipt.settled_at = Clock::get()?.unix_timestamp;

        emit!(MarketSettled {
            receipt: receipt.key(),
            authority: receipt.authority,
            match_id: receipt.match_id.clone(),
            market_id: receipt.market_id.clone(),
            outcome: receipt.outcome.clone(),
            stake,
            payout,
            settled_at: receipt.settled_at,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SettleMarket<'info> {
    #[account(init, payer = authority, space = 8 + SettlementReceipt::MAX_SIZE)]
    pub receipt: Account<'info, SettlementReceipt>,
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: Verified by TxLINE validate_stat CPI in the production implementation.
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
    pub authority: Pubkey,
    pub txline_oracle: Pubkey,
    pub escrow_vault: Pubkey,
    pub match_id: String,
    pub market_id: String,
    pub outcome: String,
    pub stake: u64,
    pub odds_bps: u64,
    pub payout: u64,
    pub txline_proof_hash: [u8; 32],
    pub status: SettlementStatus,
    pub settled: bool,
    pub settled_at: i64,
}

impl SettlementReceipt {
    pub const MAX_MATCH_ID: usize = 96;
    pub const MAX_MARKET_ID: usize = 96;
    pub const MAX_OUTCOME: usize = 64;
    pub const MAX_SIZE: usize = 32
        + 32
        + 32
        + 4
        + Self::MAX_MATCH_ID
        + 4
        + Self::MAX_MARKET_ID
        + 4
        + Self::MAX_OUTCOME
        + 8
        + 8
        + 8
        + 32
        + 1
        + 1
        + 8;
}

#[event]
pub struct MarketSettled {
    pub receipt: Pubkey,
    pub authority: Pubkey,
    pub match_id: String,
    pub market_id: String,
    pub outcome: String,
    pub stake: u64,
    pub payout: u64,
    pub settled_at: i64,
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
    #[msg("Stake must be greater than zero.")]
    InvalidStake,
    #[msg("Odds must be at least 1.0 in basis points.")]
    InvalidOdds,
    #[msg("Market identifiers are required.")]
    InvalidMarket,
    #[msg("Outcome is required.")]
    InvalidOutcome,
    #[msg("Payout calculation overflowed.")]
    PayoutOverflow,
}
