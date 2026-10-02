from pydantic import BaseModel, EmailStr, Field


class CustomerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    address: str | None = None


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int

    class Config:
        from_attributes = True