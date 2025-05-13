from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from ..engine.rag_engine import GraphRAGEngine

router = APIRouter()
rag_engine = GraphRAGEngine()

class DocumentInput(BaseModel):
    document_id: str
    content: str
    metadata: Dict[str, Any]

class QueryInput(BaseModel):
    query: str
    limit: int = 5

@router.post("/index")
async def index_document(document: DocumentInput):
    try:
        rag_engine.index_document(
            document_id=document.document_id,
            content=document.content,
            metadata=document.metadata
        )
        return {"status": "success", "message": "Document indexed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
async def query_documents(query_input: QueryInput):
    try:
        results = rag_engine.query(
            query=query_input.query,
            limit=query_input.limit
        )
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 