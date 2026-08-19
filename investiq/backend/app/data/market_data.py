import yfinance as yf
import pandas as pd
from typing import Dict, Any, Optional

class MarketDataAdapter:
    @staticmethod
    def get_historical_data(symbol: str, period: str = "1y", interval: str = "1d") -> Optional[pd.DataFrame]:
        """
        Fetch historical OHLCV data for a given symbol (e.g., 'RELIANCE.NS').
        """
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=period, interval=interval)
            if df.empty:
                return None
            return df
        except Exception as e:
            print(f"Error fetching historical data for {symbol}: {e}")
            return None

    @staticmethod
    def get_fundamentals(symbol: str) -> Dict[str, Any]:
        """
        Fetch fundamental data for a given symbol.
        """
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            return {
                "symbol": symbol,
                "marketCap": info.get("marketCap"),
                "trailingPE": info.get("trailingPE"),
                "forwardPE": info.get("forwardPE"),
                "priceToBook": info.get("priceToBook"),
                "debtToEquity": info.get("debtToEquity"),
                "freeCashflow": info.get("freeCashflow"),
                "operatingMargins": info.get("operatingMargins"),
                "returnOnEquity": info.get("returnOnEquity"),
                "dividendYield": info.get("dividendYield"),
            }
        except Exception as e:
            print(f"Error fetching fundamental data for {symbol}: {e}")
            return {}
