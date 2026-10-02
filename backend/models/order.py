from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    total_amount = Column(Float, nullable=False)

    status = Column(
        String(30),
        default="Pending",
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    customer = relationship("Customer", backref="orders")
    items = relationship(
        "OrderItem",
        backref="order",
        cascade="all, delete-orphan"
    )