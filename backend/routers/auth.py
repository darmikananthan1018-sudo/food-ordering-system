from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db

from models.user import User
from models.customer import Customer

from schemas.user import (
    UserRegister,
    UserResponse,
    TokenResponse
)

from auth.security import (
    hash_password,
    verify_password,
    create_access_token
)

from utils.dependencies import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# HELPER - CREATE CUSTOMER IF MISSING
# =========================================================

def create_customer_if_missing(
    user: User,
    db: Session
):
    """
    Make sure every Customer user has
    a matching Customer table record.
    """

    # Admin does not need Customer record
    if user.role != "Customer":
        return

    # Check customer using email
    existing_customer = (
        db.query(Customer)
        .filter(
            Customer.email == user.email
        )
        .first()
    )

    # Customer already exists
    if existing_customer:
        return

    # Create missing Customer record
    new_customer = Customer(
        name=user.name,
        email=user.email,
        phone="Not provided",
        address="Not provided"
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    # Check existing user
    existing_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Validate role
    if user.role not in [
        "Customer",
        "Admin"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    # =====================================================
    # CREATE USER
    # =====================================================

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(
            user.password
        ),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # =====================================================
    # CREATE CUSTOMER
    # =====================================================

    create_customer_if_missing(
        new_user,
        db
    )

    return new_user


# =========================================================
# LOGIN
# =========================================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    # Find user
    user = (
        db.query(User)
        .filter(
            User.email == form_data.username
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # =====================================================
    # IMPORTANT
    # =====================================================
    # If old Customer account doesn't have
    # a Customer table record, create it now.
    # =====================================================

    create_customer_if_missing(
        user,
        db
    )

    # =====================================================
    # CREATE JWT
    # =====================================================

    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================================================
# GET CURRENT USER
# =========================================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(
        get_current_user
    )
):
    return current_user