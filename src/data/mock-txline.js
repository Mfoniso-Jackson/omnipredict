export const matches = [
  {
    id: "eng-bra",
    home: "England",
    away: "Brazil",
    group: "Quarter-final",
    status: "Live",
    minute: 68,
    score: [2, 1],
    xg: [1.9, 1.1],
    bankrollDefault: 10000,
    odds: { home: 1.75, draw: 12.5, away: 4.25, over25: 1.58, under25: 2.42 },
    fair: { home: 0.67, draw: 0.07, away: 0.26, over25: 0.69, under25: 0.31 },
    previousOdds: { home: 2.08, draw: 7.6, away: 3.05 },
    sentiment: "Bullish England",
    confidence: 91,
    events: [
      ["12'", "Brazil opened the scoring from a transition chance."],
      ["33'", "England equalized after sustained pressure."],
      ["51'", "Brazil red card. TxLINE event hash captured."],
      ["62'", "England scored. Market home odds compressed sharply."],
      ["67'", "Unexplained away-price drift detected without a matching event."]
    ],
    snapshots: [39, 42, 44, 51, 58, 63, 66, 67],
    proofHash: "0x8d4a7e0cb782c14f19a5e3bcd91fae72942d7b32"
  },
  {
    id: "arg-fra",
    home: "Argentina",
    away: "France",
    group: "Semi-final",
    status: "Live",
    minute: 44,
    score: [0, 0],
    xg: [0.5, 0.7],
    bankrollDefault: 7500,
    odds: { home: 2.9, draw: 2.72, away: 2.62, over25: 2.34, under25: 1.68 },
    fair: { home: 0.33, draw: 0.34, away: 0.33, over25: 0.42, under25: 0.58 },
    previousOdds: { home: 2.65, draw: 2.95, away: 2.88 },
    sentiment: "Balanced, cautious",
    confidence: 76,
    events: [
      ["09'", "France shot saved from high-value zone."],
      ["28'", "Argentina tempo increased; market barely reacted."],
      ["41'", "Draw probability rising as first half closes."]
    ],
    snapshots: [34, 35, 33, 32, 33, 34, 35, 34],
    proofHash: "0xa2c349d1d71bcfe5999d8431b772c713a65f900d"
  },
  {
    id: "usa-esp",
    home: "United States",
    away: "Spain",
    group: "Round of 16",
    status: "Upcoming",
    minute: 0,
    score: [0, 0],
    xg: [0, 0],
    bankrollDefault: 5000,
    odds: { home: 3.65, draw: 3.42, away: 2.05, over25: 1.94, under25: 1.92 },
    fair: { home: 0.29, draw: 0.27, away: 0.44, over25: 0.53, under25: 0.47 },
    previousOdds: { home: 3.9, draw: 3.35, away: 1.96 },
    sentiment: "Spain favorite, USA bid improving",
    confidence: 68,
    events: [
      ["-45'", "Lineups published through TxLINE feed."],
      ["-26'", "USA price shortened after confirmed midfield start."]
    ],
    snapshots: [25, 26, 26, 27, 28, 28, 29, 29],
    proofHash: "0x55b88ab814db84553c2ab7e800ee3d79d7880026"
  }
];

export const positions = [
  { matchId: "eng-bra", market: "England win", stake: 410, odds: 1.75, model: 0.67 },
  { matchId: "arg-fra", market: "Draw", stake: 180, odds: 2.72, model: 0.34 },
  { matchId: "usa-esp", market: "Over 2.5", stake: 125, odds: 1.94, model: 0.53 }
];
