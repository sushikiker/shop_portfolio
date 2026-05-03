FROM python:3.10-slim

WORKDIR /app

ENV APP_NAME="Nosochki Api"
ENV DEBUG=True
ENV DATABASE_URL=postgresql+asyncpg://postgres:Xdxdsi7h@db:5432/shop
ENV SECRET_KEY=zalupa228
ENV ALGORITHM=HS256
ENV ACCESS_TOKEN_EXPIRE_MINUTES=60

# 1. Сначала копируем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. КРИТИЧЕСКИ ВАЖНО: Копируем весь твой код в контейнер!
COPY . .

# 3. Добавляем путь, чтобы питон точно видел все папки (app, api, bd)
ENV PYTHONPATH=/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]