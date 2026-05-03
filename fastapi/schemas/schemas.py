from pydantic import BaseModel, Field , EmailStr
from typing import Optional
from fastapi import UploadFile


class ProductBase(BaseModel):
    
    name:str = Field(min_length=1)
    price:float = Field(gt=0)
    discount_price:Optional[float] = 0
    category:Optional[str]= None
    quantity:Optional[int] = 0
    model_config = {
        "from_attributes": True  
    }

class Product(ProductBase):
   id: int
   image_url: Optional[str] = "/static/images/products/2c5beb7c-f676-49c4-bd29-cdbf2baf9012.jpg"

class ProductCreate(ProductBase):
    image: UploadFile

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(min_length=1)
    price: Optional[float] = Field(gt=0)
    discount_price: Optional[float] =0
    category: Optional[str] = None
    quantity: Optional[int] = Field(default=0, ge=0)
    image: Optional[UploadFile] ="/static/images/products/2c5beb7c-f676-49c4-bd29-cdbf2baf9012.jpg"
    model_config = {
        "from_attributes": True
    }


class User(BaseModel):
    name:str = Field(min_length=2,max_length=50)
    second_name:Optional[str] = Field(min_length=2,max_length=50)
    email:EmailStr

class CreateUser(User):
    password:str = Field(min_length=6,max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class GetUsers(User):
    is_admin:bool = False
    model_config = {
        "from_attributes": True 
    }

class UpdateUser(BaseModel):
    name: Optional[str] = Field(min_length=2, max_length=50)
    second_name: Optional[str] = Field(min_length=2, max_length=50)
    email: Optional[EmailStr] = Field(min_length=2, max_length=100)
    password: Optional[str] = Field(min_length=6, max_length=100)
    is_admin: Optional[bool] = None


from datetime import datetime

class OrderCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    delivery_address: str = Field(min_length=5)
    model_config = {"from_attributes": True}

class Order(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    total_price: float
    status: str
    delivery_address: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class OrderUpdate(BaseModel):
    quantity: Optional[int] = Field(default=None, gt=0)
    status: Optional[str] = None
    delivery_address: Optional[str] = None
    model_config = {"from_attributes": True}


   