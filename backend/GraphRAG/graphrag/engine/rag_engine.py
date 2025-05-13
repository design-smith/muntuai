from ..db.graph_db import Neo4jWrapper
from ..db.vector_db import QdrantWrapper
from ..embeddings.embedding import EmbeddingService

class GraphRAGEngine:
    def __init__(self):
        self.graph_db = Neo4jWrapper()
        self.vector_db = QdrantWrapper()
        self.embedding_service = EmbeddingService()
    
    def index_document(self, document_id: str, content: str, metadata: dict):
        # Generate embedding for the document
        embedding = self.embedding_service.generate_embedding(content)
        
        # Store in vector database
        self.vector_db.upsert_vectors(
            collection_name="documents",
            vectors=[embedding],
            payloads=[{
                "document_id": document_id,
                "content": content,
                **metadata
            }]
        )
        
        # Create document node in graph database
        self.graph_db.create_node(
            label="Document",
            properties={
                "id": document_id,
                **metadata
            }
        )
    
    def query(self, query: str, limit: int = 5):
        # Generate query embedding
        query_embedding = self.embedding_service.generate_embedding(query)
        
        # Search similar documents
        similar_docs = self.vector_db.search_vectors(
            collection_name="documents",
            query_vector=query_embedding,
            limit=limit
        )
        
        return similar_docs 