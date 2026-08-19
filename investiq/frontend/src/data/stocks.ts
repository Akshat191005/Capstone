// Simulated historical price data for popular stocks
// In a real app this would come from the backend
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: string;
  mktCap: string;
  history: { t: string; v: number }[];
}

function generateHistory(base: number, days: number, volatility: number): { t: string; v: number }[] {
  const history = [];
  let price = base * (1 - Math.random() * 0.15);
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    price += (Math.random() - 0.48) * volatility;
    price = Math.max(price, base * 0.7);
    history.push({ t: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), v: Math.round(price * 100) / 100 });
  }
  return history;
}

export const POPULAR_STOCKS: StockData[] = [
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries',
    price: 2987.45,
    change: 42.30,
    changePct: 1.44,
    volume: '8.2M',
    mktCap: '₹20.2T',
    history: generateHistory(2987, 30, 35),
  },
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services',
    price: 4102.80,
    change: -28.60,
    changePct: -0.69,
    volume: '3.1M',
    mktCap: '₹14.9T',
    history: generateHistory(4102, 30, 40),
  },
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank',
    price: 1762.35,
    change: 19.85,
    changePct: 1.14,
    volume: '11.4M',
    mktCap: '₹13.4T',
    history: generateHistory(1762, 30, 20),
  },
  {
    symbol: 'INFY.NS',
    name: 'Infosys Limited',
    price: 1897.60,
    change: -11.20,
    changePct: -0.59,
    volume: '5.7M',
    mktCap: '₹7.9T',
    history: generateHistory(1897, 30, 28),
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 221.73,
    change: 3.12,
    changePct: 1.43,
    volume: '52.3M',
    mktCap: '$3.4T',
    history: generateHistory(221, 30, 3),
  },
  {
    symbol: 'TATAMOTORS.NS',
    name: 'Tata Motors',
    price: 987.15,
    change: -15.45,
    changePct: -1.54,
    volume: '14.8M',
    mktCap: '₹3.6T',
    history: generateHistory(987, 30, 18),
  },
];

export const TICKER_DATA = [
  ...POPULAR_STOCKS,
  { symbol: 'WIPRO.NS', name: 'Wipro', price: 541.20, change: 7.30, changePct: 1.37, volume: '', mktCap: '', history: [] },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', price: 7823.40, change: -62.10, changePct: -0.79, volume: '', mktCap: '', history: [] },
  { symbol: 'MSFT', name: 'Microsoft', price: 418.92, change: 5.44, changePct: 1.32, volume: '', mktCap: '', history: [] },
  { symbol: 'NVDA', name: 'NVIDIA', price: 123.45, change: -1.80, changePct: -1.44, volume: '', mktCap: '', history: [] },
];
