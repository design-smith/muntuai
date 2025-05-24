from fastapi import APIRouter, Request, Query, HTTPException, Depends
from fastapi.responses import JSONResponse
import logging
import traceback
from backend.routers.auth_utils import get_current_user
from backend.data_services.mongo.user_repository import update_user, get_user_by_id

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/integrations", tags=["integrations"])

@router.get("/connect")
async def connect_integration(
    request: Request, 
    provider: str = Query(...), 
    current_user: dict = Depends(get_current_user)
):
    """
    Initiate an OAuth connection for the given provider (e.g., gmail) using Composio.
    Returns a redirect URL for the user to complete the OAuth flow.
    """
    try:
        logger.info(f"🔗 Connect request for provider: {provider}")
        logger.info(f"User: {current_user.get('user_id', 'unknown')}")
        
        user_id = current_user["user_id"]
        
        # Import here to avoid circular imports
        try:
            from backend.integrations.composio.client import ComposioIntegrationClient
        except ImportError as e:
            logger.error(f"Failed to import ComposioIntegrationClient: {e}")
            raise HTTPException(
                status_code=500, 
                detail="Integration service unavailable"
            )
        
        composio_client = ComposioIntegrationClient()
        redirect_url = composio_client.initiate_connection(user_id, provider)
        
        if not redirect_url:
            raise HTTPException(
                status_code=500, 
                detail="Failed to get redirect URL from Composio."
            )
            
        logger.info(f"✅ Generated redirect URL for {provider}")
        return JSONResponse({"redirect_url": redirect_url})
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error in connect_integration: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Integration connection failed: {str(e)}"
        )

@router.get("/callback")
async def composio_callback(
    provider: str = Query(...), 
    connection_id: str = Query(...), 
    current_user: dict = Depends(get_current_user)
):
    """
    Handle Composio's redirect after OAuth. 
    Store the connection_id and provider in the user's MongoDB record.
    """
    try:
        logger.info(f"🔄 Callback for provider: {provider}, connection: {connection_id}")
        
        user_id = current_user["user_id"]
        user = get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prepare integration record
        integration_record = {
            "provider": provider, 
            "connection_id": connection_id,
            "connected_at": "2025-05-23",  # You might want to use datetime here
            "status": "active"
        }
        
        # Update user's composio_integrations array
        composio_integrations = user.get("composio_integrations", [])
        
        # Avoid duplicates
        existing = next(
            (i for i in composio_integrations if i["connection_id"] == connection_id), 
            None
        )
        
        if not existing:
            composio_integrations.append(integration_record)
            update_user(user_id, {"composio_integrations": composio_integrations})
            logger.info(f"✅ Added integration for {provider}")
        else:
            logger.info(f"⚠️ Integration already exists for {provider}")
        
        return JSONResponse({
            "status": "success", 
            "message": f"Connected {provider} account successfully."
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error in callback: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Callback processing failed: {str(e)}"
        )

@router.get("/list")
async def list_integrations(current_user: dict = Depends(get_current_user)):
    """
    List all composio integrations for the current user.
    """
    try:
        logger.info(f"📋 Listing integrations for user: {current_user.get('user_id')}")
        
        user_id = current_user["user_id"]
        user = get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        integrations = user.get("composio_integrations", [])
        logger.info(f"✅ Found {len(integrations)} integrations")
        
        return {"integrations": integrations}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error listing integrations: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to list integrations: {str(e)}"
        )

@router.delete("/{connection_id}")
async def remove_integration(
    connection_id: str, 
    current_user: dict = Depends(get_current_user)
):
    """
    Remove a composio integration by connection_id for the current user.
    """
    try:
        logger.info(f"🗑️ Removing integration: {connection_id}")
        
        user_id = current_user["user_id"]
        user = get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        composio_integrations = user.get("composio_integrations", [])
        original_count = len(composio_integrations)
        
        new_integrations = [
            i for i in composio_integrations 
            if i["connection_id"] != connection_id
        ]
        
        if len(new_integrations) == original_count:
            raise HTTPException(
                status_code=404, 
                detail="Integration not found"
            )
        
        update_user(user_id, {"composio_integrations": new_integrations})
        logger.info(f"✅ Removed integration: {connection_id}")
        
        return {
            "status": "success", 
            "message": f"Removed integration {connection_id}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error removing integration: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to remove integration: {str(e)}"
        )

# Test endpoint for debugging
@router.get("/test")
async def test_integrations():
    """Test endpoint to verify integrations router is working"""
    return {
        "status": "working", 
        "message": "Integrations router is operational",
        "timestamp": "2025-05-23"
    }