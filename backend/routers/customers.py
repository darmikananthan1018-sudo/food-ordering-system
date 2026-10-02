from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.customer import Customer
from schemas.customer import CustomerCreate, CustomerResponse


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


# CREATE CUSTOMER
@router.post("/", response_model=CustomerResponse)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.email == customer.email)
        .first()
    )

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
        address=customer.address
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


# GET ALL CUSTOMERS
@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db)
):
    customers = db.query(Customer).all()

    return customers


# GET CUSTOMER BY ID
@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


# UPDATE CUSTOMER
@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not existing_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    duplicate_customer = (
        db.query(Customer)
        .filter(
            Customer.email == customer.email,
            Customer.id != customer_id
        )
        .first()
    )

    if duplicate_customer:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_customer.name = customer.name
    existing_customer.email = customer.email
    existing_customer.phone = customer.phone
    existing_customer.address = customer.address

    db.commit()
    db.refresh(existing_customer)

    return existing_customer


# DELETE CUSTOMER
@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not existing_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(existing_customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }