import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { POPULAR_STOCKS, TICKER_DATA } from '../data/stocks';

function TickerBar() {
  const items = [...TICKER_DATA, ...TICKER_DATA]; // duplicate for seamless loop
  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {items.map((s, i) => (
          <div className="ticker-item" key={i}>
            <span className="ticker-symbol">{s.symbol}</span>
            <span className="ticker-price">{s.price.toLocaleString()}</span>
            <span className={`ticker-change ${s.changePct >= 0 ? 'up' : 'down'}`}>
              {s.changePct >= 0 ? '▲' : '▼'} {Math.abs(s.changePct).toFixed(2)}%
            </span>
            <span className="ticker-dot" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketCard({ stock }: { stock: typeof POPULAR_STOCKS[0] }) {
  const isUp = stock.changePct >= 0;
  const color = isUp ? '#00e676' : '#ff4444';

  return (
    <div className="glass-card market-card">
      <div className="market-card-header">
        <div>
          <div className="market-card-symbol">{stock.symbol}</div>
          <div className="market-card-name">{stock.name}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="market-card-price">{stock.price.toLocaleString()}</div>
          <div className={`market-card-change ${isUp ? 'up' : 'down'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(stock.changePct).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="market-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stock.history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${stock.symbol.replace('.', '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ background: '#0a0f1a', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '8px', fontSize: '0.75rem', padding: '6px 10px' }}
              labelStyle={{ color: '#8892a4', marginBottom: 2 }}
              itemStyle={{ color: '#f0f4ff', fontWeight: 600 }}
              formatter={(val: number) => [val.toLocaleString(), '']}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${stock.symbol.replace('.', '-')})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="market-card-footer">
        <div>
          <div className="market-card-footer-label">Volume</div>
          <div className="market-card-footer-value">{stock.volume}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="market-card-footer-label">Mkt Cap</div>
          <div className="market-card-footer-value">{stock.mktCap}</div>
        </div>
        <Link to={`/analyze?symbol=${stock.symbol}`} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.78rem' }}>
          Analyze →
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge animate-fade-up">
            <span className="dot" />
            Live Markets · 5 AI Agents Active
          </div>

          <h1 className="hero-title animate-fade-up-delay-1">
            AI-Powered<br />
            <span className="gradient-text">Stock Intelligence</span><br />
            Platform
          </h1>

          <p className="hero-description animate-fade-up-delay-2">
            InvestIQ deploys five specialized AI agents — Quant, Fundamental, Sentiment, Risk, and Meta —
            to deliberate and reach a consensus-driven investment decision for any NSE/BSE or global stock.
          </p>

          <div className="hero-actions animate-fade-up-delay-3">
            <Link to="/analyze" className="btn btn-primary btn-lg">
              ⚡ Analyze a Stock
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg">
              How it Works
            </Link>
          </div>

          <div className="hero-stats animate-fade-up-delay-4">
            {[
              { value: '5', label: 'AI Agents' },
              { value: '10K+', label: 'Stocks Covered' },
              { value: '< 30s', label: 'Analysis Time' },
              { value: 'Real-time', label: 'Market Data' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <TickerBar />

      {/* Market Overview */}
      <section className="market-section">
        <div className="container">
          <div className="section-label">Live Market Overview</div>
          <h2 className="section-title">Popular Stocks</h2>
          <p className="section-subtitle">
            30-day price trends for top Indian and global equities. Click "Analyze" to run a full AI consensus.
          </p>

          <div className="market-grid">
            {POPULAR_STOCKS.map(stock => (
              <MarketCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-label">Why InvestIQ</div>
          <h2 className="section-title">Multi-Agent Architecture</h2>
          <p className="section-subtitle">
            Unlike single-model tools, InvestIQ uses a debate-based consensus system where specialist
            AI agents challenge each other before reaching a final decision.
          </p>

          <div className="features-grid" style={{ marginTop: 48 }}>
            {[
              { icon: '📊', title: 'Quantitative Agent', desc: 'Analyzes RSI, MACD, Bollinger Bands, moving averages and generates technical trading signals.' },
              { icon: '🔬', title: 'Fundamental Agent', desc: 'Evaluates P/E, P/B, EV/EBITDA, debt ratios, cash flow and compares against sector peers.' },
              { icon: '📰', title: 'Sentiment Agent', desc: 'Uses FinBERT NLP model to analyze recent news headlines and quantify market sentiment.' },
              { icon: '⚠️', title: 'Risk Agent', desc: 'Calculates VaR, CVaR, annualized volatility, Sharpe ratio and maximum drawdown metrics.' },
              { icon: '🧠', title: 'Meta Agent', desc: 'Synthesizes all four specialist signals into a weighted consensus with a final confidence score.' },
              { icon: '📈', title: 'Real-time Data', desc: 'Pulls live price feeds, fundamentals, and breaking news from Yahoo Finance and DuckDuckGo.' },
            ].map(f => (
              <div className="glass-card feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 <span>InvestIQ</span> · For educational purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
}
