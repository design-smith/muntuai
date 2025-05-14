import uuid
from typing import List, Dict, Any, Optional

from ..db.graph_db import Neo4jWrapper
from ..db.vector_db import QdrantWrapper
from ..embeddings.embedding import EmbeddingService
from .graph_traversal import GraphTraversal

class GraphRAGEngine:
    def __init__(
        self,
        graph_db: Optional[Neo4jWrapper] = None,
        vector_db: Optional[QdrantWrapper] = None,
        embedding_service: Optional[EmbeddingService] = None,
        collection_name: str = "muntu_knowledge",
        similarity_threshold: float = 0.7,
        max_results: int = 10
    ):
        self.graph_db = graph_db or Neo4jWrapper()
        self.vector_db = vector_db or QdrantWrapper()
        self.embedding_service = embedding_service or EmbeddingService()
        self.collection_name = collection_name
        self.similarity_threshold = similarity_threshold
        self.max_results = max_results
        self.graph_traversal = GraphTraversal(self.graph_db)
        self._initialize_collection()

    def _initialize_collection(self) -> None:
        # For simplicity, always try to create the collection (Qdrant will not overwrite if exists)
        sample_embedding = self.embedding_service.model.encode(["Sample text"])[0]
        dimension = len(sample_embedding)
        try:
            self.vector_db.client.recreate_collection(
                collection_name=self.collection_name,
                vectors_config={"size": dimension, "distance": "Cosine"}
            )
        except Exception:
            pass

    def store_document(
        self,
        text: str,
        metadata: Dict[str, Any],
        node_type: str,
        relationships: Optional[List[Dict]] = None
    ) -> str:
        doc_id = str(uuid.uuid4())
        properties = {"id": doc_id, **metadata}
        # Only add text/content if the node type supports it
        if node_type == "Message":
            properties["content"] = text
        elif node_type in ["Document"]:  # Add other types with 'text' property if needed
            properties["text"] = text
        self.graph_db.create_node(node_type, properties)
        if relationships:
            for rel in relationships:
                self.graph_db.create_relationship(
                    from_label=node_type,
                    to_label=rel["target_type"],
                    rel_type=rel["rel_type"],
                    from_props={"id": doc_id},
                    to_props={"id": rel["target_id"]},
                    rel_props=rel.get("properties", {})
                )
        embedding = self.embedding_service.model.encode([text])[0] if text else self.embedding_service.model.encode([metadata.get('name', '')])[0]
        self.vector_db.upsert_embedding(
            collection=self.collection_name,
            id=doc_id,
            vector=embedding,
            payload={
                "text": text,
                "node_type": node_type,
                **metadata
            }
        )
        return doc_id

    def semantic_search(self, query_text: str, filters: Optional[Dict] = None) -> List[Dict]:
        query_embedding = self.embedding_service.model.encode([query_text])[0]
        vector_results = self.vector_db.search_vectors(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=self.max_results
        )
        # Qdrant returns a list of objects with .id and .score
        relevant_results = [
            {"id": r.id, "score": r.score, "payload": r.payload}
            for r in vector_results if r.score >= self.similarity_threshold
        ]
        return relevant_results

    def hybrid_search(
        self,
        query_text: str,
        filters: Optional[Dict] = None,
        max_hops: int = 2
    ) -> Dict[str, Any]:
        vector_results = self.semantic_search(query_text, filters)
        seed_node_ids = [result["id"] for result in vector_results]
        if not seed_node_ids:
            return {"results": [], "context": {"nodes": [], "relationships": []}, "task_context": {}}
        # Use the new graph traversal for context
        graph_context = self.graph_traversal.traverse_from_seeds(
            seed_node_ids=seed_node_ids,
            max_hops=max_hops
        )
        # Get task context for relevant entities
        task_context = {}
        for node in graph_context["nodes"]:
            tasks = self.graph_traversal.find_related_tasks(
                entity_id=node["id"],
                status_filter=["pending", "in_progress"]
            )
            if tasks:
                task_context[node["id"]] = tasks
        combined_results = {
            "results": vector_results,
            "context": graph_context,
            "task_context": task_context
        }
        return combined_results

    def retrieve_with_context(
        self,
        query_text: str,
        filters: Optional[Dict] = None,
        max_hops: int = 2
    ) -> Dict[str, Any]:
        hybrid_results = self.hybrid_search(
            query_text=query_text,
            filters=filters,
            max_hops=max_hops
        )
        formatted_results = self._format_results(hybrid_results)
        return formatted_results

    def _format_results(self, hybrid_results: Dict[str, Any]) -> Dict[str, Any]:
        vector_results = hybrid_results["results"]
        graph_context = hybrid_results["context"]
        node_map = {node["id"]: node for node in graph_context.get("nodes", [])}
        enriched_results = []
        for result in vector_results:
            result_id = result["id"]
            connections = [
                rel for rel in graph_context.get("relationships", [])
                if rel.get("source") == result_id or rel.get("target") == result_id
            ]
            connected_nodes = []
            for conn in connections:
                other_id = conn["target"] if conn["source"] == result_id else conn["source"]
                if other_id in node_map:
                    connected_nodes.append({
                        "node": node_map[other_id],
                        "relationship": conn
                    })
            enriched_results.append({
                "document": result,
                "connections": connected_nodes
            })
        return {
            "results": enriched_results,
            "graph_summary": {
                "total_nodes": len(graph_context.get("nodes", [])),
                "total_relationships": len(graph_context.get("relationships", []))
            }
        } 