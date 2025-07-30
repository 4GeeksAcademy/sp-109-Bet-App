from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Playground, AdminUser, Bet, PlaygroundChat, BetOption
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

@api.route('/playground', methods=['GET'])
def show_playgrounds():

    playgrounds = Playground.query.all()

    response_body = {
        "message": "success",
        "playgrounds": [playground.serialize() for playground in playgrounds]
    }

    return jsonify(response_body), 200



@api.route('/playground', methods=['POST'])
def create_playground():
    body = request.get_json()

    name = body.get("name")

    if not name:
        raise APIException("Missing required fields", 400)


    slug = generate_unique_slug(db.session, Playground, name)

    image = body.get('url_image')
    description = body.get('description')


    new_playground = Playground(name=name, slug=slug, url_image=image, description=description)


    db.session.add(new_playground)
    db.session.commit()

    return jsonify({
        "message": "New playground created",
        "playground": new_playground.serialize()
    }), 201


@api.route('/playground/<int:id>', methods=['GET'])
def show_playground(id):

    playground = Playground.query.filter_by(id=id).first()

    if not playground:
        raise APIException("Playground not found", 404)

    response_body = {
        "message": "success",
        "playground": playground.serialize()
    }

    return jsonify(response_body), 200


@api.route('/playground/<int:id>', methods=['DELETE'])
def delete_playground(id):

    playground = Playground.query.filter_by(id=id).first()

    if not playground:
        raise APIException("Playground not found", 404)

    db.session.delete(playground)
    db.session.commit()

    response_body = {
        "message": "Playground deleted",
    }

    return jsonify(response_body), 200


@api.route('/playground/<int:id>', methods=['PUT'])
def update_playground(id):

    playground = Playground.query.filter_by(id=id).first()

    if not playground:
        raise APIException("Playground not found", 404)

    data = request.get_json()
    new_name = data.get('name')
    new_image = data.get('url_image')
    new_description = data.get('description')


    if new_name:
        if not new_name.strip():
            raise APIException("Name cannot be empty", 400)
        

    if new_name != playground.name:
        new_slug = generate_unique_slug(db. session, Playground, new_name)
        existing = Playground.query.filter_by(slug=new_slug).first()

        if existing and existing.id != playground.id:
            raise APIException("Slug already in use", 400)
        
        playground.name = new_name
        playground.slug = new_slug

    
    if new_image is not None:
        playground.url_image = new_image

    if new_description is not None:
        playground.description = new_description
        
           

    db.session.commit()
    
    response_body = {
        "message": "Playground updated",
        "playground": playground.serialize()
    }

    return jsonify(response_body), 200

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

@api.route('/playground/<int:pg_id>/bet', methods=['GET'])
def get_bets_by_playground(pg_id):

    playground=Playground.query.get(pg_id)

    if not playground:
        raise APIException("Playground not found", 404)
    
    bets = Bet.query.filter_by(playground_id=pg_id)

    return jsonify([bet.serialize() for bet in bets]), 200


@api.route('/playground/<int:pg_id>/bet/<int:bet_id>', methods=['GET'])
def get_single_bet(pg_id, bet_id):

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)
    
    bet = Bet.query.filter_by(playground_id=pg_id, id=bet_id).first()
    if not bet:
        raise APIException("Bet not found in this playground", 404)

    return jsonify(bet.serialize()), 200


@api.route('/playground/<int:pg_id>/bet', methods=['POST'])
def create_bet(pg_id):

    body = request.get_json()

    # user_id = body.get("user_id")
    # if not user_id:
    #     raise APIException("user_id is required", 400)

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

    db.session.add(new_bet)
    db.session.commit()

    return jsonify({
        "message": "New bet created succesfully",
        "bet": new_bet.serialize()
    }), 201


@api.route('/playground/<int:pg_id>/bet/<int:bet_id>', methods=['DELETE'])
def delete_single_bet(pg_id, bet_id):

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)
    
    bet = Bet.query.filter_by(playground_id=pg_id, id=bet_id).first()
    if not bet:
        raise APIException("Bet not found in this playground", 404)
    
    db.session.delete(bet)
    db.session.commit()

    return jsonify({"message": "Bet deleted succesfully", 
        "bet_id": bet_id,
        "playground_id": pg_id
    }), 200


@api.route('/playground/<int:pg_id>/bet/<int:bet_id>', methods=['PUT'])
def update_bet(pg_id, bet_id):

    body = request.get_json()
    
    playground=Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)
    
    bet = Bet.query.filter_by(playground_id=pg_id, id=bet_id).first()

    bet.name = body.get('name', bet.name)
    bet.amount = body.get('amount', bet.amount)
    bet.status = body.get('status', bet.status)

    deadline_str = body.get('deadline')
    if deadline_str:
        try:
            bet.deadline = datetime.fromisoformat(deadline_str)
        except ValueError:
            raise APIException("Invalid date format. Use ISO 8601 format", 400)
    else:
        bet.deadline = None


    db.session.commit()

    return jsonify({
        "message": "Bet updated succesfully",
        "bet": bet.serialize()
    }), 200

# ----------- BET OPTION-----------

@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/options', methods=['GET'])
def get_bet_options(pg_id, bet_id):
    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        raise APIException("Bet not found", 404)

    options = BetOption.query.filter_by(bet_id=bet_id).all()

    return jsonify([option.serialize() for option in options]), 200


@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/options', methods=['POST'])
def create_bet_option(pg_id, bet_id):
    body = request.get_json()

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)

    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        raise APIException("Bet not found", 404)

    label = body.get('label')
    if not label or not label.strip():
        raise APIException("Label is required", 400)

    new_option = BetOption(label=label, bet_id=bet_id)
    db.session.add(new_option)
    db.session.commit()

    return jsonify({
        "message": "New option created succesfully",
        "bet": new_option.serialize()
    }), 201


@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/options/<int:option_id>', methods=['DELETE'])
def delete_bet_option(pg_id, bet_id, option_id):

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)

    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        raise APIException("Bet not found", 404)

    option = BetOption.query.filter_by(id=option_id, bet_id=bet_id).first()
    if not option:
        raise APIException("Option not found", 404)

    db.session.delete(option)
    db.session.commit()

    return jsonify({"message": "Option deleted successfully"}), 200


@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/options/<int:option_id>', methods=['PUT'])
def update_bet_option(pg_id, bet_id, option_id):
    body = request.get_json()

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)

    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        raise APIException("Bet not found", 404)

    option = BetOption.query.filter_by(id=option_id, bet_id=bet_id).first()
    if not option:
        raise APIException("Option not found", 404)

    label = body.get('label')
    if not label or not label.strip():
        raise APIException("Label is required", 400)
 
    option.label = label

    db.session.commit()

    return jsonify({
        "message": "Option updated succesfully",
        "option": option.serialize()
    }), 200

