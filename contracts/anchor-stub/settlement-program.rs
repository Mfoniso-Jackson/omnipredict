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
        txline_proof_hash: [u8; 32],
    ) -> Result<()> {
        let receipt = &mut ctx.accounts.receipt;
        receipt.match_id = match_id;
        receipt.market_id = market_id;
        receipt.outcome = outcome;
        receipt.txline_proof_hash = txline_proof_hash;
        receipt.status = SettlementStatus::Paid;
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
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SettlementReceipt {
    pub match_id: String,
    pub market_id: String,
    pub outcome: String,
    pub txline_proof_hash: [u8; 32],
    pub status: SettlementStatus,
    pub settled_at: i64,
}

impl SettlementReceipt {
    pub const MAX_SIZE: usize = 96 + 96 + 64 + 32 + 1 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SettlementStatus {
    Pending,
    Verified,
    Paid,
}
