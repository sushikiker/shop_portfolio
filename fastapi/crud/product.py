from sqlalchemy.orm import Session
from sqlalchemy import select,delete
import os
import uuid
from fastapi import UploadFile

from models.models import Product, Order
from schemas.schemas import Product as Pr_sc, ProductCreate, ProductUpdate

async def add_product(db: Session , product:ProductCreate):
    # Сохраняем файл
    file_extension = os.path.splitext(product.image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"static/images/products/{unique_filename}"
    
    with open(file_path, "wb") as buffer:
        buffer.write(await product.image.read())
    
    # Создаем продукт
    product_data = product.model_dump(exclude={"image"})
    product_data["image_path"] = file_path
    
    new_product = Product(**product_data)

    try:
        db.add(new_product)
        await db.commit()
        await db.refresh(new_product)
    except:
        await db.rollback()
        # Удаляем файл если ошибка
        if os.path.exists(file_path):
            os.remove(file_path)
        raise
    
    # Возвращаем с image_url
    result = Pr_sc.model_validate(new_product)
    if new_product.image_path:
        result.image_url = f"/static/images/products/{unique_filename}"
    else:
        result.image_url = None
    return result

async def get_all_products(db:Session):
    res = await db.execute(select(Product))
    products = res.scalars().all()    
    return products

async def get_products_by_name(db:Session,pr_name:str):
    res = await db.execute(select(Product).where(Product.name == pr_name ))
    products = res.scalars().all()
    return products

async def get_products_by_id(db:Session,pr_id:int):
    res = await db.execute(select(Product).where(Product.id == pr_id ))
    product = res.scalars().first()
    return product

async def delete_all_products(db:Session):
    res = await db.execute(select(Product))
    products = res.scalars().all()
    for product in products:
        if product.image_path and os.path.exists(product.image_path):
            os.remove(product.image_path)
    await db.execute(delete(Order))
    await db.execute(delete(Product))
    await db.commit()

async def delete_by_id(db:Session,pr_id:int):
    res = await db.execute(select(Product).where(Product.id == pr_id ))
    product = res.scalar_one_or_none()
    if not product:
        return False

    await db.execute(delete(Order).where(Order.product_id == pr_id))
    if product.image_path and os.path.exists(product.image_path):
        os.remove(product.image_path)
    await db.execute(delete(Product).where(Product.id == pr_id ))
    await db.commit()
    return True

async def update_by_id(pr_id:int, update_product:ProductUpdate, db:Session):
    res = await db.execute(select(Product).where(Product.id == pr_id ))
    product = res.scalar_one_or_none()

    if not product:
        return None

    new_data = update_product.model_dump(exclude_none=True, exclude={"image"})
    
    # Обработка файла
    if update_product.image:
        # Удаляем старый файл если есть
        if product.image_path and os.path.exists(product.image_path):
            os.remove(product.image_path)
        
        # Сохраняем новый файл
        file_extension = os.path.splitext(update_product.image.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = f"static/images/products/{unique_filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await update_product.image.read())
        new_data["image_path"] = file_path

    for key,value in new_data.items():
        setattr(product,key,value)
    await db.commit()
    await db.refresh(product)
    result = Pr_sc.model_validate(product)
    if product.image_path:
        result.image_url = f"/static/images/products/{os.path.basename(product.image_path)}"
    else:
        result.image_url = None
    return result
