from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    food_id: int
    quantity: int = Field(..., ge=1)


class OrderItemResponse(BaseModel):
    id: int
    food_id: int
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True