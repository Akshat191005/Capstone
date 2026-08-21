import yfinance as yf
from typing import Optional, List, Dict, Any
import re

# Maps ticker → company website domain (for Clearbit logo API)
TICKER_DOMAINS: Dict[str, str] = {
    # Indian stocks
    "RELIANCE.NS": "relianceindustries.com",
    "TCS.NS": "tcs.com",
    "INFY.NS": "infosys.com",
    "WIPRO.NS": "wipro.com",
    "HDFCBANK.NS": "hdfcbank.com",
    "ICICIBANK.NS": "icicibank.com",
    "M&M.NS": "mahindra.com",
    "TATAMOTORS.NS": "tatamotors.com",
    "BAJFINANCE.NS": "bajajfinserv.in",
    "BHARTIARTL.NS": "airtel.in",
    "SBIN.NS": "sbi.co.in",
    "KOTAKBANK.NS": "kotak.com",
    "AXISBANK.NS": "axisbank.com",
    "HCLTECH.NS": "hcltech.com",
    "SUNPHARMA.NS": "sunpharma.com",
    "ONGC.NS": "ongcindia.com",
    "MARUTI.NS": "marutisuzuki.com",
    "LT.NS": "larsentoubro.com",
    "ASIANPAINT.NS": "asianpaints.com",
    "TITAN.NS": "titanworld.com",
    "NESTLEIND.NS": "nestle.in",
    "ITC.NS": "itcportal.com",
    "NTPC.NS": "ntpc.co.in",
    "ADANIENT.NS": "adani.com",
    "ADANIPORTS.NS": "adaniports.com",
    "ZOMATO.NS": "zomato.com",
    "NYKAA.NS": "nykaa.com",
    "DMART.NS": "dmartindia.com",
    # US stocks
    "AAPL": "apple.com",
    "MSFT": "microsoft.com",
    "GOOGL": "google.com",
    "GOOG": "google.com",
    "AMZN": "amazon.com",
    "TSLA": "tesla.com",
    "META": "meta.com",
    "NVDA": "nvidia.com",
    "NFLX": "netflix.com",
    "BRK-B": "berkshirehathaway.com",
    "JPM": "jpmorganchase.com",
    "V": "visa.com",
    "MA": "mastercard.com",
    "JNJ": "jnj.com",
    "WMT": "walmart.com",
    "XOM": "exxonmobil.com",
    "UNH": "unitedhealthgroup.com",
    "PG": "pg.com",
    "HD": "homedepot.com",
    "BAC": "bankofamerica.com",
    "CVX": "chevron.com",
    "LLY": "lilly.com",
    "AVGO": "broadcom.com",
    "ADBE": "adobe.com",
    "CRM": "salesforce.com",
    "AMD": "amd.com",
    "INTC": "intel.com",
    "QCOM": "qualcomm.com",
    "PYPL": "paypal.com",
    "DIS": "thewaltdisneycompany.com",
    "KO": "coca-cola.com",
    "PEP": "pepsico.com",
    "SBUX": "starbucks.com",
    "MCD": "mcdonalds.com",
    "NKE": "nike.com",
    "UBER": "uber.com",
    "ABNB": "airbnb.com",
    "SPOT": "spotify.com",
    "SNAP": "snap.com",
    "ORCL": "oracle.com",
    "IBM": "ibm.com",
    "CSCO": "cisco.com",
    "VZ": "verizon.com",
    "T": "att.com",
    "GS": "goldmansachs.com",
    "MS": "morganstanley.com",
    "GE": "ge.com",
    "BA": "boeing.com",
    "CAT": "caterpillar.com",
    "MMM": "3m.com",
}

# Maps ticker → canonical display name (used in autocomplete)
TICKER_NAMES: Dict[str, str] = {
    "RELIANCE.NS": "Reliance Industries",
    "TCS.NS": "Tata Consultancy Services",
    "INFY.NS": "Infosys",
    "WIPRO.NS": "Wipro",
    "HDFCBANK.NS": "HDFC Bank",
    "ICICIBANK.NS": "ICICI Bank",
    "M&M.NS": "Mahindra & Mahindra",
    "TATAMOTORS.NS": "Tata Motors",
    "BAJFINANCE.NS": "Bajaj Finance",
    "BHARTIARTL.NS": "Bharti Airtel",
    "SBIN.NS": "State Bank of India",
    "KOTAKBANK.NS": "Kotak Mahindra Bank",
    "AXISBANK.NS": "Axis Bank",
    "HCLTECH.NS": "HCL Technologies",
    "SUNPHARMA.NS": "Sun Pharmaceutical",
    "ONGC.NS": "ONGC",
    "MARUTI.NS": "Maruti Suzuki",
    "LT.NS": "Larsen & Toubro",
    "ASIANPAINT.NS": "Asian Paints",
    "TITAN.NS": "Titan Company",
    "NESTLEIND.NS": "Nestle India",
    "ITC.NS": "ITC",
    "POWERGRID.NS": "Power Grid",
    "NTPC.NS": "NTPC",
    "ADANIENT.NS": "Adani Enterprises",
    "ADANIPORTS.NS": "Adani Ports",
    "ZOMATO.NS": "Zomato",
    "PAYTM.NS": "Paytm",
    "NYKAA.NS": "Nykaa",
    "DMART.NS": "Avenue Supermarts (DMart)",
    "AAPL": "Apple Inc.",
    "MSFT": "Microsoft",
    "GOOGL": "Alphabet (Google)",
    "AMZN": "Amazon",
    "TSLA": "Tesla",
    "META": "Meta Platforms",
    "NVDA": "NVIDIA",
    "NFLX": "Netflix",
    "BRK-B": "Berkshire Hathaway",
    "JPM": "JPMorgan Chase",
    "V": "Visa",
    "MA": "Mastercard",
    "JNJ": "Johnson & Johnson",
    "WMT": "Walmart",
    "XOM": "ExxonMobil",
    "UNH": "UnitedHealth Group",
    "PG": "Procter & Gamble",
    "HD": "Home Depot",
    "BAC": "Bank of America",
    "CVX": "Chevron",
    "LLY": "Eli Lilly",
    "AVGO": "Broadcom",
    "ADBE": "Adobe",
    "CRM": "Salesforce",
    "AMD": "Advanced Micro Devices",
    "INTC": "Intel",
    "QCOM": "Qualcomm",
    "PYPL": "PayPal",
    "DIS": "Walt Disney",
    "KO": "Coca-Cola",
    "PEP": "PepsiCo",
    "SBUX": "Starbucks",
    "MCD": "McDonald's",
    "NKE": "Nike",
    "UBER": "Uber",
    "ABNB": "Airbnb",
    "SPOT": "Spotify",
    "SNAP": "Snap",
}

import urllib.parse

def get_logo_url(symbol: str) -> str:
    """
    Return the logo URL for the given ticker.
    For NSE/BSE stocks, it uses the 'indian-listed-company-logos' GitHub repo via jsDelivr.
    For other global stocks, it uses Google S2 Favicons based on domain mapping.
    Falls back to empty string if domain unknown (frontend will show letter avatar).
    """
    if symbol.endswith(".NS"):
        base_ticker = urllib.parse.quote(symbol[:-3])
        return f"https://cdn.jsdelivr.net/gh/dharunashokkumar/indian-listed-company-logos@main/nse/NSE_{base_ticker}.svg"
    elif symbol.endswith(".BO"):
        base_ticker = urllib.parse.quote(symbol[:-3])
        return f"https://cdn.jsdelivr.net/gh/dharunashokkumar/indian-listed-company-logos@main/bse/BSE_{base_ticker}.svg"
    
    domain = TICKER_DOMAINS.get(symbol, "")
    if domain:
        return f"https://www.google.com/s2/favicons?domain={domain}&sz=128"
    return ""

# Common company name → ticker mappings for popular stocks (handles typos/aliases)
KNOWN_ALIASES: Dict[str, str] = {
    # Indian stocks
    "reliance": "RELIANCE.NS",
    "reliance industries": "RELIANCE.NS",
    "tcs": "TCS.NS",
    "tata consultancy": "TCS.NS",
    "tata consultancy services": "TCS.NS",
    "infosys": "INFY.NS",
    "infy": "INFY.NS",
    "wipro": "WIPRO.NS",
    "hdfc": "HDFCBANK.NS",
    "hdfc bank": "HDFCBANK.NS",
    "icici": "ICICIBANK.NS",
    "icici bank": "ICICIBANK.NS",
    "mahindra": "M&M.NS",
    "m&m": "M&M.NS",
    "mahindra and mahindra": "M&M.NS",
    "mahindra & mahindra": "M&M.NS",
    "tata motors": "TATAMOTORS.NS",
    "tatamotors": "TATAMOTORS.NS",
    "bajaj": "BAJFINANCE.NS",
    "bajaj finance": "BAJFINANCE.NS",
    "bharti airtel": "BHARTIARTL.NS",
    "airtel": "BHARTIARTL.NS",
    "sbi": "SBIN.NS",
    "state bank": "SBIN.NS",
    "state bank of india": "SBIN.NS",
    "kotak": "KOTAKBANK.NS",
    "kotak mahindra": "KOTAKBANK.NS",
    "kotak bank": "KOTAKBANK.NS",
    "axis bank": "AXISBANK.NS",
    "axis": "AXISBANK.NS",
    "hcl": "HCLTECH.NS",
    "hcl tech": "HCLTECH.NS",
    "hcl technologies": "HCLTECH.NS",
    "sun pharma": "SUNPHARMA.NS",
    "sun pharmaceutical": "SUNPHARMA.NS",
    "ongc": "ONGC.NS",
    "maruti": "MARUTI.NS",
    "maruti suzuki": "MARUTI.NS",
    "larsen": "LT.NS",
    "l&t": "LT.NS",
    "larsen and toubro": "LT.NS",
    "larsen & toubro": "LT.NS",
    "asian paints": "ASIANPAINT.NS",
    "titan": "TITAN.NS",
    "nestle": "NESTLEIND.NS",
    "nestle india": "NESTLEIND.NS",
    "itc": "ITC.NS",
    "power grid": "POWERGRID.NS",
    "ntpc": "NTPC.NS",
    "adani": "ADANIENT.NS",
    "adani enterprises": "ADANIENT.NS",
    "adani ports": "ADANIPORTS.NS",
    "zomato": "ZOMATO.NS",
    "paytm": "PAYTM.NS",
    "nykaa": "NYKAA.NS",
    "dmart": "DMART.NS",
    "avenue supermarts": "DMART.NS",
    # US stocks
    "apple": "AAPL",
    "microsoft": "MSFT",
    "google": "GOOGL",
    "alphabet": "GOOGL",
    "amazon": "AMZN",
    "tesla": "TSLA",
    "meta": "META",
    "facebook": "META",
    "nvidia": "NVDA",
    "nvda": "NVDA",
    "netflix": "NFLX",
    "berkshire": "BRK-B",
    "berkshire hathaway": "BRK-B",
    "jpmorgan": "JPM",
    "jp morgan": "JPM",
    "visa": "V",
    "mastercard": "MA",
    "johnson & johnson": "JNJ",
    "johnson and johnson": "JNJ",
    "walmart": "WMT",
    "exxon": "XOM",
    "exxon mobil": "XOM",
    "unitedhealth": "UNH",
    "procter": "PG",
    "procter & gamble": "PG",
    "home depot": "HD",
    "bank of america": "BAC",
    "chevron": "CVX",
    "eli lilly": "LLY",
    "broadcom": "AVGO",
    "adobe": "ADBE",
    "salesforce": "CRM",
    "amd": "AMD",
    "advanced micro devices": "AMD",
    "intel": "INTC",
    "qualcomm": "QCOM",
    "paypal": "PYPL",
    "disney": "DIS",
    "coca cola": "KO",
    "pepsi": "PEP",
    "pepsico": "PEP",
    "starbucks": "SBUX",
    "mcdonalds": "MCD",
    "mcdonald's": "MCD",
    "nike": "NKE",
    "uber": "UBER",
    "airbnb": "ABNB",
    "spotify": "SPOT",
    "twitter": "X",
    "snap": "SNAP",
}


def _normalize(text: str) -> str:
    """Lowercase, strip, and collapse whitespace."""
    return re.sub(r"\s+", " ", text.strip().lower())


def resolve_symbol(query: str) -> Optional[str]:
    """
    Given a user query (company name, partial name, typo, or actual ticker),
    return the best-matching yfinance ticker symbol.
    
    Resolution order:
    1. If it already looks like a valid ticker (has data), return as-is
    2. Check the known aliases dictionary
    3. Use yfinance search API to find the best match
    """
    if not query or not query.strip():
        return None

    query = query.strip()
    
    # Step 1: Try as-is (it might already be a valid ticker like "RELIANCE.NS")
    try:
        ticker = yf.Ticker(query.upper())
        hist = ticker.history(period="5d")
        if not hist.empty:
            return query.upper()
    except Exception:
        pass

    # Step 2: Check known aliases (handles "mahindra", "nvidia", etc.)
    normalized = _normalize(query)
    if normalized in KNOWN_ALIASES:
        return KNOWN_ALIASES[normalized]

    # Step 3: Use yfinance search API
    try:
        search_results = yf.Search(query, max_results=5)
        quotes = search_results.quotes
        if quotes:
            # Prefer equities; fall back to first result
            for q in quotes:
                if q.get("typeDisp", "").lower() in ("equity", "etf"):
                    return q["symbol"]
            return quotes[0].get("symbol")
    except Exception as e:
        print(f"[SymbolResolver] yfinance search failed for '{query}': {e}")

    return None


def search_symbols(query: str, max_results: int = 8) -> List[Dict[str, Any]]:
    """
    Return a list of matching symbol suggestions for autocomplete.
    Each result contains: symbol, name, exchange, type, logo_url.
    """
    if not query or len(query.strip()) < 1:
        return []

    results: List[Dict[str, Any]] = []
    seen_tickers: set = set()  # deduplicate by ticker symbol

    def _make_entry(symbol: str, name: str, exchange: str, type_: str) -> Dict[str, Any]:
        # Use canonical name if available, else supplied name
        display_name = TICKER_NAMES.get(symbol, name)
        # Clearbit logo via domain mapping; empty string = frontend shows letter avatar
        logo = get_logo_url(symbol)
        return {
            "symbol": symbol,
            "name": display_name,
            "exchange": exchange,
            "type": type_,
            "logo_url": logo,
        }

    # Check aliases first for instant suggestions
    normalized = _normalize(query)
    for alias, ticker in KNOWN_ALIASES.items():
        if ticker in seen_tickers:
            continue  # skip duplicate tickers
        if normalized in alias or alias.startswith(normalized):
            exchange = "NSE" if ticker.endswith(".NS") else "BSE" if ticker.endswith(".BO") else "NASDAQ/NYSE"
            results.append(_make_entry(ticker, alias.title(), exchange, "Equity"))
            seen_tickers.add(ticker)
            if len(results) >= max_results:
                break

    # Supplement with yfinance search
    try:
        search = yf.Search(query, max_results=max_results)
        quotes = search.quotes
        for q in quotes:
            sym = q.get("symbol", "")
            if not sym or sym in seen_tickers:
                continue
            name = q.get("longname") or q.get("shortname", sym)
            exchange = q.get("exchDisp") or q.get("exchange", "")
            type_ = q.get("typeDisp", "Equity")
            results.append(_make_entry(sym, name, exchange, type_))
            seen_tickers.add(sym)
            if len(results) >= max_results:
                break
    except Exception as e:
        print(f"[SymbolResolver] search_symbols failed for '{query}': {e}")

    return results[:max_results]
