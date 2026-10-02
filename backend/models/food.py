from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    image = Column(String(255), nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False
    )

    category = relationship("Category", backref="foods")