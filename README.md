Markdown
# Fullstack Shop Portfolio 🛒

Это демонстрационный проект интернет-магазина, построенный на современном стеке технологий. Проект полностью контейнеризирован с помощью Docker для быстрого развертывания.

## 🚀 Стек технологий

* **Backend:** Python 3.10, FastAPI, SQLAlchemy (Async), Alembic, Pydantic.
* **Frontend:** React, Axios, CSS Modules.
* **Database:** PostgreSQL 15.
* **DevOps:** Docker, Docker Compose, Nginx.

---

## 🛠 Установка и запуск

### 1. Предварительные требования
Убедитесь, что у вас установлены:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Git](https://git-scm.com/)

### 2. Клонирование репозитория
```bash
git clone [https://github.com/sushikiker/shop_portfolio.git](https://github.com/sushikiker/shop_portfolio.git)
cd shop_portfolio
3. Запуск проекта
Проект запускается одной командой. Docker сам скачает образы, соберет фронтенд и поднимет базу данных:

Bash
docker-compose up --build
После запуска приложения будут доступны по адресам:

Frontend: http://localhost

Backend (Swagger UI): http://localhost:8000/docs

🗄 Работа с базой данных
Инициализация таблиц
При первом запуске необходимо создать таблицы в базе данных с помощью миграций Alembic:

Bash
docker-compose exec backend alembic upgrade head
Автоматическое создание админа
В проекте предусмотрен скрипт для инициализации учетной записи администратора. Он запускается автоматически при старте контейнера (через entrypoint.sh) или вручную:

Bash
docker-compose exec backend python -m app.setup_admin
🔧 Основные команды для разработки
Пересборка фронтенда после изменений:
docker-compose up --build frontend

Просмотр логов бэкенда:
docker-compose logs -f backend

Вход в консоль PostgreSQL:
docker-compose exec db psql -U postgres -d shop

📝 Особенности реализации
CORS: Настроен для взаимодействия фронтенда (порт 80) и бэкенда (порт 8000).

Environment Variables: Все настройки (URL базы, секреты) вынесены в переменные окружения Docker.

Async: Бэкенд полностью асинхронный (FastAPI + asyncpg).


