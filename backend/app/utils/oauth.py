from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")
protected = Annotated[str, Depends(oauth_scheme)]
