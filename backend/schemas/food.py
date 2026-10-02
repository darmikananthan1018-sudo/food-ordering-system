from pydantic import BaseModel, Field


class FoodBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: str | None = None
    price: float = Field(..., gt=0)
    image: str | None = None
    is_available: bool = True
    category_id: int


class FoodCreate(FoodBase):
    pass


class FoodResponse(FoodBase):
    id: int

    class Config:
        from_attributes = True