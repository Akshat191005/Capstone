from duckduckgo_search import DDGS
from typing import List, Dict, Any
import datetime

class NewsDataAdapter:
    @staticmethod
    def get_company_news(company_name: str, max_results: int = 10, demo_mode: bool = False) -> List[Dict[str, Any]]:
        """
        Fetch financial news for a given company name.
        """
        if demo_mode:
            return NewsDataAdapter._get_demo_data(company_name)
            
        try:
            with DDGS() as ddgs:
                # Search for recent news using DuckDuckGo
                query = f"{company_name} stock financial news"
                # Evaluate generator to list
                results = list(ddgs.text(query, max_results=max_results))
                
                if not results:
                    print(f"No live results for {company_name}. Falling back to demo mode.")
                    return NewsDataAdapter._get_demo_data(company_name)
                    
                formatted_news = []
                for result in results:
                    formatted_news.append({
                        "headline": result.get("title", ""),
                        "source": "DuckDuckGo Search",
                        "url": result.get("href", ""),
                        "summary": result.get("body", ""),
                        "publication_time": datetime.datetime.now().isoformat()
                    })
                return formatted_news
        except Exception as e:
            print(f"Error fetching news for {company_name}: {e}. Falling back to demo mode.")
            return NewsDataAdapter._get_demo_data(company_name)

    @staticmethod
    def _get_demo_data(company_name: str) -> List[Dict[str, Any]]:
        return [{
            "headline": f"[DEMO MODE] {company_name} quarterly update shows resilience",
            "source": "Demo Dataset",
            "url": "https://demo.investiq.local/news",
            "summary": f"This is mock demo data for {company_name} due to API unavailability.",
            "publication_time": datetime.datetime.now().isoformat()
        }]
