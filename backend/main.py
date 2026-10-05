from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

from models.category import Category
from models.food import Food
from models.customer import Customer
from models.order import Order
from models.order_item import OrderItem
from models.user import User

from routers.auth import router as auth_router
from routers.categories import router as category_router
from routers.foods import router as food_router
from routers.customers import router as customer_router
from routers.orders import router as order_router
from routers.admin import router as admin_router



Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Food Ordering API",
    description="Food Ordering System Backend API",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://food-ordering-system-seven-snowy.vercel.app",

    "http://localhost:5180",
    "http://127.0.0.1:5180",

    "http://localhost:5179",
    "http://127.0.0.1:5179",

    "http://localhost:5176",
    "http://127.0.0.1:5176",

    "http://localhost:5175",
    "http://127.0.0.1:5175",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(category_router)
app.include_router(food_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {
        "message": "Food Ordering API is running"
    }