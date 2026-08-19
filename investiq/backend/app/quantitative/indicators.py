import pandas as pd

class QuantitativeEngine:
    @staticmethod
    def calculate_indicators(df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate technical indicators from historical OHLCV data.
        Adds SMA, EMA, RSI, MACD to the dataframe.
        """
        if df is None or df.empty or 'Close' not in df:
            return df
            
        result = df.copy()
        close = result['Close']
        
        # Moving Averages
        result['SMA_20'] = close.rolling(window=20).mean()
        result['SMA_50'] = close.rolling(window=50).mean()
        result['EMA_20'] = close.ewm(span=20, adjust=False).mean()
        
        # RSI (Relative Strength Index) using Wilder's Smoothing
        delta = close.diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        avg_gain = gain.ewm(alpha=1/14, min_periods=14, adjust=False).mean()
        avg_loss = loss.ewm(alpha=1/14, min_periods=14, adjust=False).mean()
        rs = avg_gain / avg_loss
        result['RSI_14'] = 100 - (100 / (1 + rs))
        
        # MACD (Moving Average Convergence Divergence)
        ema_12 = close.ewm(span=12, adjust=False).mean()
        ema_26 = close.ewm(span=26, adjust=False).mean()
        result['MACD'] = ema_12 - ema_26
        result['MACD_Signal'] = result['MACD'].ewm(span=9, adjust=False).mean()
        
        return result

    @staticmethod
    def generate_signals(df: pd.DataFrame) -> dict:
        """
        Generate simple quant signals based on current indicators.
        """
        if df is None or df.empty:
            return {"signal": "NEUTRAL", "reason": "No data"}
            
        latest = df.iloc[-1]
        
        bullish_signals = 0
        bearish_signals = 0
        reasons = []
        
        # RSI Check
        if pd.notna(latest.get('RSI_14')):
            if latest['RSI_14'] < 30:
                bullish_signals += 1
                reasons.append("RSI indicates oversold (<30)")
            elif latest['RSI_14'] > 70:
                bearish_signals += 1
                reasons.append("RSI indicates overbought (>70)")
                
        # MACD Check
        if pd.notna(latest.get('MACD')) and pd.notna(latest.get('MACD_Signal')):
            if latest['MACD'] > latest['MACD_Signal']:
                bullish_signals += 1
                reasons.append("MACD is above signal line")
            else:
                bearish_signals += 1
                reasons.append("MACD is below signal line")
                
        # Moving Average Crossover
        if pd.notna(latest.get('SMA_20')) and pd.notna(latest.get('SMA_50')):
            if latest['SMA_20'] > latest['SMA_50']:
                bullish_signals += 1
                reasons.append("Short-term SMA is above long-term SMA (Bullish Trend)")
            else:
                bearish_signals += 1
                reasons.append("Short-term SMA is below long-term SMA (Bearish Trend)")
                
        if bullish_signals > bearish_signals:
            signal = "BUY"
        elif bearish_signals > bullish_signals:
            signal = "SELL"
        else:
            signal = "HOLD"
            reasons.append("Mixed signals, holding neutral.")
            
        return {
            "signal": signal,
            "reasons": reasons,
            "bullish_count": bullish_signals,
            "bearish_count": bearish_signals
        }
