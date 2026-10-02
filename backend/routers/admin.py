from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.category import Category
from models.food import Food
from models.customer import Customer
from models.order import Order
from models.order_item import OrderItem
from models.user import User
from utils.dependencies import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin Dashboard"]
)


@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    total_foods = db.query(Food).count()

    total_categories = db.query(Category).count()

    total_customers = db.query(Customer).count()

    total_orders = db.query(Order).count()

    total_revenue = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(Order.status != "Cancelled")
        .scalar()
    )

    pending_orders = (
        db.query(Order)
        .filter(Order.status == "Pending")
        .count()
    )

    delivered_orders = (
        db.query(Order)
        .filter(Order.status == "Delivered")
        .count()
    )

    popular_food = (
        db.query(
            Food.id,
            Food.name,
            func.sum(OrderItem.quantity).label("total_quantity")
        )
        .join(OrderItem, Food.id == OrderItem.food_id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status != "Cancelled")
        .group_by(Food.id, Food.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .first()
    )

    popular_food_data = None

    if popular_food:
        popular_food_data = {
            "food_id": popular_food.id,
            "food_name": popular_food.name,
            "ordered_quantity": int(popular_food.total_quantity)
        }

    return {
        "total_foods": total_foods,
        "total_categories": total_categories,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "popular_food": popular_food_data
    }