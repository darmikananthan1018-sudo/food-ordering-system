from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.order import Order
from models.order_item import OrderItem
from models.customer import Customer
from models.food import Food
from schemas.order import OrderCreate, OrderResponse


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# CREATE ORDER
@router.post("/", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == order.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    new_order = Order(
        customer_id=order.customer_id,
        total_amount=0,
        status="Pending"
    )

    db.add(new_order)
    db.flush()

    total_amount = 0

    for item in order.items:

        food = (
            db.query(Food)
            .filter(Food.id == item.food_id)
            .first()
        )

        if not food:
            db.rollback()
            raise HTTPException(
                status_code=404,
                detail=f"Food with id {item.food_id} not found"
            )

        if not food.is_available:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"{food.name} is not available"
            )

        unit_price = food.price
        subtotal = unit_price * item.quantity

        order_item = OrderItem(
            order_id=new_order.id,
            food_id=item.food_id,
            quantity=item.quantity,
            unit_price=unit_price,
            subtotal=subtotal
        )

        db.add(order_item)
        total_amount += subtotal

    new_order.total_amount = total_amount

    db.commit()
    db.refresh(new_order)

    return new_order


# GET ALL ORDERS
@router.get("/", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db)
):
    orders = db.query(Order).all()

    return orders


# GET ORDER BY ID
@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


# UPDATE ORDER STATUS
@router.put(
    "/{order_id}/status",
    response_model=OrderResponse
)
def update_order_status(
    order_id: int,
    status: str = Query(...),
    db: Session = Depends(get_db)
):
    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
    ]

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid order status"
        )

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = status

    db.commit()
    db.refresh(order)

    return order