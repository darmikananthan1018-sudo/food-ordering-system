from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from auth.security import verify_access_token


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# Get currently logged-in user
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = (
        db.query(User)
        .filter(User.id == int(user_id))
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# Get currently logged-in admin
def get_current_admin(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user