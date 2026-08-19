import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

interface AgentAnalysis {
  signal: string;
  reasoning: string;
}

interface AnalysisResult {
  symbol: string;
  final_decision: {
    final_signal: string;
    confidence_score: number;
    reasoning: string;
    quant_analysis?: AgentAnalysis;
    fundamental_analysis?: AgentAnalysis;
    sentiment_analysis?: AgentAnalysis;
    risk_analysis?: AgentAnalysis;
  };
  risk_metrics?: Record<string, number | string>;
  sentiment_scores?: Record<string, number | string>;
  is_demo_mode?: boolean;
}

const AGENT_CONFIG = [
  { key: 'quant_analysis',        icon: '📊', name: 'Quant Agent',        color: '#00d4ff' },
  { key: 'fundamental_analysis',  icon: '🔬', name: 'Fundamental Agent',  color: '#7c3aed' },
  { key: 'sentiment_analysis',    icon: '📰', name: 'Sentiment Agent',    color: '#f472b6' },
  { key: 'risk_analysis',         icon: '⚠️', name: 'Risk Agent',         color: '#ffb700' },
];

function SignalTag({ signal }: { signal: string }) {
  const s = signal?.toUpperCase();
  const cls = s === 'BUY' ? 'buy' : s === 'SELL' ? 'sell' : 'hold';
  return <span className={`signal-tag ${cls}`}>{s}</span>;
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="confidence-bar-container">
      <div className="confidence-label">
        <span>Confidence</span>
        <span style={{ color: '#f0f4ff', fontWeight: 700 }}>{pct}%</span>
      </div>
      <div className="confidence-bar-track">
        <div className="confidence-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="results-container">
      <div className="meta-consensus-card glass-card" style={{ height: 260 }}>
        <div className="skeleton" style={{ height: '100%', borderRadius: 20 }} />
      </div>
      <div className="agents-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card agent-card" style={{ height: 160 }}>
            <div className="skeleton" style={{ height: '100%', borderRadius: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  const [searchParams] = useSearchParams();
  const [symbol, setSymbol] = useState(searchParams.get('symbol') || '');
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (sym?: string) => {
    const target = (sym ?? symbol).trim().toUpperCase();
    if (!target) return;
    setSymbol(target);
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const endpoint = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/analyze` : 'http://localhost:8000/api/analyze';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symbol: target,
          provider: provider,
          api_key: apiKey || undefined 
        }),
      });
      if (!response.ok) throw new Error('Analysis failed. Please check the symbol and try again.');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-analyze if symbol comes from URL param
  useEffect(() => {
    const sym = searchParams.get('symbol');
    if (sym) handleAnalyze(sym);
  }, []);

  const signal = result?.final_decision?.final_signal?.toLowerCase() ?? '';

  const QUICK_PICKS = ['RELIANCE.NS', 'TCS.NS', 'AAPL', 'INFY.NS', 'TATAMOTORS.NS'];

  return (
    <div className="page-wrapper">
      <div className="container analyze-page">
        {/* Header */}
        <div className="analyze-header">
          <div className="section-label">AI Consensus Engine</div>
          <h1 className="section-title">Stock Analysis</h1>
          <p className="section-subtitle" style={{ margin: '0 auto 32px', textAlign: 'center' }}>
            Enter any NSE/BSE or global ticker. Five AI agents will debate and reach a consensus in seconds.
          </p>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              id="stock-symbol-input"
              className="input-field"
              type="text"
              placeholder="Enter symbol e.g. RELIANCE.NS, AAPL, TCS.NS"
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              id="analyze-btn"
              className="btn btn-primary"
              onClick={() => handleAnalyze()}
              disabled={loading || !symbol.trim()}
              style={{ whiteSpace: 'nowrap', minWidth: 120 }}
            >
              {loading ? <><span className="spinner" /> Analyzing…</> : '⚡ Analyze'}
            </button>
          </div>
          
          <div className="api-settings" style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '20px auto 0', maxWidth: 600 }}>
            <select 
              className="input-field" 
              style={{ width: 'auto', flex: '0 1 150px' }}
              value={provider}
              onChange={e => setProvider(e.target.value)}
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="gemini">Gemini</option>
            </select>
            <input
              type="password"
              className="input-field"
              placeholder="API Key (Optional, uses server key if blank)"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{ flex: '1 1 300px' }}
            />
          </div>

          <div className="search-hint">
            Quick picks:&nbsp;
            {QUICK_PICKS.map(s => (
              <span key={s} onClick={() => handleAnalyze(s)} style={{ cursor: 'pointer' }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-box">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {result && !loading && (
          <div className="results-container">
            {/* Meta Consensus */}
            <div className="glass-card meta-consensus-card" style={{ position: 'relative' }}>
              {result.is_demo_mode && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: '#ff4d4f', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold' }}>
                  DEMO MODE
                </div>
              )}
              <div className="consensus-label">Meta-Agent Consensus</div>
              <div className="consensus-symbol">📌 {result.symbol}</div>
              <div className={`consensus-signal ${signal}`}>
                {result.final_decision.final_signal?.toUpperCase()}
              </div>
              <ConfidenceBar value={result.final_decision.confidence_score} />
              {result.final_decision.reasoning && (
                <div className="consensus-reasoning">
                  💡 {result.final_decision.reasoning}
                </div>
              )}
            </div>

            {/* Sub-Agents Grid */}
            <div style={{ marginBottom: 12 }}>
              <div className="section-label">Specialist Agent Reports</div>
            </div>
            <div className="agents-grid">
              {AGENT_CONFIG.map(agent => {
                const data = result.final_decision[agent.key as keyof typeof result.final_decision] as AgentAnalysis | undefined;
                return (
                  <div key={agent.key} className="glass-card agent-card">
                    <div className="agent-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="agent-icon">{agent.icon}</span>
                        <span className="agent-name">{agent.name}</span>
                      </div>
                      {data?.signal ? (
                        <SignalTag signal={data.signal} />
                      ) : (
                        <span className="signal-tag hold" style={{ opacity: 0.5 }}>N/A</span>
                      )}
                    </div>
                    <div className="agent-reasoning">
                      {data?.reasoning ?? 'No detailed report from this agent for this analysis.'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Risk Metrics */}
            {result.risk_metrics && Object.keys(result.risk_metrics).length > 0 && (
              <>
                <div style={{ margin: '32px 0 12px' }}>
                  <div className="section-label">Risk Metrics</div>
                </div>
                <div className="metrics-grid">
                  {Object.entries(result.risk_metrics).map(([k, v]) => (
                    <div className="metric-card" key={k}>
                      <div className="metric-value">
                        {typeof v === 'number' ? v.toFixed(3) : String(v)}
                      </div>
                      <div className="metric-label">{k.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Sentiment Breakdown */}
            {result.sentiment_scores && Object.keys(result.sentiment_scores).length > 0 && (
              <>
                <div style={{ margin: '32px 0 12px' }}>
                  <div className="section-label">Sentiment Breakdown</div>
                </div>
                <div className="metrics-grid">
                  {Object.entries(result.sentiment_scores).map(([k, v]) => (
                    <div className="metric-card" key={k}>
                      <div className="metric-value">
                        {typeof v === 'number' ? (v < 1 ? (v * 100).toFixed(1) + '%' : v) : String(v)}
                      </div>
                      <div className="metric-label">{k.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16 }}>
                ⚠️ This is an AI-generated analysis for educational purposes only. Not financial advice.
              </p>
              <Link to="/" className="btn btn-outline">← Back to Home</Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔍</div>
            <p style={{ fontSize: '1rem' }}>Enter a stock symbol above to begin your AI analysis</p>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>© 2026 <span>InvestIQ</span> · For educational purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
}
