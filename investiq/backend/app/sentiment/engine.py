from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from typing import List, Dict, Any

class SentimentEngine:
    def __init__(self, model_name: str = "ProsusAI/finbert"):
        """
        Initialize the FinBERT sentiment analysis pipeline.
        This downloads the model on first run if not cached locally.
        """
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
            self.nlp = pipeline("sentiment-analysis", model=self.model, tokenizer=self.tokenizer)
        except Exception as e:
            print(f"Error loading sentiment model: {e}")
            self.nlp = None

    def analyze_news(self, news_articles: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """
        Analyze a list of news articles.
        Expects a list of dicts with a 'title' or 'summary' key.
        """
        if not self.nlp or not news_articles:
            return []

        results = []
        for article in news_articles:
            text = article.get('title', '') + " " + article.get('summary', '')
            text = text.strip()
            
            if not text:
                continue
                
            # FinBERT has max length limits; chunking might be needed for very long texts, 
            # but usually financial news headlines/summaries fit within 512 tokens.
            try:
                sentiment = self.nlp(text[:2000])[0] # Taking first ~2000 chars to be safe
                results.append({
                    "article": article,
                    "sentiment_label": sentiment['label'], # positive, negative, or neutral
                    "sentiment_score": sentiment['score']
                })
            except Exception as e:
                print(f"Error analyzing article: {e}")
                
        return results

    def get_aggregate_sentiment(self, sentiment_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate aggregate sentiment from a list of analyzed articles.
        """
        if not sentiment_results:
            return {"overall_sentiment": "NEUTRAL", "confidence": 0.0, "positive_count": 0, "negative_count": 0, "neutral_count": 0}

        counts = {"positive": 0, "negative": 0, "neutral": 0}
        total_score = 0
        
        for res in sentiment_results:
            label = res['sentiment_label']
            if label in counts:
                counts[label] += 1
            total_score += res['sentiment_score']

        avg_confidence = total_score / len(sentiment_results)
        
        if counts["positive"] > counts["negative"] and counts["positive"] >= counts["neutral"]:
            overall = "POSITIVE"
        elif counts["negative"] > counts["positive"] and counts["negative"] >= counts["neutral"]:
            overall = "NEGATIVE"
        else:
            overall = "NEUTRAL"
            
        return {
            "overall_sentiment": overall,
            "confidence": avg_confidence,
            "positive_count": counts["positive"],
            "negative_count": counts["negative"],
            "neutral_count": counts["neutral"]
        }
