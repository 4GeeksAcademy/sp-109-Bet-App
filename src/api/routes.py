from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Playground, AdminUser, Bet, PlaygroundChat
from api.utils import generate_sitemap, APIException, generate_unique_slug
from flask_cors import CORS
from sqlalchemy import select
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message from the backend"
    }), 200

# ----------- USER -----------

@api.route('/register', methods=['POST'])
def register_user():
    body = request.get_json()
    required_fields = ["username", "name", "last_name", "email", "password"]
    for field in required_fields:
        if not body.get(field):
            raise APIException(f"{field} is required", 400)

    if User.query.filter_by(email=body["email"]).first():
        raise APIException("Email already exists", 400)
    if User.query.filter_by(username=body["username"]).first():
        raise APIException("Username already exists", 400)

    user = User(**body)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully", "user": user.serialize()}), 201

@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()
    user = User.query.filter_by(email=body.get("email")).first()
    if not user:
        raise APIException("User not found", 404)
    return jsonify({"msg": "Login successful", "user": user.serialize()}), 200

@api.route('/users', methods=['GET'])
def get_users():
    return jsonify([user.serialize() for user in User.query.all()]), 200

@api.route('/user/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_user(id):
    user = User.query.get(id)
    if not user:
        raise APIException("User not found", 404)

    if request.method == 'GET':
        return jsonify(user.serialize()), 200

    if request.method == 'PUT':
        data = request.get_json()
        for field in ["username", "name", "last_name", "email", "password", "money", "is_active"]:
            if field in data:
                setattr(user, field, data[field])
        db.session.commit()
        return jsonify({"msg": "User updated", "user": user.serialize()}), 200

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200

# ----------- ADMIN USER -----------

@api.route('/adminuser', methods=['GET', 'POST'])
def handle_adminuser():
    if request.method == 'GET':
        return jsonify([admin.serialize() for admin in AdminUser.query.all()]), 200

    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        raise APIException('Fields "email" and "password" are required', 400)

    admin = AdminUser(email=data['email'], password=data['password'])
    db.session.add(admin)
    db.session.commit()
    return jsonify({"msg": "Admin created", "admin": admin.serialize()}), 201

@api.route('/adminuser/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_single_admin(id):
    admin = AdminUser.query.get(id)
    if not admin:
        raise APIException('Admin not found', 404)

    if request.method == 'GET':
        return jsonify(admin.serialize()), 200

    if request.method == 'PUT':
        data = request.get_json()
        admin.email = data.get('email', admin.email)
        admin.password = data.get('password', admin.password)
        db.session.commit()
        return jsonify({"msg": "Admin updated"}), 200

    db.session.delete(admin)
    db.session.commit()
    return jsonify({"msg": "Admin deleted"}), 200

# ----------- PLAYGROUND -----------

@api.route('/playground', methods=['GET', 'POST'])
def handle_playgrounds():
    if request.method == 'GET':
        return jsonify({"message": "success", "playgrounds": [p.serialize() for p in Playground.query.all()]}), 200

    body = request.get_json()
    name = body.get("name")
    if not name:
        raise APIException("Name is required", 400)

    slug = generate_unique_slug(db.session, Playground, name)
    new_pg = Playground(
        name=name,
        slug=slug,
        url_image=body.get("url_image"),
        description=body.get("description")
    )
    db.session.add(new_pg)
    db.session.commit()
    return jsonify({"message": "Playground created", "playground": new_pg.serialize()}), 201

@api.route('/playground/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_playground(id):
    pg = Playground.query.get(id)
    if not pg:
        raise APIException("Playground not found", 404)

    if request.method == 'GET':
        return jsonify({"message": "success", "playground": pg.serialize()}), 200

    if request.method == 'PUT':
        data = request.get_json()
        name = data.get("name")
        if name and name != pg.name:
            slug = generate_unique_slug(db.session, Playground, name)
            if Playground.query.filter_by(slug=slug).first():
                raise APIException("Slug already exists", 400)
            pg.name = name
            pg.slug = slug

        pg.url_image = data.get("url_image", pg.url_image)
        pg.description = data.get("description", pg.description)

        db.session.commit()
        return jsonify({"message": "Playground updated", "playground": pg.serialize()}), 200

    db.session.delete(pg)
    db.session.commit()
    return jsonify({"message": "Playground deleted"}), 200

# ----------- CHAT -----------

@api.route('/chat', methods=['POST'])
def create_chat():
    data = request.get_json()
    required = ["user_id", "playground_id", "message"]
    if not all(k in data for k in required):
        raise APIException("Missing required fields", 400)

    chat = PlaygroundChat(
        user_id=data["user_id"],
        playground_id=data["playground_id"],
        message=data["message"]
    )
    db.session.add(chat)
    db.session.commit()
    return jsonify(chat.serialize()), 201

@api.route('/chat/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_chat(id):
    chat = PlaygroundChat.query.get(id)
    if not chat:
        raise APIException("Chat not found", 404)

    if request.method == 'GET':
        return jsonify(chat.serialize()), 200

    if request.method == 'PUT':
        data = request.get_json()
        chat.message = data.get("message", chat.message)
        db.session.commit()
        return jsonify({"message": "Chat updated"}), 200

    db.session.delete(chat)
    db.session.commit()
    return jsonify({"message": "Chat deleted"}), 200

@api.route('/playground/<int:playground_id>/chats', methods=['GET'])
def get_chats_for_playground(playground_id):
    chats = PlaygroundChat.query.filter_by(playground_id=playground_id).order_by(PlaygroundChat.created_at.desc()).all()
    return jsonify({"chats": [chat.serialize() for chat in chats]}), 200

# ----------- BET -----------

@api.route('/playground/<int:pg_id>/bet', methods=['GET', 'POST'])
def handle_bets(pg_id):
    if not Playground.query.get(pg_id):
        raise APIException("Playground not found", 404)

    if request.method == 'GET':
        bets = Bet.query.filter_by(playground_id=pg_id).all()
        return jsonify([b.serialize() for b in bets]), 200

    body = request.get_json()

    # user_id = body.get("user_id")
    # # if not user_id:
    # #     raise APIException("user_id is required", 400)

    # user = User.query.get(user_id)
    # if not user:
    #     raise APIException("User not found", 404)

    name = body.get('name')
    amount = body.get('amount', 0.0)
    if amount is None:
        raise APIException("amount is required", 404)
    
    status = body.get("status")
    deadline_str = body.get("deadline")
    
    playground=Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)
    
    deadline = datetime.fromisoformat(deadline_str) if deadline_str else None

    new_bet = Bet(
        name=name,
        amount=amount,
        status=status,
        deadline=deadline,
        # user_id=user_id,
        playground_id=pg_id
    )
    db.session.add(bet)
    db.session.commit()
    return jsonify({"message": "Bet created", "bet": bet.serialize()}), 201

@api.route('/playground/<int:pg_id>/bet/<int:bet_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_single_bet(pg_id, bet_id):
    bet = Bet.query.filter_by(playground_id=pg_id, id=bet_id).first()
    if not bet:
        raise APIException("Bet not found", 404)

    if request.method == 'GET':
        return jsonify(bet.serialize()), 200

    if request.method == 'PUT':
        data = request.get_json()
        for key in ["name", "amount", "status"]:
            setattr(bet, key, data.get(key, getattr(bet, key)))
        if data.get("deadline"):
            bet.deadline = datetime.fromisoformat(data["deadline"])
        db.session.commit()
        return jsonify({"message": "Bet updated", "bet": bet.serialize()}), 200

    db.session.delete(bet)
    db.session.commit()
    return jsonify({"message": "Bet deleted"}), 200
