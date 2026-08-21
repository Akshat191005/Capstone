import { Link } from 'react-router-dom';

const PIPELINE_STEPS = [
  { icon: '📡', name: 'Data Ingestion', desc: 'Yahoo Finance + DuckDuckGo News' },
  { icon: '📊', name: 'Quant Agent', desc: 'Technical Indicators' },
  { icon: '🔬', name: 'Fundamental', desc: 'Valuation & Ratios' },
  { icon: '📰', name: 'Sentiment', desc: 'FinBERT NLP' },
  { icon: '⚠️', name: 'Risk Agent', desc: 'VaR & Volatility' },
  { icon: '🧠', name: 'Meta Agent', desc: 'Consensus Decision' },
];

const AGENTS = [
  {
    icon: '📊',
    name: 'Quantitative Agent',
    desc: 'Ingests OHLCV data and computes RSI, MACD, Bollinger Bands, 50/200-day SMA crossovers, and momentum signals. Outputs a BUY/HOLD/SELL recommendation with detailed technical reasoning.',
    inputs: ['Price History (1Y)', 'Volume', 'OHLCV'],
    output: 'Technical Signal',
  },
  {
    icon: '🔬',
    name: 'Fundamental Agent',
    desc: 'Evaluates company health via P/E ratio, P/B, forward EPS, revenue growth, operating margin, debt-to-equity, return on equity, and dividend yield against sector medians.',
    inputs: ['Market Cap', 'EPS', 'Debt Ratios'],
    output: 'Value Signal',
  },
  {
    icon: '📰',
    name: 'Sentiment Agent',
    desc: 'Fetches the latest 10 news headlines via DuckDuckGo and runs them through the ProsusAI/FinBERT model, a financial-domain BERT fine-tuned on FiQA, Headline, and Financial PhraseBank datasets.',
    inputs: ['News Headlines', 'FinBERT Model'],
    output: 'Sentiment Score',
  },
  {
    icon: '⚠️',
    name: 'Risk Agent',
    desc: 'Computes portfolio risk metrics including Value-at-Risk (VaR 95%/99%), Conditional VaR (CVaR), annualized volatility, Sharpe ratio, and maximum historical drawdown from the 1Y price series.',
    inputs: ['Historical Returns', 'VaR/CVaR'],
    output: 'Risk Classification',
  },
  {
    icon: '🧠',
    name: 'Meta Agent',
    desc: 'Acts as the final deliberation layer. Receives all four specialist signals and their reasoning, then synthesizes a weighted consensus verdict with a confidence score using chain-of-thought prompting via Groq LLM.',
    inputs: ['All 4 Agent Reports'],
    output: 'Final Consensus + Confidence',
  },
];

const TECH_STACK = [
  { icon: '⚛️', name: 'React 19', type: 'Frontend Framework' },
  { icon: '📘', name: 'TypeScript', type: 'Language' },
  { icon: '⚡', name: 'Vite', type: 'Build Tool' },
  { icon: '📈', name: 'Recharts', type: 'Visualization' },
  { icon: '🐍', name: 'FastAPI', type: 'Backend' },
  { icon: '🔗', name: 'LangGraph', type: 'Agent Orchestration' },
  { icon: '🤗', name: 'FinBERT', type: 'NLP Model' },
  { icon: '🚀', name: 'Groq LLM', type: 'AI Inference' },
  { icon: '📊', name: 'yfinance', type: 'Market Data' },
  { icon: '🔍', name: 'DuckDuckGo', type: 'News Search' },
];

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <div className="container about-page">
        {/* Hero */}
        <div className="about-hero animate-fade-up">
          <div className="section-label">Architecture Deep Dive</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            How <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>InvestIQ</span> Works
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            A LangGraph-powered multi-agent deliberation system where five specialized AI agents
            independently analyze a stock, debate their findings, and converge on a consensus decision.
          </p>
        </div>

        {/* Pipeline */}
        <div className="pipeline-section animate-fade-up-delay-1">
          <div className="section-label">System Pipeline</div>
          <h2 className="section-title" style={{ fontSize: '1.8rem' }}>End-to-End Flow</h2>
          <div className="pipeline">
            {PIPELINE_STEPS.map((step, i) => (
              <div className="pipeline-step" key={i}>
                <div className="pipeline-icon">{step.icon}</div>
                <div className="pipeline-step-name">{step.name}</div>
                <div className="pipeline-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Details */}
        <div style={{ marginBottom: 80 }} className="animate-fade-up-delay-2">
          <div className="section-label">Agent Profiles</div>
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 32 }}>The Five Agents</h2>
          <div className="agent-details-grid">
            {AGENTS.map(agent => (
              <div className="glass-card agent-detail-card" key={agent.name}>
                <div className="agent-detail-icon">{agent.icon}</div>
                <div className="agent-detail-name">{agent.name}</div>
                <div className="agent-detail-desc" style={{ marginBottom: 16 }}>{agent.desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
                  {agent.inputs.map(inp => (
                    <span key={inp} style={{
                      fontSize: '0.72rem', padding: '3px 10px',
                      background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)',
                      borderRadius: 20, color: 'var(--accent-cyan)', fontWeight: 600,
                    }}>{inp}</span>
                  ))}
                  <span style={{
                    fontSize: '0.72rem', padding: '3px 10px',
                    background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.15)',
                    borderRadius: 20, color: 'var(--signal-buy)', fontWeight: 600,
                  }}>→ {agent.output}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: 80 }} className="animate-fade-up-delay-3">
          <div className="section-label">Built With</div>
          <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Technology Stack</h2>
          <div className="tech-stack-grid">
            {TECH_STACK.map(tech => (
              <div className="tech-pill" key={tech.name}>
                <span className="tech-pill-icon">{tech.icon}</span>
                <div>
                  <div className="tech-pill-name">{tech.name}</div>
                  <div className="tech-pill-type">{tech.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '24px 0 40px' }} className="animate-fade-up-delay-4">
          <div className="glass-card" style={{ padding: '48px 40px', maxWidth: 560, margin: '0 auto' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>🚀</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Ready to Analyze?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.9rem', lineHeight: 1.65 }}>
              Run the full multi-agent AI pipeline on any NSE, BSE or global stock ticker in under 30 seconds.
            </p>
            <Link to="/analyze" className="btn btn-primary btn-lg">
              ⚡ Start Analysis
            </Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 <span>InvestIQ</span> · For educational purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
}
