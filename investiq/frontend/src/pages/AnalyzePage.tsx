import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './AnalyzePage.css';

const MOCK_TRENDING = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$189.43', change: '+1.2%', up: true, data: [20, 25, 22, 30, 28, 35, 33, 40, 38, 45] },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$942.10', change: '+3.4%', up: true, data: [10, 15, 25, 20, 35, 40, 50, 60, 55, 70] },
  { symbol: 'RELIANCE.NS', name: 'Reliance Ind.', price: '₹2,930.50', change: '-0.8%', up: false, data: [50, 48, 52, 45, 42, 44, 40, 38, 35, 36] },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$175.22', change: '+2.1%', up: true, data: [30, 28, 32, 35, 34, 38, 37, 42, 45, 44] }
];

function Sparkline({ data, color }: { data: number[], color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 40;
  
  const pts = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return { x, y };
  });

  // Create smooth bezier curve path
  let pathD = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    pathD += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
  }

  // Path for the area (close the path to the bottom)
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  const colorHash = color.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <svg viewBox={`0 -5 ${width} ${height + 15}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${colorHash}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill={`url(#grad-${colorHash})`}
        className="sparkline-area"
      />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
      />
    </svg>
  );
}

interface AgentAnalysis {
  signal: string;
  reasoning: string;
}

interface AnalysisResult {
  symbol: string;
  resolved_symbol: string;
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

interface SymbolSuggestion {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  logo_url?: string;
}

/** Deterministic hue from a string — used for fallback avatar color */
function stringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

function CompanyLogo({ symbol, logoUrl, name }: { symbol: string; logoUrl?: string; name: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hue = stringToHue(symbol);
  const letters = symbol.replace(/\.(NS|BO)$/, '').slice(0, 2);

  if (logoUrl && !imgFailed) {
    return (
      <div style={{
        width: 38, height: 38, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
        background: `hsl(${hue},60%,18%)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src={logoUrl}
          alt={name}
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
        />
      </div>
    );
  }

  // Fallback: coloured letter avatar
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
      background: `linear-gradient(135deg, hsl(${hue},70%,35%), hsl(${(hue+40)%360},70%,25%))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: '0.75rem', color: '#fff', letterSpacing: 0.5,
    }}>
      {letters}
    </div>
  );
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
        <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{pct}%</span>
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

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<SymbolSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:8000/api';

  // Fetch autocomplete suggestions with debounce
  const fetchSuggestions = useCallback((query: string) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    searchDebounceRef.current = setTimeout(async () => {
      setSuggestionLoading(true);
      try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data: SymbolSuggestion[] = await res.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch {
        // Silently ignore autocomplete errors
      } finally {
        setSuggestionLoading(false);
      }
    }, 300);
  }, [API_BASE]);

  const handleInputChange = (val: string) => {
    setSymbol(val);
    fetchSuggestions(val);
  };

  const handleSuggestionClick = (suggestion: SymbolSuggestion) => {
    setSymbol(suggestion.symbol);
    setSuggestions([]);
    setShowSuggestions(false);
    handleAnalyze(suggestion.symbol);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAnalyze = async (sym?: string) => {
    const target = (sym ?? symbol).trim();
    if (!target) return;
    setSymbol(target);
    setShowSuggestions(false);
    setSuggestions([]);
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symbol: target,
          provider: provider,
          api_key: apiKey || undefined 
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Analysis failed. Please check the symbol and try again.');
      }
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

  const QUICK_PICKS = ['RELIANCE.NS', 'TCS.NS', 'AAPL', 'NVIDIA', 'MAHINDRA'];

  return (
    <div className="landing-page analyze-page-light page-wrapper" style={{ paddingTop: 0 }}>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo"><span className="logo-mark">IQ</span>InvestIQ</Link>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
          </div>
        </div>
      </header>

      <div className="container analyze-page" style={{ paddingTop: '64px' }}>
        {/* Header */}
        <div className="analyze-header">
          <div className="section-label">AI Consensus Engine</div>
          <h1 className="section-title">Stock Analysis</h1>
          <p className="section-subtitle" style={{ margin: '0 auto 32px', textAlign: 'center' }}>
            Enter any company name, NSE/BSE ticker, or global stock. Five AI agents will debate and reach a consensus in seconds.
          </p>

          {/* Search Bar with Autocomplete */}
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }} ref={suggestionsRef}>
            <div className="search-bar" style={{ margin: 0 }}>
              <input
                id="stock-symbol-input"
                className="input-field"
                type="text"
                placeholder="e.g. Mahindra, NVIDIA, Reliance, AAPL…"
                value={symbol}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { handleAnalyze(); }
                  if (e.key === 'Escape') { setShowSuggestions(false); }
                }}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                autoComplete="off"
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

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                zIndex: 100,
                boxShadow: 'var(--shadow)',
                backdropFilter: 'blur(24px)',
                overflow: 'hidden',
              }}>
                {suggestions.map((s, i) => (
                  <div
                    key={`${s.symbol}-${i}`}
                    onClick={() => handleSuggestionClick(s)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      cursor: 'pointer',
                      borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--border-soft)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Logo / Avatar */}
                    <CompanyLogo symbol={s.symbol} logoUrl={s.logo_url} name={s.name} />

                    {/* Symbol + Name */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{
                        fontWeight: 700, color: 'var(--terracotta-dark)', fontSize: '0.88rem',
                        letterSpacing: 0.3, whiteSpace: 'nowrap',
                      }}>{s.symbol}</span>
                      <span style={{
                        fontSize: '0.76rem', color: 'var(--muted)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{s.name}</span>
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
                      {s.exchange && (
                        <span style={{
                          fontSize: '0.68rem', color: 'var(--faint)',
                          background: 'var(--border-soft)', padding: '2px 7px',
                          borderRadius: 20, whiteSpace: 'nowrap',
                        }}>{s.exchange}</span>
                      )}
                      <span style={{
                        fontSize: '0.68rem', color: 'var(--faint)',
                        background: 'var(--border)', padding: '2px 7px',
                        borderRadius: 20,
                      }}>{s.type}</span>
                    </div>
                  </div>
                ))}
                {suggestionLoading && (
                  <div style={{ padding: '10px 14px', color: 'var(--faint)', fontSize: '0.82rem' }}>
                    Searching…
                  </div>
                )}
              </div>
            )}
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
              <div className="consensus-symbol">
                📌 {result.resolved_symbol || result.symbol}
                {result.resolved_symbol && result.resolved_symbol !== result.symbol.toUpperCase() && (
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginLeft: 8, fontWeight: 400 }}>
                    (resolved from "{result.symbol}")
                  </span>
                )}
              </div>
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
              <Link to="/" className="btn btn-outline">← Back to Home</Link>
            </div>
          </div>
        )}

        {/* Empty state / Trending overview */}
        {!result && !loading && !error && (
          <div style={{ marginTop: 60, paddingBottom: 60 }}>
            <h3 style={{ color: 'var(--ink)', fontSize: '1.2rem', marginBottom: 20 }}>Trending Markets</h3>
            <div className="agent-grid">
              {MOCK_TRENDING.map((stock) => (
                <div key={stock.symbol} className="agent-card" style={{ cursor: 'pointer', padding: '20px' }} onClick={() => handleAnalyze(stock.symbol)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{stock.symbol}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{stock.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{stock.price}</div>
                      <div style={{ fontSize: '0.85rem', color: stock.up ? 'var(--green)' : 'var(--terracotta)', fontWeight: 600 }}>{stock.change}</div>
                    </div>
                  </div>
                  <div style={{ height: 60, width: '100%' }}>
                    <Sparkline data={stock.data} color={stock.up ? 'var(--green)' : 'var(--terracotta)'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="footer" style={{ borderTop: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--faint)' }}>© 2026 <span>InvestIQ</span></p>
      </footer>
    </div>
  );
}
