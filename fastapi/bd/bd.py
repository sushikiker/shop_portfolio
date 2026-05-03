from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

from sqlalchemy.ext.asyncio import create_async_engine
engine = create_async_engine(DATABASE_URL)
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession
)
async def get_db():
  async with SessionLocal() as session:
        yield session
