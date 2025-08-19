from __future__ import annotations
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum

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
    address: Mapped[str] = mapped_column(String(200), nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)


    playgrounds = relationship("Playground", back_populates="user_pg_creator", cascade="all, delete")
    bets = relationship("Bet", back_populates="user_bet_creator", cascade="all, delete")
    playground_chats: Mapped[list["PlaygroundChat"]] = relationship(back_populates="user")
    playground_users: Mapped[list["PlaygroundUser"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "money": self.money,
            "created_at": self.created_at.isoformat(),
            "is_active": self.is_active,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude

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
    description: Mapped[str] = mapped_column(String(250), nullable=True)
    url_image: Mapped[str] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    created_by = mapped_column(ForeignKey("user.id"))
    user_pg_creator = relationship("User", back_populates="playgrounds")

    bets = relationship("Bet", back_populates="playground_link", cascade="all, delete")
    chats: Mapped[list["PlaygroundChat"]] = relationship(back_populates="playground")
    
    playground_used: Mapped[list["PlaygroundUser"]] = relationship(back_populates="playground")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "url_image": self.url_image,
            "created_at": self.created_at.isoformat(),
            "created_by": self.user_pg_creator.username if self.user_pg_creator else None,
            "playground_used": [pu.serialize() for pu in self.playground_used]
        }

class BetType(enum.Enum):
    sports = "sports"
    others = "others"

class BetStatus(enum.Enum):
    pending = "pending"
    active = "active"
    locked = "locked" 
    resolved = "resolved"
    cancelled = "cancelled"

class Bet(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[BetStatus] = mapped_column(Enum(BetStatus), default=BetStatus.active, nullable=False)
    type: Mapped[BetType] = mapped_column(Enum(BetType), default=BetType.sports, nullable=False)
    league: Mapped[str] = mapped_column(String(100), nullable=True)
    match: Mapped[str] = mapped_column(String(100), nullable=True)
    event_description: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    deadline: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    resolved_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    winner_option_id: Mapped[int | None] = mapped_column(
        ForeignKey("bet_option.id", ondelete="SET NULL", name="fk_bet_winner_option"),
        nullable=True
    )
    
    winner_option: Mapped["BetOption | None"] = relationship(
        "BetOption",
        foreign_keys=[winner_option_id],
        uselist=False,
        post_update=True,
    )

    competition_code: Mapped[str | None] = mapped_column(nullable=True)
    external_match_id: Mapped[int | None] = mapped_column(nullable=True)

    user_id = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    user_bet_creator = relationship("User", back_populates="bets", passive_deletes=True)

    playground_id = mapped_column(ForeignKey("playground.id", ondelete="CASCADE"), nullable=False)
    playground_link = relationship("Playground", back_populates="bets", passive_deletes=True)

    options: Mapped[list["BetOption"]] = relationship(
        "BetOption",
        back_populates="bet",
        cascade="all, delete-orphan",
        foreign_keys="BetOption.bet_id",
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "status": self.status.value if self.status else None,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
            "user_id": self.user_id,
            "playground_id": self.playground_id,
            "user": self.user_bet_creator.username if self.user_bet_creator else None,
            "playground": self.playground_link.name if self.playground_link else None,
            "options": [option.serialize() for option in self.options],
            "type": self.type.value if self.type else None,
            "event_description": self.event_description,
            "league": self.league,
            "match": self.match,
            "winner_option_id": self.winner_option_id,
        }
    
    def serialize_with_votes(self, user_id=None):
        user_vote = None
        if user_id:
            user_vote_obj = UserBet.query.filter_by(
                bet_id=self.id, 
                user_id=user_id
            ).first()
            user_vote = user_vote_obj.option_id if user_vote_obj else None
        
        return {
            **self.serialize(),
            "options": [option.serialize() for option in self.options],
            "user_vote": user_vote
        }


class BetOption(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(100), nullable=False)

    bet_id: Mapped[int] = mapped_column(ForeignKey("bet.id"), nullable=False)
    bet: Mapped["Bet"] = relationship("Bet", back_populates="options", foreign_keys=[bet_id],)

    external_team_id: Mapped[int | None] = mapped_column(nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "label": self.label,
            "bet_id": self.bet_id,
            "external_team_id": self.external_team_id,
        }


class UserBet(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bet_id = db.Column(db.Integer, db.ForeignKey('bet.id'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('bet_option.id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="user_bets")
    bet = db.relationship("Bet", backref="user_bets")
    option = db.relationship("BetOption", backref="user_bets")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "bet_id": self.bet_id,
            "option_id": self.option_id,
            "bet_name": self.bet.name if self.bet else None,
            "option_label": self.option.label if self.option else None,
            "created_at": self.created_at.isoformat()
        }
    
    __table_args__ = (
    db.UniqueConstraint('user_id', 'bet_id', name='unique_user_bet_vote'),
)

    
    
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




class PlaygroundUser(db.Model):
    __tablename__ = "playgrounduser"
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    playground_id: Mapped[int] = mapped_column(ForeignKey("playground.id"))
    joined_at: Mapped[datetime] = mapped_column(DateTime)

    user: Mapped["User"] = relationship(back_populates="playground_users")
    playground: Mapped["Playground"] = relationship(back_populates="playground_used")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.user.username if self.user else None,
            "playground": self.playground.name if self.playground else None,
            "joined_at": self.joined_at.strftime('%d-%m-%Y') if self.joined_at else None
        }
    
class MessageBoard(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(120), nullable=False)
    content: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "content": self.content,
            "created_at": self.created_at.isoformat()
        }
    


    

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    content = db.Column(db.String(255), nullable=False)
    playground_id = db.Column(db.Integer, db.ForeignKey('playground.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "content": self.content,
            "playground_id": self.playground_id,
            "created_at": self.created_at.isoformat()
        }
    
class PlaygroundAccessRequest(db.Model):
    __tablename__ = "playground_access_request"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    playground_id = db.Column(db.Integer, db.ForeignKey("playground.id"), nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending / accepted / rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="access_requests_sent")
    playground = db.relationship("Playground", backref="access_requests_received")

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user.username,
            "playground_name": self.playground.name,
            "status": self.status,
            "playground_id": self.playground_id,
            "user_id": self.user_id,
            "created_at": self.created_at.strftime("%d-%m-%Y")
        }