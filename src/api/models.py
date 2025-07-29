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
    password: Mapped[str] = mapped_column(nullable=False)
    money: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    # relación con PlaygroundChat
    playground_chats: Mapped[list["PlaygroundChat"]] = relationship(back_populates="user")

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


class Adminsite(db.Model):
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

    # relación con PlaygroundChat
    chats: Mapped[list["PlaygroundChat"]] = relationship(back_populates="playground")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "created_at": self.created_at.isoformat(),
        }


class PlaygroundChat(db.Model):
    __tablename__ = "playground_chat"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    playground_id: Mapped[int] = mapped_column(ForeignKey("playground.id"), nullable=False)
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="playground_chats")
    playground: Mapped["Playground"] = relationship(back_populates="chats")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "playground_id": self.playground_id,
            "message": self.message,
            "created_at": self.created_at.isoformat()
        }
    
class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    playground_id = db.Column(db.Integer, nullable=False)
    message = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "playground_id": self.playground_id,
            "message": self.message,
            "created_at": self.created_at.isoformat()
        }