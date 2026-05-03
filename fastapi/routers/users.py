from sqlalchemy.orm import Session
from fastapi import HTTPException,Depends, APIRouter

from crud.users import add_user, get_all_users,clean_table_users,UserAlreadyExists,update_by_id,get_user_by_id,get_user_by_email,delete_by_id

from schemas.schemas import CreateUser,UpdateUser
from bd.bd import get_db

router = APIRouter( prefix="/users",tags=["Users"])
@router.post("/add_new_user")
async def create_user(cr_user:CreateUser,db: Session = Depends(get_db)):
    try:
        res =await add_user(db,cr_user)
        return res
    except UserAlreadyExists as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/get_all_users")
async def get_all_us(db: Session = Depends(get_db)):
   
        res = await get_all_users(db)
        return res
    
@router.delete("/clean_table")
async def clean_table(db: Session = Depends(get_db)):
    res = await clean_table_users(db)
    return "Users cleaned"
    
@router.delete("/delete_by_id")
async def clean_table(pr_id:int, db: Session = Depends(get_db)):
    res = await delete_by_id(db,pr_id)
    if res is None:
        raise HTTPException(status_code=404, detail="User not found")
    return "User cleaned"


@router.post("/update_user_by_id")
async def update_user_by_id(pr_id:int,update_user:UpdateUser,db: Session = Depends(get_db)):
    res = await update_by_id(pr_id,update_user,db)
    if res is None:
        raise HTTPException(status_code=404, detail="User not found")
    return res

     
@router.get("/get_user_by_id")
async def get_users_by_id(pr_id:int,db: Session = Depends(get_db)):
    res= await get_user_by_id(db,pr_id)
    if res is None:
        raise HTTPException(status_code=404, detail="User not found")
    return res


     
@router.get("/get_user_by_name")
async def get_users_by_name(pr_name:str,db: Session = Depends(get_db)):
    res =  await get_user_by_email(db,pr_name)
    if res is None:
        raise HTTPException(status_code=404, detail="User not found")
    return res

