from typing import Any, Dict, List, Optional

class GraphRAGContextBuilder:
    def __init__(self, graph_rag_engine, config: Optional[Dict] = None):
        """
        Initialize the context builder with a reference to the GraphRAG engine and config.
        """
        self.graph_rag_engine = graph_rag_engine
        self.config = config or {}
        self.relevance_threshold = self.config.get("relevance_threshold", 0.7)
        self.max_items = self.config.get("max_items", 10)

    def format_for_agent(self, query: str, user_id: str, agent_type: str) -> Dict[str, Any]:
        """
        Query GraphRAG and format results for agent consumption.
        """
        # Query GraphRAG for context
        results = self.graph_rag_engine.retrieve_with_context(query_text=query, filters={"user_id": user_id})
        # Filter for agent/task relevance
        relevant = self.filter_relevant(results, agent_type)
        # Extract actionable items
        actions = self.extract_actionable_items(relevant)
        # Format summary
        summary = self.format_summary(relevant)
        return {
            "summary": summary,
            "actionable_items": actions,
            "raw": relevant
        }

    def filter_relevant(self, results: Dict[str, Any], agent_type: str) -> Dict[str, Any]:
        """
        Filter results for relevance to the agent/task.
        """
        filtered = {**results}
        # Example: filter by score, type, or agent-specific logic
        if "results" in filtered:
            filtered["results"] = [
                r for r in filtered["results"]
                if r.get("document", {}).get("score", 1.0) >= self.relevance_threshold
            ][:self.max_items]
        # Further filter for agent_type if needed
        # (e.g., only tasks/events for calendar agent)
        return filtered

    def extract_actionable_items(self, results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Extract actionable items (tasks, events, etc.) from results.
        """
        items = []
        for r in results.get("results", []):
            doc = r.get("document", {})
            if doc.get("node_type") in ["Task", "Event"]:
                items.append(doc)
        return items

    def format_summary(self, results: Dict[str, Any]) -> str:
        """
        Format a concise summary for agent consumption.
        """
        summary_lines = []
        for r in results.get("results", []):
            doc = r.get("document", {})
            node_type = doc.get("node_type", "Entity")
            name = doc.get("text") or doc.get("name") or doc.get("title") or "(no title)"
            score = doc.get("score", 1.0)
            summary_lines.append(f"- {node_type}: {name} (score: {score:.2f})")
        return "\n".join(summary_lines) 