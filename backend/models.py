from sqlalchemy import Boolean, Column, Integer, String, Date
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    FIO = Column(String, nullable=False)
    registration_date = Column(Date, nullable=False)
    role = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    link = Column(String, nullable=True)
    category = Column(String, nullable=False)
    ageGroup = Column(String, nullable=False)
    isFree = Column(Boolean, nullable=False)
    maxCount = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    images = Column(String, nullable=True)
    news_type = Column(String, nullable=True)
