from sentence_transformers import SentenceTransformer
from ..config import get_settings

class EmbeddingService:
    def __init__(self):
        settings = get_settings()
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
    
    def generate_embedding(self, text: str) -> list:
        """
        Generate embedding for a single text input
        """
        return self.model.encode(text).tolist()
    
    def generate_embeddings(self, texts: list[str]) -> list:
        """
        Generate embeddings for multiple text inputs
        """
        return self.model.encode(texts).tolist() 