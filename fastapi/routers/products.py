
from crud.product import add_product,get_all_products,delete_all_products,get_products_by_name,get_products_by_id,update_by_id,delete_by_id
from schemas.schemas import Product, ProductCreate, ProductUpdate
from sqlalchemy.orm import Session
from fastapi import HTTPException,Depends, APIRouter, status, File, UploadFile, Form
from fastapi.responses import FileResponse
import os
from bd.bd import get_db
from routers.tokens import get_current_user
router = APIRouter( prefix="/products",tags=["Products"])


async def admin_required(current_user = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user


@router.post("/add_new_product")
async def add_new_product(
    name: str = Form(...),
    price: float = Form(...),
    discount_price: float = Form(None),
    category: str = Form(None),
    quantity: int = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db), 
    current_user = Depends(admin_required)
):
    try:
        product_data = ProductCreate(
            name=name,
            price=price,
            discount_price=discount_price,
            category=category,
            quantity=quantity,
            image=image
        )
        res = await add_product(db, product_data)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/get_all_products")
async def get_all_product(db: Session = Depends(get_db)):
    products = await get_all_products(db)
    result = []
    for item in products:
        p = Product.model_validate(item)
        if item.image_path:
            p.image_url = f"/static/images/products/{os.path.basename(item.image_path)}"
        else:
            p.image_url = None
        result.append(p)
    return result
    
@router.get("/get_products_by_id")
async def get_product_by_id(pr_id:int, db: Session = Depends(get_db)):
    product = await get_products_by_id(db,pr_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    result = Product.model_validate(product)
    if product.image_path:
        result.image_url = f"/static/images/products/{os.path.basename(product.image_path)}"
    else:
        result.image_url = None
    return result

@router.get("/get_products_by_name")
async def get_product_by_name(pr_name:str, db: Session = Depends(get_db)):
    products = await get_products_by_name(db,pr_name)
    result = []
    for item in products:
        p = Product.model_validate(item)
        if item.image_path:
            p.image_url = f"/static/images/products/{os.path.basename(item.image_path)}"
        else:
            p.image_url = None
        result.append(p)
    return result

@router.delete("/clean_table")
async def clean_table(db: Session = Depends(get_db), current_user = Depends(admin_required)):
    await delete_all_products(db)
    return "products cleaned"

@router.post("/update_product_by_id")
async def update_product_by_id(
    pr_id: int = Form(...),
    name: str = Form(None),
    price: float = Form(None),
    discount_price: float = Form(None),
    category: str = Form(None),
    quantity: int = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db), 
    current_user = Depends(admin_required)
):
    try:
        update_data = ProductUpdate(
            name=name,
            price=price,
            discount_price=discount_price,
            category=category,
            quantity=quantity,
            image=image
        )
        res = await update_by_id(pr_id, update_data, db)
        if res is None:
            raise HTTPException(status_code=404, detail="Product not found")
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/delete_by_id/{pr_id}")
async def delete_product_by_id(pr_id:int, db: Session = Depends(get_db), current_user = Depends(admin_required)):
    success = await delete_by_id(db,pr_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot delete product because it is referenced by existing orders or does not exist")
    return "Product cleaned"

@router.get("/image/{filename}")
async def get_product_image(filename: str):
    file_path = f"static/images/products/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)
