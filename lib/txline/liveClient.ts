import type { Match, MatchEvent, Market, OddsHistoryPoint, OddsSnapshot } from "@/types";
import type { TxlineAdapterStatus, TxlineClient } from "@/lib/txline/types";

type LivePayload<T> = T | { data?: T; matches?: T; markets?: T; odds?: T; events?: T; history?: T };

interface LiveTeamPayload {
  id?: string;
  name?: string;
  code?: string;
  flag?: string;
  fifaRank?: number;
  fifa_rank?: number;
}

interface LiveMatchPayload {
  id?: string;
  matchId?: string;
  txlineMatchId?: string;
  txline_match_id?: string;
  competition?: string;
  round?: string;
  kickoffUtc?: string;
  kickoff_utc?: string;
  status?: Match["status"];
  minute?: number;
  homeTeam?: LiveTeamPayload;
  home_team?: LiveTeamPayload;
  awayTeam?: LiveTeamPayload;
  away_team?: LiveTeamPayload;
  score?: { home?: number; away?: number; homeTeam?: number; awayTeam?: number };
  proofHash?: string;
  proof_hash?: string;
}

interface LiveMarketPayload {
  id?: string;
  matchId?: string;
  match_id?: string;
  type?: Market["type"];
  label?: string;
  outcomes?: string[];
}

interface LiveOddsPayload {
  id?: string;
  matchId?: string;
  match_id?: string;
  marketId?: string;
  market_id?: string;
  capturedAt?: string;
  captured_at?: string;
  source?: string;
  odds?: Record<string, number>;
  fairProbability?: Record<string, number>;
  fair_probability?: Record<string, number>;
  confidence?: number;
}

interface LiveEventPayload {
  id?: string;
  matchId?: string;
  match_id?: string;
  minute?: number;
  type?: MatchEvent["type"];
  teamId?: string;
  team_id?: string;
  title?: string;
  description?: string;
  txlineEventHash?: string;
  txline_event_hash?: string;
}

interface LiveHistoryPayload {
  id?: string;
  matchId?: string;
  match_id?: string;
  marketId?: string;
  market_id?: string;
  outcome?: string;
  minute?: number;
  capturedAt?: string;
  captured_at?: string;
  odds?: number;
  modelProbability?: number;
  model_probability?: number;
}

export class TxlineLiveClient implements TxlineClient {
  constructor(
    private readonly apiBase: string,
    private readonly sseUrl?: string
  ) {}

  async getStatus(): Promise<TxlineAdapterStatus> {
    return {
      mode: "live",
      source: "TxLINE Live REST",
      liveEnabled: true,
      apiBase: this.apiBase,
      sseUrl: this.sseUrl,
      lastSyncAt: new Date().toISOString()
    };
  }

  async getMatches() {
    const payload = await this.fetchJson<LivePayload<LiveMatchPayload[]>>("/world-cup/matches");
    return unwrapArray(payload, "matches").map(normalizeMatch);
  }

  async getMatch(id: string) {
    const matches = await this.getMatches();
    return matches.find((match) => match.id === id || match.txlineMatchId === id);
  }

  async getMarketsForMatch(matchId: string) {
    const payload = await this.fetchJson<LivePayload<LiveMarketPayload[]>>(`/world-cup/matches/${matchId}/markets`);
    return unwrapArray(payload, "markets").map((market) => normalizeMarket(market, matchId));
  }

  async getOddsForMatch(matchId: string) {
    const payload = await this.fetchJson<LivePayload<LiveOddsPayload[]>>(`/world-cup/matches/${matchId}/odds`);
    return unwrapArray(payload, "odds").map((snapshot) => normalizeOdds(snapshot, matchId));
  }

  async getOddsHistoryForMatch(matchId: string) {
    const payload = await this.fetchJson<LivePayload<LiveHistoryPayload[]>>(`/world-cup/matches/${matchId}/odds/history`);
    return unwrapArray(payload, "history").map((point) => normalizeHistory(point, matchId));
  }

  async getEventsForMatch(matchId: string) {
    const payload = await this.fetchJson<LivePayload<LiveEventPayload[]>>(`/world-cup/matches/${matchId}/events`);
    return unwrapArray(payload, "events").map((event) => normalizeEvent(event, matchId));
  }

  async getPositions() {
    return [];
  }

  async getSettlementReceipts() {
    return [];
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const headers: HeadersInit = { Accept: "application/json" };
    if (process.env.TXLINE_API_KEY) {
      headers.Authorization = `Bearer ${process.env.TXLINE_API_KEY}`;
    }

    const response = await fetch(new URL(path, this.apiBase), {
      headers,
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      throw new Error(`TxLINE request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}

function unwrapArray<T>(payload: LivePayload<T[]>, key: "matches" | "markets" | "odds" | "events" | "history") {
  if (Array.isArray(payload)) return payload;
  const keyed = payload[key];
  if (Array.isArray(keyed)) return keyed;
  return Array.isArray(payload.data) ? payload.data : [];
}

function normalizeMatch(match: LiveMatchPayload): Match {
  const id = match.id ?? match.matchId ?? match.txlineMatchId ?? match.txline_match_id ?? "unknown-match";
  const homeTeam = normalizeTeam(match.homeTeam ?? match.home_team, "HOME");
  const awayTeam = normalizeTeam(match.awayTeam ?? match.away_team, "AWAY");

  return {
    id,
    competition: match.competition ?? "FIFA World Cup",
    round: match.round ?? "World Cup",
    kickoffUtc: match.kickoffUtc ?? match.kickoff_utc ?? new Date().toISOString(),
    status: match.status ?? "scheduled",
    minute: match.minute ?? 0,
    homeTeam,
    awayTeam,
    score: {
      home: match.score?.home ?? match.score?.homeTeam ?? 0,
      away: match.score?.away ?? match.score?.awayTeam ?? 0
    },
    txlineMatchId: match.txlineMatchId ?? match.txline_match_id ?? id,
    proofHash: match.proofHash ?? match.proof_hash
  };
}

function normalizeTeam(team: LiveTeamPayload | undefined, fallbackCode: string) {
  const code = team?.code ?? fallbackCode;

  return {
    id: team?.id ?? code.toLowerCase(),
    name: team?.name ?? code,
    code,
    flag: team?.flag ?? code,
    fifaRank: team?.fifaRank ?? team?.fifa_rank ?? 99
  };
}

function normalizeMarket(market: LiveMarketPayload, matchId: string): Market {
  const id = market.id ?? `${matchId}-${market.type ?? "winner"}`;

  return {
    id,
    matchId: market.matchId ?? market.match_id ?? matchId,
    type: market.type ?? "winner",
    label: market.label ?? "Match Winner",
    outcomes: market.outcomes ?? []
  };
}

function normalizeOdds(snapshot: LiveOddsPayload, matchId: string): OddsSnapshot {
  const marketId = snapshot.marketId ?? snapshot.market_id ?? `${matchId}-winner`;

  return {
    id: snapshot.id ?? `odds-${marketId}`,
    matchId: snapshot.matchId ?? snapshot.match_id ?? matchId,
    marketId,
    capturedAt: snapshot.capturedAt ?? snapshot.captured_at ?? new Date().toISOString(),
    source: snapshot.source ?? "TxLINE Live",
    odds: snapshot.odds ?? {},
    fairProbability: snapshot.fairProbability ?? snapshot.fair_probability ?? {},
    confidence: snapshot.confidence ?? 0.6
  };
}

function normalizeEvent(event: LiveEventPayload, matchId: string): MatchEvent {
  return {
    id: event.id ?? `event-${matchId}-${event.minute ?? 0}`,
    matchId: event.matchId ?? event.match_id ?? matchId,
    minute: event.minute ?? 0,
    type: event.type ?? "odds_move",
    teamId: event.teamId ?? event.team_id,
    title: event.title ?? "TxLINE event",
    description: event.description ?? "Live TxLINE event payload.",
    txlineEventHash: event.txlineEventHash ?? event.txline_event_hash ?? "pending"
  };
}

function normalizeHistory(point: LiveHistoryPayload, matchId: string): OddsHistoryPoint {
  const marketId = point.marketId ?? point.market_id ?? `${matchId}-winner`;

  return {
    id: point.id ?? `history-${marketId}-${point.minute ?? 0}`,
    matchId: point.matchId ?? point.match_id ?? matchId,
    marketId,
    outcome: point.outcome ?? "Unknown",
    minute: point.minute ?? 0,
    capturedAt: point.capturedAt ?? point.captured_at ?? new Date().toISOString(),
    odds: point.odds ?? 1,
    modelProbability: point.modelProbability ?? point.model_probability ?? 0.5
  };
}
