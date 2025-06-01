from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError, JWTClaimsError, JWSError, JWSAlgorithmError
import os

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
SUPABASE_JWT_ALG = os.getenv("SUPABASE_JWT_ALG", "HS256")

# Supabase JWTs for authenticated users typically have an audience of "authenticated"
SUPABASE_AUDIENCE = os.getenv("SUPABASE_AUDIENCE", "authenticated") 


# Basic validation for essential environment variables
if not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET environment variable is not set.")
if not SUPABASE_JWT_ALG:
    raise ValueError("SUPABASE_JWT_ALG environment variable is not set.")

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to get the current authenticated user from a JWT.

    Raises:
        HTTPException:
            - 401 Unauthorized if the token is missing, invalid, expired,
              or has incorrect claims (including audience).
    """
    token = credentials.credentials
    print(f"Attempting to decode JWT: {token[:30]}...") 
    
    try:
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=[SUPABASE_JWT_ALG],
            audience=SUPABASE_AUDIENCE # <--- ADD THIS LINE!
        )
        
        user_id = payload.get("sub")
        
        if not user_id:
            print("JWT payload missing 'sub' claim.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials: Missing user identifier."
            )
        
        print(f"Decoded payload for user_id: {user_id}")
        
        return {"user_id": user_id, "user": payload}
    except JWTError as e:
        print(f"We have an error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials."
        )