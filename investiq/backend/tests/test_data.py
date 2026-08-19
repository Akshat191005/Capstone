import pytest
from app.data.market_data import MarketDataAdapter
from app.data.news_data import NewsDataAdapter

def test_get_historical_data():
    df = MarketDataAdapter.get_historical_data("RELIANCE.NS", period="1mo")
    assert df is not None
    assert not df.empty
    assert "Close" in df.columns

def test_get_fundamentals():
    fundamentals = MarketDataAdapter.get_fundamentals("RELIANCE.NS")
    assert fundamentals is not None
    assert fundamentals.get("symbol") == "RELIANCE.NS"
    assert "marketCap" in fundamentals

def test_get_company_news():
    news = NewsDataAdapter.get_company_news("Reliance Industries", max_results=2)
    assert len(news) > 0
    assert "headline" in news[0]
    assert "url" in news[0]
