from qdrant_client import QdrantClient
from qdrant_client.http import models
from ..config import get_settings

class QdrantWrapper:
    def __init__(self):
        settings = get_settings()
        self.client = QdrantClient(
            host=settings.QDRANT_HOST,
            port=settings.QDRANT_PORT
        )
    
    def create_collection(self, collection_name: str, vector_size: int):
        self.client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=vector_size,
                distance=models.Distance.COSINE
            )
        )
    
    def upsert_vectors(self, collection_name: str, vectors: list, payloads: list):
        self.client.upsert(
            collection_name=collection_name,
            points=models.Batch(
                ids=list(range(len(vectors))),
                vectors=vectors,
                payloads=payloads
            )
        )
    
    def search_vectors(self, collection_name: str, query_vector: list, limit: int = 5):
        search_result = self.client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            limit=limit
        )
        return search_result 