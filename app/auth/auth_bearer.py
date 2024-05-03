from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json
from .auth_handler import decodeJWT

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True,  condition = {}):
        self.condition = condition
        self.credentials_in_header = False#otherwise expected to be in http only cookie
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def check_credentials_header(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def check_credentials_http_cookie(self, request: Request):
        access_token = json.loads(request.cookies.get("access_token")[6:].replace("'",'"'))["access_token"]#changed to accept access token from httpOnly Cookie
        if not self.verify_jwt(access_token, ignore_expiration=True):#todo dont ignore expiration time
            raise HTTPException(status_code=403, detail="Invalid token or expired token.")
        return access_token

    async def __call__(self, request: Request):
        if self.credentials_in_header:
            return await self.check_credentials_header(request)
        else:
            return self.check_credentials_http_cookie(request)

    def verify_jwt(self, jwtoken: str, ignore_expiration: False) -> bool:
        isTokenValid: bool = False
        try:
            payload = decodeJWT(jwtoken, ignore_expiration = ignore_expiration)
            for k, v in self.condition.items():#if additional e.g. admin required
                assert payload[k] == v
        except:
            payload = None
        if payload:
            isTokenValid = True
        return isTokenValid
