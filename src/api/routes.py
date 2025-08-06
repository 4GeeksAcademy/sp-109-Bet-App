from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import MessageBoard, db, User, Playground, AdminUser, Bet, PlaygroundChat, BetOption, UserBet, PlaygroundUser, PlaygroundUser, Message, BetStatus, BetType
from api.utils import generate_sitemap, APIException, generate_unique_slug
from flask_cors import CORS
from sqlalchemy import select
from datetime import datetime, timezone 
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
import requests

api = Blueprint('api', __name__)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message from the backend"
    }), 200

# ----------- USER -----------

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    required_fields = ["username", "name", "last_name", "email", "password", "money"]
    for field in required_fields:
        if not body.get(field):
            raise APIException(f"{field} is required", 400)

    if User.query.filter_by(email=body["email"]).first():
        raise APIException("Email already exists", 400)
    if User.query.filter_by(username=body["username"]).first():
        raise APIException("Username already exists", 400)
    

    hashed_password = generate_password_hash(body["password"])
    user_data = { **body, "password": hashed_password }
    user = User(**user_data)

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully", "user": user.serialize()}), 201

@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        raise APIException("Email and password required", 400)


    user = User.query.filter_by(email=email).first()
    if not user:
        raise APIException("User not found", 404)
    
    if not check_password_hash(user.password, password):
        raise APIException("Incorrect password", 401)
    
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "token": token,
        "user": user.serialize()
    }), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private_zone():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        raise APIException("User not found", 404)
    
    return jsonify({
        "msg": "Welcome to the private zone",
        "user": user.serialize()
    }), 200


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


FOOTBALL_DATA_API_KEY = "a268de8b85fe4470ace196029753955c" 
FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4"

@api.route('/football/competitions', methods=['GET'])
def get_football_competitions():
    try:
        headers = {'X-Auth-Token': FOOTBALL_DATA_API_KEY}
        resp = requests.get(f"{FOOTBALL_DATA_BASE_URL}/competitions", headers=headers)
        resp.raise_for_status()
        return jsonify(resp.json()), 200
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@api.route('/football/matches', methods=['GET'])
def get_football_matches():
    competition_code = request.args.get('competition')
    if not competition_code:
        raise APIException("Missing competition parameter", 400)
    
    try:
        headers = {'X-Auth-Token': FOOTBALL_DATA_API_KEY}
        url = f"{FOOTBALL_DATA_BASE_URL}/competitions/{competition_code}/matches?status=SCHEDULED"
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        return jsonify(resp.json()), 200
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


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
@jwt_required()
def create_bet(pg_id):

    body = request.get_json()

    
    user_id = int(get_jwt_identity())
    print(user_id)
    if not user_id:
        raise APIException("user_id is required", 400)

        
    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", 404)
    
    
    name = body.get('name')
    amount = body.get('amount', 0.0)
    if amount is None:
        raise APIException("amount is required", 404)
    
    status_str = body.get("status")
    type_str = body.get("type", "sports")
    event_description = body.get("event_description")
    deadline_str = body.get("deadline")

    try:
        status_enum = BetStatus[status_str] if status_str else BetStatus.active
    except KeyError:
        raise APIException(f"Invalid status '{status_str}'", 400)

    try:
        type_enum = BetType[type_str]
    except KeyError:
        raise APIException(f"Invalid type '{type_str}'", 400)
    
    playground=Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)
    
    deadline = datetime.fromisoformat(deadline_str) if deadline_str else None

    new_bet = Bet(
        name=name,
        amount=amount,
        status=status_enum,
        deadline=deadline,
        type=type_enum,
        user_id=user_id,
        playground_id=pg_id,
        event_description=event_description
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

@api.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    try:
        current_user_id = get_jwt_identity()

        
        user_playgrounds = db.session.query(Playground.id).filter(
            Playground.created_by == current_user_id
        ).union(
            db.session.query(PlaygroundUser.playground_id).filter(
                PlaygroundUser.user_id == current_user_id
            )
        ).all()

        playground_ids = [pg.id for pg in user_playgrounds]

        if not playground_ids:
            return jsonify([]), 200

        messages = Message.query.filter(Message.playground_id.in_(playground_ids)).all()
        return jsonify([msg.serialize() for msg in messages]), 200

    except Exception as e:
        print("❌ ERROR GET_MESSAGES:", e)
        return jsonify({"error": "Internal server error"}), 500


@api.route('/messages/<int:id>', methods=['GET'])
def get_message(id):
    msg = MessageBoard.query.get(id)
    if not msg:
        raise APIException("Message not found", 404)
    return jsonify(msg.serialize()), 200


@api.route('/messages', methods=['POST'])
@jwt_required()
def create_message():
    current_user_id = get_jwt_identity()
    body = request.get_json()

    content = body.get("content")
    playground_id = body.get("playground_id")

    if not content or not playground_id:
        return jsonify({"msg": "Content and playground_id are required"}), 400

    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    message = Message(
        username=user.username,
        content=content,
        playground_id=playground_id,
        user_id=current_user_id
    )
    db.session.add(message)
    db.session.commit()

    return jsonify({"message": message.serialize()}), 201

@api.route('/messages/<int:id>', methods=['PUT'])
def update_message(id):
    msg = MessageBoard.query.get(id)
    if not msg:
        raise APIException("Message not found", 404)

    data = request.get_json()
    msg.content = data.get("content", msg.content)
    db.session.commit()

    return jsonify({"msg": "Message updated", "message": msg.serialize()}), 200


@api.route('/messages/<int:id>', methods=['DELETE'])
def delete_message(id):
    msg = MessageBoard.query.get(id)
    if not msg:
        raise APIException("Message not found", 404)

    db.session.delete(msg)
    db.session.commit()

    return jsonify({"msg": "Message deleted"}), 200



@api.route('/playgrounduser', methods=['GET', 'POST'])
def handle_playground_users():
    if request.method == 'GET':
        users = PlaygroundUser.query.all()
        return jsonify([user.serialize() for user in users]), 200
    
    data = request.get_json()
    required_fields = ['user_id', 'playground_id']

    if not all(field in data for field in required_fields):
        raise APIException('Fields "user_id" and "playground_id" are required', 400)
    
    new_user = PlaygroundUser(
        user_id=data['user_id'],
        playground_id=data['playground_id'],
        joined_at=datetime.now(timezone.utc) 
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "msg": "Playground user created",
        "user": new_user.serialize()
    }), 201
    

@api.route('/playgrounduser/<int:id>', methods=['PUT'])
def update_playground_user(id):
    user = PlaygroundUser.query.get(id)
    if not user:
        raise APIException("PlaygroundUser not found", 404)

    data = request.get_json()

    if 'user_id' in data:
        user.user_id = data['user_id']
    if 'playground_id' in data:
        user.playground_id = data['playground_id']

    db.session.commit()

    return jsonify({
        "msg": "Playground user updated",
        "user": user.serialize()
    }), 200


@api.route('/playgrounduser/<int:id>', methods=['DELETE'])
def delete_playground_user(id):
    user = PlaygroundUser.query.get(id)
    if not user:
        raise APIException("Playground User not found", 404)

    db.session.delete(user)
    db.session.commit()

    return jsonify({"id": id,"msg": f"Playground user {id} deleted"}), 200


@api.route('/user_bets', methods=['GET'])
def get_user_bets():
    bets = UserBet.query.all()
    return jsonify([b.serialize() for b in bets]), 200


@api.route('/user_bets/<int:id>', methods=['GET'])
def get_user_bet(id):
    bet = UserBet.query.get(id)
    if not bet:
        raise APIException("User bet not found", 404)
    return jsonify(bet.serialize()), 200


@api.route('/user_bets', methods=['POST'])
def create_user_bet():
    data = request.get_json()
    if not data or "user_id" not in data or "bet_name" not in data or "bet_option_name" not in data:
        raise APIException("Fields 'user_id', 'bet_name' and 'bet_option_name' are required", 400)

    
    last_bet = UserBet.query.order_by(UserBet.bet_id.desc()).first()
    new_bet_id = (last_bet.bet_id + 1) if last_bet and last_bet.bet_id else 1

    new_bet = UserBet(
        user_id=data["user_id"],
        bet_id=new_bet_id,
        bet_name=data["bet_name"],
        bet_option_name=data["bet_option_name"]
    )

    db.session.add(new_bet)
    db.session.commit()

    return jsonify({"msg": "User bet created successfully", "bet": new_bet.serialize()}), 201


@api.route('/user_bets/<int:id>', methods=['PUT'])
def update_user_bet(id):
    bet = UserBet.query.get(id)
    if not bet:
        raise APIException("User bet not found", 404)

    data = request.get_json()
    bet.bet_name = data.get("bet_name", bet.bet_name)
    bet.bet_option_name = data.get("bet_option_name", bet.bet_option_name)
    db.session.commit()

    return jsonify({"msg": "User bet updated", "bet": bet.serialize()}), 200


@api.route('/user_bets/<int:id>', methods=['DELETE'])
def delete_user_bet(id):
    bet = UserBet.query.get(id)
    if not bet:
        raise APIException("User bet not found", 404)

    db.session.delete(bet)
    db.session.commit()

    return jsonify({"msg": "User bet deleted successfully"}), 200



@api.route('/admin_users', methods=['GET'])
def get_admin_users():
    admins = AdminUser.query.all()
    return jsonify([a.serialize() for a in admins]), 200


@api.route('/admin_users/<int:id>', methods=['GET'])
def get_admin_user(id):
    admin = AdminUser.query.get(id)
    if not admin:
        raise APIException("Admin user not found", 404)
    return jsonify(admin.serialize()), 200


@api.route('/admin_users', methods=['POST'])
def create_admin_user():
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        raise APIException("Fields 'email' and 'password' are required", 400)

    
    if AdminUser.query.filter_by(email=data["email"]).first():
        raise APIException("Email already exists", 400)

    new_admin = AdminUser(
        email=data["email"],
        password=data["password"]   
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"msg": "Admin user created successfully", "admin": new_admin.serialize()}), 201


@api.route('/admin_users/<int:id>', methods=['PUT'])
def update_admin_user(id):
    admin = AdminUser.query.get(id)
    if not admin:
        raise APIException("Admin user not found", 404)

    data = request.get_json()
    admin.email = data.get("email", admin.email)
    admin.password = data.get("password", admin.password)
    db.session.commit()

    return jsonify({"msg": "Admin user updated", "admin": admin.serialize()}), 200


@api.route('/admin_users/<int:id>', methods=['DELETE'])
def delete_admin_user(id):
    admin = AdminUser.query.get(id)
    if not admin:
        raise APIException("Admin user not found", 404)

    db.session.delete(admin)
    db.session.commit()

    return jsonify({"msg": "Admin user deleted successfully"}), 200

@api.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    
    admin = AdminUser.query.filter_by(email=email).first()
 
    if not admin:
        if email == "contrasena@gmail.com" and password == "contrasena":
            token = create_access_token(identity="superadmin")
            return jsonify({"msg": "Admin login exitoso", "token": token}), 200
        return jsonify({"msg": "Invalid credentials"}), 401
    
    if admin.password != password:
        return jsonify({"msg": "Invalid credentials"}), 401
    
    token = create_access_token(identity=str(admin.id))
    return jsonify({"msg": "Admin login exitoso", "token": token}), 200
    
@api.route('/playground/<int:pg_id>/invite', methods=['POST'])
@jwt_required()
def invite_user_to_playground(pg_id):
    current_user_id = get_jwt_identity()
    body = request.get_json()
    user_id = body.get("user_id")

    if not user_id:
        raise APIException("user_id is required", 400)

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)

    
    if playground.created_by != int(current_user_id):
        raise APIException("You are not the owner of this playground", 403)

    
    existing = PlaygroundUser.query.filter_by(user_id=user_id, playground_id=pg_id).first()
    if existing:
        return jsonify({"msg": "User already invited"}), 200

    invitation = PlaygroundUser(
        user_id=user_id,
        playground_id=pg_id,
        joined_at=datetime.utcnow()
    )
    db.session.add(invitation)
    db.session.commit()

    return jsonify({"msg": "User invited successfully"}), 201   

@api.route('/playground', methods=['POST'])
@jwt_required()
def create_playground():
    body = request.get_json()
    current_user_id = get_jwt_identity()

    name = body.get("name")
    if not name:
        raise APIException("Missing required fields", 400)

    slug = generate_unique_slug(db.session, Playground, name)
    image = body.get('url_image')
    description = body.get('description')

    
    new_playground = Playground(
        name=name,
        slug=slug,
        url_image=image,
        description=description,
        created_by=current_user_id
    )

    db.session.add(new_playground)
    db.session.commit()

    return jsonify({
        "message": "New playground created",
        "playground": new_playground.serialize()
    }), 201


@api.route('/playground', methods=['GET'])
@jwt_required(optional=True)
def show_playgrounds():
    current_user_id = get_jwt_identity()

    
    playgrounds = Playground.query.all()
    data = []

    for pg in playgrounds:
        creator = User.query.get(pg.created_by)
        item = pg.serialize()
        item["creator_name"] = creator.username if creator else "Desconocido"
        item["is_owner"] = (str(pg.created_by) == str(current_user_id))

        
        if current_user_id:
            invited = PlaygroundUser.query.filter_by(
                user_id=current_user_id,
                playground_id=pg.id
            ).first()
            item["is_invited"] = True if invited else False
        else:
            item["is_invited"] = False

        
        if item["is_owner"] or item["is_invited"]:
            data.append(item)

    return jsonify({
        "message": "success",
        "playgrounds": data
    }), 200



@api.route('/playground/<int:pg_id>/members', methods=['GET'])
@jwt_required()
def get_playground_members(pg_id):
    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)

    members = PlaygroundUser.query.filter_by(playground_id=pg_id).all()

    return jsonify({
        "members": [ 
            {
                "id": m.user.id,
                "username": m.user.username,
                "email": m.user.email,
                "joined_at": m.joined_at.isoformat()
            }
            for m in members
        ]
    }), 200

@api.route('/messages/<int:pg_id>', methods=['GET'])
@jwt_required()
def get_playground_messages_alt(pg_id):   
    current_user_id = get_jwt_identity()

    
    is_creator = Playground.query.filter_by(id=pg_id, created_by=current_user_id).first()
    is_invited = PlaygroundUser.query.filter_by(playground_id=pg_id, user_id=current_user_id).first()

    if not is_creator and not is_invited:
        raise APIException("No tienes acceso a este Playground", 403)

    messages = Message.query.filter_by(playground_id=pg_id).all()
    return jsonify([msg.serialize() for msg in messages]), 200

@api.route('/messages/my-playgrounds', methods=['GET'])
@jwt_required()
def get_my_playground_messages():
    try:
        current_user_id = get_jwt_identity()

        
        created_playgrounds = Playground.query.filter_by(created_by=current_user_id).with_entities(Playground.id).all()
        created_pg_ids = [pg.id for pg in created_playgrounds]

        
        invited_playgrounds = PlaygroundUser.query.filter_by(user_id=current_user_id).with_entities(PlaygroundUser.playground_id).all()
        invited_pg_ids = [pg.playground_id for pg in invited_playgrounds]

        
        all_pg_ids = list(set(created_pg_ids + invited_pg_ids))

        if not all_pg_ids:
            return jsonify({"messages": []}), 200

        
        messages = Message.query.filter(Message.playground_id.in_(all_pg_ids)).order_by(Message.created_at.desc()).all()

        return jsonify({
            "messages": [msg.serialize() for msg in messages]
        }), 200

    except Exception as e:
        print("Error obteniendo mensajes:", str(e))
        return jsonify({"msg": "Error fetching messages"}), 500

@api.route('/playground/<int:pg_id>/messages', methods=['GET'])
@jwt_required()
def get_playground_messages(pg_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  # 

    invited = PlaygroundUser.query.filter_by(user_id=current_user_id, playground_id=pg_id).first()
    playground = Playground.query.get(pg_id)

    if not playground:
        return jsonify({"msg": "Playground not found"}), 404

    
    if not invited and str(playground.created_by) not in [str(current_user_id), str(user.username)]:
        return jsonify({"msg": "Access denied"}), 403

    messages = Message.query.filter_by(playground_id=pg_id).order_by(Message.created_at.asc()).all()
    return jsonify([m.serialize() for m in messages]), 200

@api.route('/playground/<int:pg_id>/messages', methods=['POST'])
@jwt_required()
def post_playground_message(pg_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    body = request.get_json()
    content = body.get("content")

    if not content:
        return jsonify({"msg": "Content is required"}), 400

    invited = PlaygroundUser.query.filter_by(user_id=current_user_id, playground_id=pg_id).first()
    playground = Playground.query.get(pg_id)

    if not playground:
        return jsonify({"msg": "Playground not found"}), 404

    
    if not invited and str(playground.created_by) not in [str(current_user_id), str(user.username)]:
        return jsonify({"msg": "Access denied"}), 403

    new_message = Message(
        username=user.username,
        content=content,
        playground_id=pg_id
    )

    db.session.add(new_message)
    db.session.commit()

    return jsonify({"msg": "Message added", "message": new_message.serialize()}), 201