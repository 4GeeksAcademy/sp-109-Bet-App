"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Playground, PlaygroundChat
from api.utils import generate_sitemap, APIException, generate_unique_slug
from flask_cors import CORS

api = Blueprint('api', __name__)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route('/register', methods=['POST'])
def register_user():
    body = request.get_json()
    required_fields = ["username", "name", "last_name", "email", "password"]
    for field in required_fields:
        if not body.get(field):
            raise APIException(f"{field} is required", 400)

    if User.query.filter_by(email=body["email"]).first() is not None:
        raise APIException("Email already exists", 400)
    if User.query.filter_by(username=body["username"]).first() is not None:
        raise APIException("Username already exists", 400)

    user = User(
        username=body["username"],
        name=body["name"],
        last_name=body["last_name"],
        email=body["email"],
        password=body["password"],
        money=body.get("money", 0.0)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully", "user": user.serialize()}), 201


@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()
    email = body.get("email")
    if not email:
        raise APIException("Email is required", 400)

    user = User.query.filter_by(email=email).first()
    if not user:
        raise APIException("User not found", 404)

    return jsonify({
        "msg": "Login successful (no password check yet)",
        "user": user.serialize()
    }), 200


@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200


@api.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        raise APIException("User not found", 404)
    return jsonify(user.serialize()), 200


@api.route('/user/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        raise APIException("User not found", 404)

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.name = data.get("name", user.name)
    user.last_name = data.get("last_name", user.last_name)
    user.email = data.get("email", user.email)
    user.password = data.get("password", user.password)
    user.money = data.get("money", user.money)
    user.is_active = data.get("is_active", user.is_active)

    db.session.commit()
    return jsonify({"msg": "User updated", "user": user.serialize()}), 200


@api.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        raise APIException("User not found", 404)

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200


@api.route('/playground', methods=['GET'])
def show_playgrounds():
    playgrounds = Playground.query.all()
    return jsonify({
        "message": "success",
        "playgrounds": [p.serialize() for p in playgrounds]
    }), 200


@api.route('/playground', methods=['POST'])
def create_playground():
    body = request.get_json()
    name = body.get("name")

    if not name:
        raise APIException("Missing required fields", 400)

    slug = generate_unique_slug(db.session, Playground, name)
    new_playground = Playground(name=name, slug=slug)

    db.session.add(new_playground)
    db.session.commit()

    return jsonify({
        "message": "New playground created",
        "playground": new_playground.serialize()
    }), 201


@api.route('/playground/<int:id>', methods=['GET'])
def show_playground(id):
    playground = Playground.query.get(id)
    if not playground:
        raise APIException("Playground not found", 404)
    return jsonify({
        "message": "success",
        "playground": playground.serialize()
    }), 200


@api.route('/playground/<int:id>', methods=['DELETE'])
def delete_playground(id):
    playground = Playground.query.get(id)
    if not playground:
        raise APIException("Playground not found", 404)

    db.session.delete(playground)
    db.session.commit()
    return jsonify({"message": "Playground deleted"}), 200


@api.route('/playground/<int:id>', methods=['PUT'])
def update_playground(id):
    playground = Playground.query.get(id)
    if not playground:
        raise APIException("Playground not found", 404)

    data = request.get_json()
    new_name = data.get("name")

    if new_name:
        if not new_name.strip():
            raise APIException("Name cannot be empty", 400)

        if new_name != playground.name:
            new_slug = generate_unique_slug(db.session, Playground, new_name)
            existing = Playground.query.filter_by(slug=new_slug).first()
            if existing and existing.id != playground.id:
                raise APIException("Slug already in use", 400)

            playground.name = new_name
            playground.slug = new_slug

    db.session.commit()
    return jsonify({
        "message": "Playground updated",
        "playground": playground.serialize()
    }), 200


@api.route('/chats', methods=['GET'])
def get_chats():
    chats = PlaygroundChat.query.all()
    return jsonify([chat.serialize() for chat in chats]), 200


@api.route('/chat/<int:id>', methods=['GET'])
def get_chat(id):
    chat = PlaygroundChat.query.get(id)
    if not chat:
        return jsonify({"error": "Not found"}), 404
    return jsonify(chat.serialize()), 200


@api.route('/chat', methods=['POST'])
def create_chat():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    user_id = data.get("user_id")
    playground_id = data.get("playground_id")
    message = data.get("message")

    if not all([user_id, playground_id, message]):
        return jsonify({"error": "Missing fields"}), 400

    new_chat = PlaygroundChat(user_id=user_id, playground_id=playground_id, message=message)
    db.session.add(new_chat)
    db.session.commit()

    return jsonify(new_chat.serialize()), 201


@api.route('/chat/<int:id>', methods=['PUT'])
def update_chat(id):
    chat = PlaygroundChat.query.get(id)
    if not chat:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()
    chat.user_id = data["user_id"]
    chat.playground_id = data["playground_id"]
    chat.message = data["message"]
    db.session.commit()

    return jsonify({"message": "Chat updated"}), 200


@api.route('/chat/<int:id>', methods=['DELETE'])
def delete_chat(id):
    chat = PlaygroundChat.query.get(id)
    if not chat:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(chat)
    db.session.commit()
    return jsonify({"message": "Chat deleted"}), 200


@api.route('/playground/<int:playground_id>/chats', methods=['GET'])
def get_chats_for_playground(playground_id):
    chats = PlaygroundChat.query.filter_by(playground_id=playground_id).order_by(PlaygroundChat.created_at.desc()).all()
    return jsonify({
        "chats": [chat.serialize() for chat in chats]
    }), 200
