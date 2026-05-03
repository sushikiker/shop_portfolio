import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta,timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import os
from bd.bd import get_db
from schemas.schemas import CreateUser, LoginRequest 
from crud.users import add_user, get_user_by_email 


SECRET_KEY =  os.getenv("SECRET_KEY")
ALGORITHM =  os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")



async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user



def pass_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:

    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict):
    to_encode = data.copy()
    
    now = datetime.now(timezone.utc)
    
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
   
    to_encode.update({"exp": expire})
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



@router.post("/registration")
async def create_user(cr_user: CreateUser, db: Session = Depends(get_db)):
    try:
      
        cr_user.password = pass_hash(cr_user.password)
        res = await add_user(db, cr_user)
        access_token = create_access_token(data={"sub": res.email, "user_id": res.id, "name": res.name})
        return {"id": res.id, "firstName": res.name, "lastName": res.second_name or "", "mail": res.email, "admin": res.is_admin, "access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка регистрации: {str(e)}")

@router.post("/login")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
   
    user = await get_user_by_email(db, login_data.email)
    
  
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль"
        )


    access_token = create_access_token(data={"sub": user.email, "user_id": user.id, "name": user.name})
    return {"id": user.id, "firstName": user.name, "lastName": user.second_name or "", "mail": user.email, "admin": user.is_admin, "access_token": access_token, "token_type": "bearer"}


@router.get("/me")
async def get_current_user_info(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "second_name": current_user.second_name,
        "is_admin": current_user.is_admin
    }