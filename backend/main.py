from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from models import User
from database import SessionLocal, engine, Base
from auth import hash_password, verify_password
from pydantic import BaseModel
from datetime import date

class RegisterRequest(BaseModel):
    full_name: str
    date_of_birth: date
    phone_number: str
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
@app.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Проверяем, существует ли пользователь с таким email или номером телефона
    db_user_email = db.query(User).filter(User.email == request.email).first()
    db_user_phone = db.query(User).filter(User.phone_number == request.phone_number).first()
    if db_user_email or db_user_phone:
        raise HTTPException(status_code=400, detail="Email или номер телефона уже зарегистрирован")

    # Хэшируем пароль
    hashed_password = hash_password(request.password)

    # Создаем нового пользователя
    db_user = User(
        full_name=request.full_name,
        date_of_birth=request.date_of_birth,
        phone_number=request.phone_number,
        email=request.email,
        hashed_password=hashed_password
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
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    # Проверяем пароль
    if not verify_password(request.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    return {"message": "Успешный вход", "user_id": db_user.id}

# Получение данных пользователя
@app.get("/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return {
        "id": db_user.id,
        "full_name": db_user.full_name,
        "date_of_birth": db_user.date_of_birth,
        "phone_number": db_user.phone_number,
        "email": db_user.email
    }