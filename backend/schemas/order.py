from pydantic import BaseModel, Field
from datetime import datetime

from schemas.order_item import OrderItemCreate, OrderItemResponse


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderItemInOrder(BaseModel):
    id: int
    food_id: int
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime
    items: list[OrderItemInOrder]

    class Config:
        from_attributes = True