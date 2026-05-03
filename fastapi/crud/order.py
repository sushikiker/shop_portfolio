from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from models.models import Order
from schemas.schemas import OrderCreate, OrderUpdate, Order as Order_sc
from fastapi import HTTPException
from crud.product import get_products_by_id
async def create_order(db: Session, order: OrderCreate, user_id: int):
    # 1. Получаем продукт
    product = await get_products_by_id(db, order.product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    
    # 2. Сразу проверяем склад (до создания заказа)
    if product.quantity < order.quantity:
        raise HTTPException(status_code=400, detail="Недостаточно товара на складе")
    
    # 3. Логика выбора цены: берем скидочную, если она больше 0, иначе обычную
    price_to_use = product.discount_price if (product.discount_price and product.discount_price > 0) else product.price
    calculated_total = price_to_use * order.quantity

    new_order = Order(
        user_id=user_id,
        total_price=calculated_total,
        status="pending", 
        **order.model_dump() 
    )

  
    product.quantity -= order.quantity

    
    db.add(new_order)
    
    try:
        await db.commit()
        await db.refresh(new_order)
    except Exception as e:
        await db.rollback() # Откатываем изменения, если что-то пошло не так
        raise HTTPException(status_code=500, detail="Ошибка при сохранении заказа")
    
   
    return Order_sc.model_validate(new_order)

async def get_user_orders(db: Session, user_id: int):
    res = await db.execute(select(Order).where(Order.user_id == user_id))
    return res.scalars().all()

async def get_order_by_id(db: Session, order_id: int):
    res = await db.execute(select(Order).where(Order.id == order_id))
    return res.scalars().first()

async def get_all_orders(db: Session):
    res = await db.execute(select(Order))
    return res.scalars().all()

async def update_order(db: Session, order_id: int, update_data: OrderUpdate):
    res = await db.execute(select(Order).where(Order.id == order_id))
    order = res.scalar_one_or_none()
    if not order:
        return None
    
    data = update_data.model_dump(exclude_none=True)
    for key, value in data.items():
        setattr(order, key, value)
    await db.commit()
    await db.refresh(order)
    return Order_sc.model_validate(order)

async def delete_order(db: Session, order_id: int):
    await db.execute(delete(Order).where(Order.id == order_id))
    await db.commit()
