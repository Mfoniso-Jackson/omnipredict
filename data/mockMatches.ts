import type { Match, Team } from "@/types";

export const teams: Record<string, Team> = {
  england: { id: "england", name: "England", code: "ENG", flag: "ENG", fifaRank: 4 },
  brazil: { id: "brazil", name: "Brazil", code: "BRA", flag: "BRA", fifaRank: 2 },
  argentina: { id: "argentina", name: "Argentina", code: "ARG", flag: "ARG", fifaRank: 1 },
  france: { id: "france", name: "France", code: "FRA", flag: "FRA", fifaRank: 3 },
  usa: { id: "usa", name: "United States", code: "USA", flag: "USA", fifaRank: 11 },
  spain: { id: "spain", name: "Spain", code: "ESP", flag: "ESP", fifaRank: 8 }
};

export const mockMatches: Match[] = [
  {
    id: "eng-bra",
    competition: "FIFA World Cup",
    round: "Quarter-final",
    kickoffUtc: "2026-07-07T20:00:00.000Z",
    status: "live",
    minute: 68,
    homeTeam: teams.england,
    awayTeam: teams.brazil,
    score: { home: 2, away: 1 },
    txlineMatchId: "txline-worldcup-2026-eng-bra",
    proofHash: "0x8d4a7e0cb782c14f19a5e3bcd91fae72942d7b32"
  },
  {
    id: "arg-fra",
    competition: "FIFA World Cup",
    round: "Semi-final",
    kickoffUtc: "2026-07-08T19:00:00.000Z",
    status: "live",
    minute: 44,
    homeTeam: teams.argentina,
    awayTeam: teams.france,
    score: { home: 0, away: 0 },
    txlineMatchId: "txline-worldcup-2026-arg-fra",
    proofHash: "0xa2c349d1d71bcfe5999d8431b772c713a65f900d"
  },
  {
    id: "usa-esp",
    competition: "FIFA World Cup",
    round: "Round of 16",
    kickoffUtc: "2026-07-09T18:00:00.000Z",
    status: "scheduled",
    minute: 0,
    homeTeam: teams.usa,
    awayTeam: teams.spain,
    score: { home: 0, away: 0 },
    txlineMatchId: "txline-worldcup-2026-usa-esp",
    proofHash: "0x55b88ab814db84553c2ab7e800ee3d79d7880026"
  }
];
