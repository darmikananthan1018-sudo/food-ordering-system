from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False
    )

    food_id = Column(
        Integer,
        ForeignKey("foods.id"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False)

    unit_price = Column(Float, nullable=False)

    subtotal = Column(Float, nullable=False)

    food = relationship("Food", backref="order_items")