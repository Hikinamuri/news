from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from models import User, News
from database import SessionLocal, engine, Base
from auth import hash_password, verify_password
from pydantic import BaseModel
from datetime import date
from schemas import NewsCreate

class RegisterRequest(BaseModel):
    FIO: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Укажи домен фронтенда
    allow_credentials=True,
    allow_methods=["*"],  # Разреши все методы (GET, POST, OPTIONS и т.д.)
    allow_headers=["*"],  # Разреши все заголовки
)
# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

# Зависимость для получения сессии базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Регистрация пользователя
from datetime import datetime

@app.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Проверяем, существует ли пользователь с таким email
    db_user_email = db.query(User).filter(User.email == request.email).first()
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    # Хэшируем пароль
    hashed_password = hash_password(request.password)

    # Создаем нового пользователя
    db_user = User(
        FIO=request.FIO,
        email=request.email,
        hashed_password=hashed_password,
        registration_date=datetime.now(),
        role="Пользователь"  # По умолчанию роль "Пользователь"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "Пользователь успешно зарегистрирован", "user_id": db_user.id}

# Вход пользователя
@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Ищем пользователя по email
    db_user = db.query(User).filter(User.email == request.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Неверный email")

    # Проверяем пароль
    if not verify_password(request.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный пароль")

    return {
        "message": "Успешный вход",
        "user_id": db_user.id,
        "role": db_user.role  # Возвращаем роль пользователя
    }

# Получение данных пользователя
@app.get("/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return {
        "id": db_user.id,
        "FIO": db_user.FIO,
        "registration_date": db_user.registration_date,
        "role": db_user.role,
        "email": db_user.email
    }

class NewsCreate(BaseModel):
    title: str
    description: str
    date: str
    # link: str
    category: str
    ageGroup: str
    isFree: bool
    maxCount: int
    location: str
    images: List[str]
    news_type: str

@app.post("/news/")
def create_news(news: NewsCreate, db: Session = Depends(get_db)):
    db_news = News(
        title=news.title,
        description=news.description,
        date=news.date,
        # link=news.link,
        category=news.category,
        ageGroup=news.ageGroup,
        isFree=news.isFree,
        maxCount=news.maxCount,
        location=news.location,
        images=",".join(news.images),
        news_type=news.news_type
    )
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return {"message": "Новость добавлена", "news_id": db_news.id}


@app.get("/news/{news_id}")
def get_news(news_id: int, db: Session = Depends(get_db)):
    db_news = db.query(News).filter(News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="Новость не найдена")

    return {
        "id": db_news.id,
        "title": db_news.title,
        "description": db_news.description,
        "date": db_news.date,
        # "link": db_news.link,
        "category": db_news.category,
        "ageGroup": db_news.ageGroup,
        "isFree": db_news.isFree,
        "maxCount": db_news.maxCount,
        "location": db_news.location,
        "images": db_news.images.split(",") if db_news.images else [],
        "news_type": db_news.news_type,
    }


@app.get("/news/")
def get_all_news(db: Session = Depends(get_db)):
    news_list = db.query(News).all()
    return [
        {
            "id": news.id,
            "title": news.title,
            "description": news.description,
            "date": news.date,
            # "link": news.link,
            "category": news.category,
            "ageGroup": news.ageGroup,
            "isFree": news.isFree,
            "maxCount": news.maxCount,
            "location": news.location,
            "images": news.images.split(",") if news.images else [],
            "news_type": news.news_type,
        }
        for news in news_list
    ]


@app.delete("/news/{news_id}")
def delete_news(news_id: int, db: Session = Depends(get_db)):
    db_news = db.query(News).filter(News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="Новость не найдена")

    db.delete(db_news)
    db.commit()
    return {"message": "Новость удалена"}
