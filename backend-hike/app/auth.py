# app/auth.py
import os
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

CLERK_JWKS_URL = os.getenv(
    "CLERK_JWKS_URL",
    "https://<YOUR_CLERK_FRONTEND_API>/.well-known/jwks.json"
)

security = HTTPBearer()
_jwks_cache: dict | None = None


async def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    async with httpx.AsyncClient() as client:
        resp = await client.get(CLERK_JWKS_URL)
        resp.raise_for_status()
        _jwks_cache = resp.json()
    return _jwks_cache


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Validates the Clerk JWT from the Authorization header.
    Returns the clerk_user_id (sub claim) on success.
    Raises 401 on any failure.
    """
    token = credentials.credentials
    try:
        jwks = await _get_jwks()
        # Decode header to find which key to use
        unverified_header = jwt.get_unverified_header(token)
        key_id = unverified_header.get("kid")

        # Find the matching public key from JWKS
        rsa_key = {}
        for key in jwks.get("keys", []):
            if key.get("kid") == key_id:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "n":   key["n"],
                    "e":   key["e"],
                }
                break

        if not rsa_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No matching public key found",
            )

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        clerk_user_id: str = payload.get("sub")
        if not clerk_user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing subject claim",
            )
        return clerk_user_id

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )