from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers.products import router as pr_r
from routers.users import router as us_r
from routers.tokens import router as tk_r
from routers.orders import router as or_r
app = FastAPI(openapi_url="/openapi.json",  
    docs_url="/docs",            
    root_path="/api"             
    )

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost",       # Твой фронтенд на Nginx
    "http://localhost:80",    # Он же, явно
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Разрешаем запросы с этих адресов
    allow_credentials=True,
    allow_methods=["*"],              # Разрешаем все методы (GET, POST и т.д.)
    allow_headers=["*"],              # Разрешаем любые заголовки
)
app.mount("/images",StaticFiles(directory="images"),name = "images")
s= app
app.include_router(pr_r)
app.include_router(us_r)
app.include_router(tk_r)
app.include_router(or_r)





