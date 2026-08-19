import numpy as np
import pandas as pd
import scipy.stats as stats

class RiskEngine:
    @staticmethod
    def calculate_metrics(df: pd.DataFrame) -> dict:
        """
        Calculate risk metrics from historical OHLCV data.
        Returns volatility and 95% Value at Risk (VaR).
        """
        if df is None or df.empty or 'Close' not in df:
            return {"volatility_annualized": None, "historical_var_95": None, "parametric_var_95": None, "max_drawdown": None}
            
        # Calculate daily returns
        returns = df['Close'].pct_change().dropna()
        
        if returns.empty:
            return {"volatility_annualized": None, "historical_var_95": None, "parametric_var_95": None, "max_drawdown": None}
            
        # Annualized Volatility (assuming 252 trading days)
        volatility = returns.std() * np.sqrt(252)
        
        # 95% Historical VaR
        # Represents the maximum expected loss at 95% confidence over 1 day
        var_95 = np.percentile(returns, 5)
        
        # 95% Parametric VaR (optional, using normal distribution)
        mean_return = returns.mean()
        std_return = returns.std()
        parametric_var_95 = stats.norm.ppf(0.05, mean_return, std_return)
        
        return {
            "volatility_annualized": float(volatility),
            "historical_var_95": float(var_95),
            "parametric_var_95": float(parametric_var_95),
            "max_drawdown": float(RiskEngine.calculate_max_drawdown(df['Close']))
        }
        
    @staticmethod
    def calculate_max_drawdown(prices: pd.Series) -> float:
        """Calculate the maximum drawdown."""
        rolling_max = prices.cummax()
        drawdown = prices / rolling_max - 1.0
        return drawdown.min()
