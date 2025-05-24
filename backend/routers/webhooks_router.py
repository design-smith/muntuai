import os
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException, Header
from fastapi.responses import JSONResponse
from ..data_services.mongo.user_repository import get_user_by_id
from ..integrations.composio.ingestion_pipeline import process_email_payload

router = APIRouter()

COMPOSIO_WEBHOOK_SECRET = os.getenv("COMPOSIO_WEBHOOK_SECRET")

# Utility to validate HMAC signature
def validate_hmac_signature(request: Request, body: bytes) -> bool:
    signature = request.headers.get("X-Composio-Signature")
    if not signature or not COMPOSIO_WEBHOOK_SECRET:
        return False
    computed = hmac.new(COMPOSIO_WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, computed)

@router.post("/webhooks/email")
async def email_webhook(request: Request, x_composio_signature: str = Header(...)):
    """
    Endpoint to receive new email payloads from Composio.
    Validates HMAC signature and processes the email payload.
    """
    # Shared secret for HMAC validation (replace with your actual secret)
    SHARED_SECRET = "your_shared_secret"

    # Read the raw body of the request
    body = await request.body()

    # Validate HMAC signature
    computed_signature = hmac.new(
        key=SHARED_SECRET.encode(),
        msg=body,
        digestmod=hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(computed_signature, x_composio_signature):
        raise HTTPException(status_code=401, detail="Invalid HMAC signature")

    # Parse the JSON payload
    try:
        payload = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    # Process the email payload
    try:
        process_email_payload(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process email payload: {str(e)}")

    return JSONResponse({"status": "success", "message": "Email payload processed successfully"})