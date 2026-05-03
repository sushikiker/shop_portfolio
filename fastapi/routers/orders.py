from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends, APIRouter, status
from bd.bd import get_db
from routers.tokens import get_current_user
from crud.order import create_order, get_user_orders, get_order_by_id, get_all_orders, update_order, delete_order
from schemas.schemas import OrderCreate, Order, OrderUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/create")
async def create_new_order(order: OrderCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        res = await create_order(db, order, current_user.id)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/my_orders")
async def get_my_orders(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    orders = await get_user_orders(db, current_user.id)
    return [Order.model_validate(item) for item in orders]

@router.get("/get_order/{order_id}")
async def get_order(order_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    order = await get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not allowed")
    return Order.model_validate(order)

@router.get("/all_orders")
async def get_all_orders_admin(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    orders = await get_all_orders(db)
    return [Order.model_validate(item) for item in orders]

@router.put("/update/{order_id}")
async def update_order_handler(order_id: int, update_data: OrderUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    order = await get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not allowed")
    
    updated_order = await update_order(db, order_id, update_data)
    return updated_order

@router.delete("/delete/{order_id}")
async def delete_order_handler(order_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    order = await get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not allowed")
    
    await delete_order(db, order_id)
    return "Order deleted"
