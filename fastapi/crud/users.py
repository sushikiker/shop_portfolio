from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select,delete
import bcrypt

from models.models import User
from schemas.schemas import CreateUser , UpdateUser ,GetUsers


class UserAlreadyExists(Exception):
    pass


def pass_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


async def add_user(db: Session, user: CreateUser):
    user_data = user.model_dump()
    user_data["password"] = pass_hash(user_data["password"])
    user_data["is_admin"] = False

    new_user = User(**user_data)

    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
    except IntegrityError:
        await db.rollback()
        raise UserAlreadyExists(
            f"User with email {user.email} already exists"
        )

    return new_user


async def get_all_users(db: Session):
    res = await db.execute(select(User))
    users = res.scalars().all()
    return users


async def clean_table_users(db: Session):
    await db.execute(delete(User))
    await db.commit()
    
async def delete_by_id(db:Session,us_id:int):
    await db.execute(delete(User).where(User.id == us_id ))
    await db.commit()


async def get_user_by_email(db:Session,email:str):
    res = await db.execute(select(User).where(User.email == email))
    user = res.scalars().first()
    return user

async def get_user_by_id(db:Session,pr_id:int):
    res = await db.execute(select(User).where(User.id == pr_id ))
    user = res.scalars().first()
    if not user:
        return None
    return GetUsers.model_validate(user)


async def get_user_by_name(db:Session,us_name:str):
    res = await db.execute(select(User).where(User.name == us_name))
    user = res.scalars().all()
    if not user:
        return None
    return GetUsers.model_validate(user)

async def delete_by_id(db:Session,pr_id:int):
    await db.execute(delete(User).where(User.id == pr_id ))
    await db.commit()

async def update_by_id(pr_id:int,update_user:UpdateUser,db:Session):
    res = await db.execute(select(User).where(User.id == pr_id ))

    

    
    user = res.scalar_one_or_none()

    if not user:
        return None

    new_data = update_user.model_dump(exclude_none=True)

    for key,value in new_data.items():
        setattr(user,key,value)
    await db.commit()
    await db.refresh(user)
    return GetUsers.model_validate(user)
