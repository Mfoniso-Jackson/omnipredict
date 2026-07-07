import { adapterMode, createTxlineAdapter } from "./src/adapters/txline-adapter.js";
import {
  buildMarketRows,
  expectedValue as ev,
  explainMarketMove as aiInsight,
  formatMoney as fmtMoney,
  formatPercent as fmtPct,
  kellyFraction as kelly,
  movementSeverity,
  normalizeBook,
  summarizePortfolio
} from "./src/analytics/market-engine.js";

const $ = (selector) => document.querySelector(selector);
const txline = createTxlineAdapter(adapterMode);
const matches = await txline.listMatches();
let portfolio = await txline.listPositions();

function setTitle(title) {
  $("#pageTitle").textContent = title;
  document.querySelectorAll(".nav a").forEach((a) => {
    const route = location.hash.replace("#", "") || "/";
    a.classList.toggle("active", route === a.dataset.route || route.startsWith(a.dataset.route + "/"));
  });
}

function matchCard(match) {
  const probs = normalizeBook(match.odds);
  const homeEv = ev(match.fair.home, match.odds.home);
  const sharpMove = movementSeverity(match.previousOdds.home, match.odds.home).isSharp;
  return `
    <article class="card">
      <div class="card-head">
        <span class="tag ${match.status === "Live" ? "green" : "amber"}">${match.status} ${match.minute ? match.minute + "'" : ""}</span>
        <span class="tag ${sharpMove ? "red" : ""}">${sharpMove ? "Sharp movement" : "Normal flow"}</span>
      </div>
      <div class="scoreline">
        <div class="team"><strong>${match.home}</strong><span class="muted">Fair ${fmtPct(match.fair.home)}</span></div>
        <div class="score">${match.score[0]}-${match.score[1]}</div>
        <div class="team"><strong>${match.away}</strong><span class="muted">Fair ${fmtPct(match.fair.away)}</span></div>
      </div>
      <div class="bar" title="Home / Draw / Away implied probabilities">
        <span class="home" style="width:${probs.home * 100}%"></span>
        <span class="draw" style="width:${probs.draw * 100}%"></span>
        <span class="away" style="width:${probs.away * 100}%"></span>
      </div>
      <div class="grid cols-3" style="margin-top:14px">
        <div><span class="label">Market</span><div class="metric small">${fmtPct(probs.home)}</div></div>
        <div><span class="label">Expected Value</span><div class="metric small ${homeEv > 0 ? "green" : "red"}">${(homeEv * 100).toFixed(1)}%</div></div>
        <div><span class="label">Confidence</span><div class="metric small">${match.confidence}%</div></div>
      </div>
      <p style="margin:14px 0">${aiInsight(match)}</p>
      <a class="button" href="#/match/${match.id}">Open Match Intel</a>
    </article>
  `;
}

function sparkline(values, color = "var(--green)") {
  const max = Math.max(...values), min = Math.min(...values);
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 100 - ((v - min) / Math.max(max - min, 1)) * 80 - 10;
    return `${x},${y}`;
  }).join(" ");
  return `<div class="chart"><svg class="spark" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${points}" style="stroke:${color}"></polyline></svg></div>`;
}

function overview() {
  setTitle("OmniPredict");
  return `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Bloomberg Terminal meets GitHub Copilot for prediction markets</span>
        <h2>Explainable World Cup market intelligence.</h2>
        <p>OmniPredict converts TxLINE-style match streams into implied probabilities, AI explanations, fair-value gaps, Kelly sizing, portfolio risk, and a trustless settlement demonstration on Solana devnet.</p>
        <div class="actions">
          <a class="button primary" href="#/dashboard">Open Dashboard</a>
          <a class="button" href="#/settlement">View Settlement Demo</a>
        </div>
      </div>
      <div class="grid">
        ${matchCard(matches[0])}
      </div>
    </section>
  `;
}

function dashboard() {
  setTitle("Market Dashboard");
  const live = matches.filter((m) => m.status === "Live").length;
  return `
    <section class="grid cols-4">
      <div class="card"><span class="label">Live Matches</span><div class="metric">${live}</div></div>
      <div class="card"><span class="label">Positive EV Signals</span><div class="metric green">5</div></div>
      <div class="card"><span class="label">Unexplained Moves</span><div class="metric amber">1</div></div>
      <div class="card"><span class="label">Avg Confidence</span><div class="metric">78%</div></div>
    </section>
    <section class="grid cols-2" style="margin-top:16px">${matches.map(matchCard).join("")}</section>
  `;
}

function matchPage(id) {
  const match = matches.find((m) => m.id === id) || matches[0];
  setTitle(`${match.home} vs ${match.away}`);
  const rows = buildMarketRows(match);
  const sharpHomeMove = movementSeverity(match.previousOdds.home, match.odds.home).isSharp;
  return `
    <div class="split">
      <section class="grid">
        ${matchCard(match)}
        <div class="card">
          <div class="card-head"><h2>Probability Movement</h2><span class="tag">TxLINE SSE simulation</span></div>
          ${sparkline(match.snapshots, "var(--green)")}
        </div>
        <div class="card">
          <h2>AI Explanation Feed</h2>
          <p>${aiInsight(match)}</p>
          <p>The sharp-move detector compares odds deltas against verified match events. The latest ${match.home} move is classified as ${sharpHomeMove ? "partly explained by the red card, with one unexplained residual drift" : "event-aligned"}.</p>
        </div>
        <div class="card">
          <h2>Market Inefficiency Panel</h2>
          <table class="table"><thead><tr><th>Market</th><th>Outcome</th><th>Market Prob</th><th>Model Prob</th><th>EV</th></tr></thead><tbody>
            ${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${fmtPct(r[2])}</td><td>${fmtPct(r[3])}</td><td class="${ev(r[3], r[4]) > 0 ? "green" : "red"}">${(ev(r[3], r[4]) * 100).toFixed(1)}%</td></tr>`).join("")}
          </tbody></table>
        </div>
      </section>
      <aside class="grid">
        <div class="card">
          <h2>Kelly Sizing</h2>
          <label>Bankroll<input id="bankroll" type="number" value="${match.bankrollDefault}"></label>
          <label style="margin-top:10px">Opportunity<select id="kellyMarket">${rows.map((r) => `<option value="${r[3]}|${r[4]}|${r[1]}">${r[1]} at ${r[4]}</option>`).join("")}</select></label>
          <div id="kellyResult" style="margin-top:14px"></div>
          <p>Risk guardrail: OmniPredict caps displayed Kelly allocation at 5% and treats all outputs as simulation only.</p>
        </div>
        <div class="card">
          <h2>Key Events</h2>
          <div class="timeline">${match.events.map((e) => `<div class="event"><time>${e[0]}</time><div>${e[1]}</div></div>`).join("")}</div>
        </div>
        <div class="card receipt">
          <h2>TxLINE Proof</h2>
          <p><strong>Match:</strong> ${match.id}<br><strong>Proof hash:</strong> ${match.proofHash}<br><strong>Status:</strong> Pending settlement</p>
        </div>
      </aside>
    </div>
  `;
}

function portfolioPage() {
  setTitle("Portfolio");
  const { rows, exposure, expectedReturn } = summarizePortfolio(portfolio);
  return `
    <section class="grid cols-4">
      <div class="card"><span class="label">Open Exposure</span><div class="metric">${fmtMoney(exposure)}</div></div>
      <div class="card"><span class="label">Expected Return</span><div class="metric ${expectedReturn > 0 ? "green" : "red"}">${fmtMoney(expectedReturn)}</div></div>
      <div class="card"><span class="label">Worst Case</span><div class="metric red">-${fmtMoney(exposure)}</div></div>
      <div class="card"><span class="label">Simulated P/L</span><div class="metric green">+${fmtMoney(326)}</div></div>
    </section>
    <section class="card" style="margin-top:16px">
      <div class="card-head"><h2>Positions</h2><button class="button" id="addPosition">Add Best Signal</button></div>
      <table class="table"><thead><tr><th>Match</th><th>Market</th><th>Stake</th><th>Odds</th><th>Model</th><th>EV</th><th>Potential Payout</th></tr></thead><tbody>
        ${rows.map((p) => `<tr><td>${p.matchId}</td><td>${p.market}</td><td>${fmtMoney(p.stake)}</td><td>${p.odds}</td><td>${fmtPct(p.model)}</td><td class="${p.evValue > 0 ? "green" : "red"}">${(p.evValue * 100).toFixed(1)}%</td><td>${fmtMoney(p.payout)}</td></tr>`).join("")}
      </tbody></table>
    </section>
  `;
}

function settlementPage() {
  setTitle("Settlement Demo");
  const match = matches[0];
  return `
    <section class="flow">
      <div class="card"><span class="label">Step 1</span><h3>TxLINE Proof</h3><p>Outcome and event stream hash received.</p></div>
      <div class="card"><span class="label">Step 2</span><h3>Validation</h3><p>Merkle proof placeholder verifies final score.</p></div>
      <div class="card"><span class="label">Step 3</span><h3>Settlement Contract</h3><p>Prepared for Anchor/Solana devnet integration.</p></div>
      <div class="card"><span class="label">Step 4</span><h3>Payout</h3><p>Simulated escrow releases to winning side.</p></div>
    </section>
    <section class="card receipt" style="margin-top:16px">
      <div class="card-head"><h2>Settlement Receipt</h2><span class="tag green">Verified → Paid</span></div>
      <table class="table"><tbody>
        <tr><th>Verified Outcome</th><td>${match.home} won ${match.score[0]}-${match.score[1]}</td></tr>
        <tr><th>Proof Hash</th><td>${match.proofHash}</td></tr>
        <tr><th>Match ID</th><td>${match.id}</td></tr>
        <tr><th>Market ID</th><td>winner:${match.id}:home</td></tr>
        <tr><th>Settlement Status</th><td class="green">Paid on simulated Solana devnet receipt</td></tr>
        <tr><th>Devnet Tx</th><td><a class="cyan" href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noreferrer">Open Solana Explorer devnet</a></td></tr>
      </tbody></table>
    </section>
    <section class="card" style="margin-top:16px">
      <h2>Anchor-Ready Contract Shape</h2>
      <pre><code>settle_market(match_id, market_id, outcome, txline_proof_hash)
  verify proof hash against trusted TxLINE oracle account
  mark winning outcome
  release escrow to winning token accounts</code></pre>
    </section>
  `;
}

function docsPage() {
  setTitle("Technical Docs");
  return `
    <section class="grid cols-2">
      <div class="card"><h2>Architecture</h2><p>Static demo frontend with a TxLINE-compatible adapter, market analytics engine, mock SSE tick updates, AI insight generator, portfolio simulator, and settlement receipt module. A production version can swap the adapter for live TxLINE endpoints behind Next.js API routes or FastAPI.</p></div>
      <div class="card"><h2>TxLINE Endpoints Used</h2><p>Mock shapes cover matches, odds snapshots, match events, score updates, red cards, market movements, settlement outcomes, and Merkle proof placeholders. Toggle targets: <strong>MOCK_MODE=true</strong> or <strong>TXLINE_LIVE=true</strong>.</p></div>
      <div class="card"><h2>AI Logic</h2><p>The insight layer accepts structured match state, odds, normalized implied probabilities, fair probabilities, event timeline, and movement deltas. It returns concise explanations, sentiment, overreaction flags, and underpriced outcomes.</p></div>
      <div class="card"><h2>Settlement Flow</h2><p>TxLINE proof hash validates outcome, settlement logic maps proof to market ID, and the simulated Solana devnet receipt demonstrates status, proof hash, match ID, market ID, and payout state.</p></div>
      <div class="card"><h2>Hackathon Feedback</h2><p>OmniPredict prioritizes understanding markets over placing bets: odds explainability, risk sizing, fair value, portfolio exposure, and trustless settlement are surfaced as first-class workflows.</p></div>
      <div class="card"><h2>Next Steps</h2><p>Add real TxLINE credentials, wire an OpenAI API route for richer explanations, persist positions in Supabase or SQLite, and replace the settlement mock with an Anchor program deployed to Solana devnet.</p></div>
    </section>
  `;
}

function render() {
  const route = location.hash.replace("#", "") || "/";
  let html;
  if (route === "/") html = overview();
  else if (route === "/dashboard") html = dashboard();
  else if (route.startsWith("/match/")) html = matchPage(route.split("/").at(-1));
  else if (route === "/portfolio") html = portfolioPage();
  else if (route === "/settlement") html = settlementPage();
  else if (route === "/docs") html = docsPage();
  else html = overview();
  $("#app").innerHTML = html;
  wireInteractions();
}

function wireInteractions() {
  const bankroll = $("#bankroll");
  const select = $("#kellyMarket");
  if (bankroll && select) {
    const update = () => {
      const [prob, odds, name] = select.value.split("|");
      const fraction = kelly(Number(prob), Number(odds));
      $("#kellyResult").innerHTML = `<span class="label">${name} allocation</span><div class="metric green">${(fraction * 100).toFixed(1)}%</div><p>Suggested simulated stake: ${fmtMoney(Number(bankroll.value || 0) * fraction)}</p>`;
    };
    bankroll.addEventListener("input", update);
    select.addEventListener("change", update);
    update();
  }
  const add = $("#addPosition");
  if (add) {
    add.addEventListener("click", () => {
      portfolio.push({ matchId: "eng-bra", market: "England win", stake: 250, odds: 1.75, model: .67 });
      render();
    });
  }
}

function tick() {
  const now = new Date();
  $("#clock").textContent = `TxLINE stream ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

window.addEventListener("hashchange", render);
tick();
setInterval(tick, 1000);
render();
