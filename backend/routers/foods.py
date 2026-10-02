from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.food import Food
from models.category import Category
from models.user import User
from schemas.food import FoodCreate, FoodResponse
from utils.dependencies import get_current_admin

router = APIRouter(
    prefix="/foods",
    tags=["Foods"]
)


# CREATE FOOD - ADMIN ONLY
@router.post("/", response_model=FoodResponse)
def create_food(
    food: FoodCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    category = (
        db.query(Category)
        .filter(Category.id == food.category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    new_food = Food(
        name=food.name,
        description=food.description,
        price=food.price,
        image=food.image,
        is_available=food.is_available,
        category_id=food.category_id
    )

    db.add(new_food)
    db.commit()
    db.refresh(new_food)

    return new_food


# GET FOODS
@router.get("/", response_model=list[FoodResponse])
def get_foods(
    search: str | None = None,
    category_id: int | None = None,
    is_available: bool | None = None,
    page: int = 1,
    limit: int = 10,
    sort: str | None = None,
    order: str = "asc",
    db: Session = Depends(get_db)
):
    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page must be greater than 0"
        )

    if limit < 1:
        raise HTTPException(
            status_code=400,
            detail="Limit must be greater than 0"
        )

    if order not in ["asc", "desc"]:
        raise HTTPException(
            status_code=400,
            detail="Order must be asc or desc"
        )

    query = db.query(Food)

    # SEARCH
    if search:
        query = query.filter(
            (Food.name.ilike(f"%{search}%")) |
            (Food.description.ilike(f"%{search}%"))
        )

    # CATEGORY FILTER
    if category_id is not None:
        query = query.filter(
            Food.category_id == category_id
        )

    # AVAILABILITY FILTER
    if is_available is not None:
        query = query.filter(
            Food.is_available == is_available
        )

    # SORTING
    if sort:
        if sort == "price":
            sort_column = Food.price

        elif sort == "name":
            sort_column = Food.name

        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid sort field. Use price or name"
            )

        if order == "desc":
            query = query.order_by(
                sort_column.desc()
            )
        else:
            query = query.order_by(
                sort_column.asc()
            )

    # PAGINATION
    offset = (page - 1) * limit

    foods = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return foods


# GET FOOD BY ID
@router.get(
    "/{food_id}",
    response_model=FoodResponse
)
def get_food(
    food_id: int,
    db: Session = Depends(get_db)
):
    food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    return food


# UPDATE FOOD - ADMIN ONLY
@router.put(
    "/{food_id}",
    response_model=FoodResponse
)
def update_food(
    food_id: int,
    food: FoodCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    existing_food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not existing_food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    category = (
        db.query(Category)
        .filter(Category.id == food.category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    existing_food.name = food.name
    existing_food.description = food.description
    existing_food.price = food.price
    existing_food.image = food.image
    existing_food.is_available = food.is_available
    existing_food.category_id = food.category_id

    db.commit()
    db.refresh(existing_food)

    return existing_food


# DELETE FOOD - ADMIN ONLY
@router.delete("/{food_id}")
def delete_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    existing_food = (
        db.query(Food)
        .filter(Food.id == food_id)
        .first()
    )

    if not existing_food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    db.delete(existing_food)
    db.commit()

    return {
        "message": "Food deleted successfully"
    }