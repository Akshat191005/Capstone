import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="landing-page">
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo"><span className="logo-mark">IQ</span>InvestIQ</Link>
          <nav className="nav-links">
            <a href="#agents">Agents</a>
            <a href="#how">How it works</a>
            <a href="#">Pricing</a>
          </nav>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/analyze" className="btn btn-primary">Analyze a stock</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <svg className="doodle doodle-1" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="70" cy="70" r="55" stroke="#DCC9A3" strokeWidth="2" strokeDasharray="1 10" strokeLinecap="round"/>
          </svg>
          <svg className="doodle doodle-2" viewBox="0 0 110 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 50 Q30 10 55 35 T105 20" stroke="#DCC9A3" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>

          <div className="eyebrow"><span className="dot"></span>5 AI agents in session</div>
          <h1>One verdict, reached by agents that don't agree by default</h1>
          <p className="lead">InvestIQ runs Quant, Fundamental, Sentiment, Risk and Meta agents on any stock - each argues its case independently, then a weighted consensus tells you what holds up.</p>
          <div className="hero-ctas">
            <Link to="/analyze" className="btn btn-primary btn-lg">Analyze a stock</Link>
            <div className="trust-badges">
              <div className="b"><span className="ic">📊</span>Live data</div>
              <div className="b"><span className="ic">🔒</span>Bank-grade</div>
              <div className="b"><span className="ic">✅</span>Cited sources</div>
            </div>
          </div>

          <div className="console-wrap">
            <div className="console">
              <div className="console-top">
                <span className="ticker">RELIANCE.NS</span>
                <div className="dots"><span></span><span></span><span></span></div>
              </div>
              <div className="console-body">
                <div className="agents-col">
                  <div className="agent-row">
                    <div className="agent-avatar" style={{background: '#EEEAFB'}}>📊</div>
                    <div className="agent-info"><div className="agent-name">Quant</div><div className="agent-detail">MACD bullish cross</div></div>
                    <div className="agent-signal signal-buy">BUY</div>
                  </div>
                  <div className="agent-row">
                    <div className="agent-avatar" style={{background: '#E4F0FC'}}>🔬</div>
                    <div className="agent-info"><div className="agent-name">Fundamental</div><div className="agent-detail">P/E in line with sector</div></div>
                    <div className="agent-signal signal-hold">HOLD</div>
                  </div>
                  <div className="agent-row">
                    <div className="agent-avatar" style={{background: '#FCE8F1'}}>📰</div>
                    <div className="agent-info"><div className="agent-name">Sentiment</div><div className="agent-detail">Positive news, 30 days</div></div>
                    <div className="agent-signal signal-buy">BUY</div>
                  </div>
                  <div className="agent-row">
                    <div className="agent-avatar" style={{background: '#E1F3EF'}}>⚠️</div>
                    <div className="agent-info"><div className="agent-name">Risk</div><div className="agent-detail">Sharpe 1.4, low drawdown</div></div>
                    <div className="agent-signal signal-buy">BUY</div>
                  </div>
                </div>
                <div className="verdict-col">
                  <div className="verdict-ring"><div className="pct">84%</div></div>
                  <div className="verdict-label">CONSENSUS: BUY</div>
                  <div className="verdict-sub">Weighted by each agent's historical accuracy.</div>
                </div>
              </div>
            </div>
            <div className="float-card">
              <div className="row1"><span className="chk">✓</span>Daily consensus refresh</div>
              <div className="row2">↻ Re-scoring on new headlines</div>
            </div>
          </div>
        </div>
      </section>

      <div className="logos-strip">
        <div className="cap">Signal sources InvestIQ reads in real time</div>
        <div className="logos-row">
          <span>NSE</span><span>BSE</span><span>NASDAQ</span><span>Yahoo Finance</span><span>FinBERT</span>
        </div>
      </div>

      <section id="agents">
        <div className="container">
          <div className="section-head center">
            <div className="tag">Why InvestIQ</div>
            <h2>Five specialists, one resolved argument</h2>
          </div>
          <div className="agent-grid">
            <div className="agent-card"><div className="icon" style={{background: '#EEEAFB'}}>📊</div><h3>Quant</h3><p>Technical signal from RSI, MACD and moving averages.</p></div>
            <div className="agent-card"><div className="icon" style={{background: '#E4F0FC'}}>🔬</div><h3>Fundamental</h3><p>P/E, debt ratios and cash flow vs. sector peers.</p></div>
            <div className="agent-card"><div className="icon" style={{background: '#FCE8F1'}}>📰</div><h3>Sentiment</h3><p>FinBERT reads recent headlines for market mood.</p></div>
            <div className="agent-card"><div className="icon" style={{background: '#E1F3EF'}}>⚠️</div><h3>Risk</h3><p>VaR, volatility, Sharpe ratio and max drawdown.</p></div>
            <div className="agent-card"><div className="icon" style={{background: '#FDECE0'}}>🧠</div><h3>Meta</h3><p>Weighs the four signals into one confidence score.</p></div>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="container">
          <div className="split">
            <div className="split-text">
              <div className="tag">Consensus, not correlation</div>
              <h2>Built to disagree before it agrees</h2>
              <p>Each agent is scored independently before Meta sees the others' output, so a strong chart can't quietly override a weak balance sheet.</p>
              <ul className="check-list">
                <li>Every agent explains its reasoning, not just its signal</li>
                <li>Meta weights each vote by historical accuracy for the sector</li>
                <li>The full deliberation stays attached to every verdict</li>
              </ul>
            </div>
            <div className="split-visual">
              <div className="drift-item"><div className="drift-desc"><span>Quant flags bullish MACD cross</span><span className="drift-tag">confidence 0.71</span></div><span className="drift-badge badge-1">weighted</span></div>
              <div className="drift-item"><div className="drift-desc"><span>Fundamental flags debt ratio</span><span className="drift-tag">confidence 0.63</span></div><span className="drift-badge badge-2">flagged</span></div>
              <div className="drift-item"><div className="drift-desc"><span>Risk caps position size</span><span className="drift-tag">Sharpe 1.4</span></div><span className="drift-badge badge-3">bounded</span></div>
              <div className="drift-item"><div className="drift-desc"><span>Meta resolves to weighted BUY</span><span className="drift-tag">84% confidence</span></div><span className="drift-badge badge-4">final</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="cta-card">
            <h2>Let five agents argue about your next trade before you do</h2>
            <p>Free to start. No credit card required.</p>
            <Link to="/analyze" className="btn btn-primary btn-lg">Analyze a stock</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-bottom">
          <span>© 2026 InvestIQ</span>
          <div className="foot-links">
            <a href="#">Docs</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
