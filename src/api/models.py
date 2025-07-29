from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime


db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=True)
    last_name: Mapped[str] = mapped_column(String(120), nullable=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)  # por ahora sin seguridad
    money: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    playgrounds = relationship("Playground", back_populates="user_creator", cascade="all, delete")


    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "money": self.money,
            "created_at": self.created_at.isoformat(),
            "is_active": self.is_active
        }
    
    
class AdminUser(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

    def serialize(self):
        return {
        "id": self.id,
        "email": self.email,
            
    }


class Playground(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    description: Mapped[str] = mapped_column(String(250), nullable=True)
    url_image: Mapped[str] = mapped_column(String(120), nullable=True)

    created_by = mapped_column(ForeignKey("user.id"))
    user_creator = relationship("User", back_populates="playgrounds")

   

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "created_at": self.created_at.isoformat(),
            "description": self.description,
            "url_image": self.url_image,
            "created_by": self.created_by
        }
