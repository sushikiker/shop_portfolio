from typing import Optional
from sqlalchemy import String,Integer,Boolean,Float,DateTime,ForeignKey
from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "Users"
    id:Mapped[int] = mapped_column(primary_key=True)
    name:Mapped[str] = mapped_column(String(50))
    second_name:Mapped[str] = mapped_column(String(50))
    email:Mapped[str] = mapped_column(String(100),unique=True)
    password:Mapped[str] = mapped_column(String(100))
    is_admin:Mapped[bool] = mapped_column(Boolean,default=False)

class Product(Base):
    __tablename__ = "Products"
    id:Mapped[int] = mapped_column(primary_key=True)
    name:Mapped[str] = mapped_column(String(50))
    price:Mapped[float] = mapped_column(Float)
    discount_price:Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    category:Mapped[str] = mapped_column(String(150))
    image_path:Mapped[str] = mapped_column(String(255))
    quantity:Mapped[int] = mapped_column(Integer)

class Order(Base):
    __tablename__ = "Orders"
    id:Mapped[int] = mapped_column(primary_key=True)
    user_id:Mapped[int] = mapped_column(ForeignKey("Users.id"))
    product_id:Mapped[int] = mapped_column(ForeignKey("Products.id"))
    quantity:Mapped[int] = mapped_column(Integer)
    total_price:Mapped[float] = mapped_column(Float)
    status:Mapped[str] = mapped_column(String(50), default="pending")
    delivery_address:Mapped[str] = mapped_column(String(255))
    created_at:Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at:Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

