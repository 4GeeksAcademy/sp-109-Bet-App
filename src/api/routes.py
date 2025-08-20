from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import MessageBoard, db, User, Playground, AdminUser, Bet, PlaygroundChat, BetOption, UserBet, PlaygroundUser, PlaygroundUser, Message, BetStatus, BetType, PlaygroundAccessRequest
from api.utils import generate_sitemap, APIException, generate_unique_slug
from flask_cors import CORS
from sqlalchemy import select
from datetime import datetime, timezone 
from apscheduler.schedulers.background import BackgroundScheduler
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import check_password_hash, generate_password_hash
import requests
import os
from api.football_data import fd_get_match

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message from the backend"
    }), 200

@api.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", 404)

    # Playgrounds en los que participa
    playground_users = PlaygroundUser.query.filter_by(user_id=user_id).all()
    playgrounds = [pu.playground for pu in playground_users]

    # Playgrounds creados por el usuario
    created_playgrounds = Playground.query.filter_by(created_by=user_id).all()

    # Apuestas activas del usuario
    active_bets = (
        db.session.query(Bet)
        .join(UserBet, UserBet.bet_id == Bet.id)
        .filter(UserBet.user_id == user_id, Bet.status == BetStatus.active)
        .all()
    )

    # Apuestas disponibles (en playgrounds donde participa pero aún no ha votado)
    available_bets = (
        db.session.query(Bet)
        .filter(
            Bet.playground_id.in_([pg.id for pg in playgrounds]),
            Bet.status == BetStatus.active,
            ~Bet.id.in_(
                db.session.query(UserBet.bet_id).filter_by(user_id=user_id)
            )
        )
        .all()
    )

    # Historial de apuestas resueltas
    history_bets = (
        db.session.query(Bet)
        .join(UserBet, UserBet.bet_id == Bet.id)
        .filter(UserBet.user_id == user_id, Bet.status == BetStatus.resolved)
        .order_by(Bet.id.desc())
        .limit(5)
        .all()
    )

    return jsonify({
        "user": user.serialize(),
        "playgroundsJoined": [pu.serialize() for pu in playground_users],
        "playgroundsCreated": [pg.serialize() for pg in created_playgrounds],
        "activeBets": [b.serialize_with_votes(user_id=user_id) for b in active_bets],
        "availableBets": [b.serialize_with_votes(user_id=user_id) for b in available_bets],
        "history": [b.serialize_with_votes(user_id=user_id) for b in history_bets]
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
    
    token = create_access_token(identity=str(user.id), additional_claims={
        "email": user.email,
        "role": "user" 
    })
    
    return jsonify({
        "token": token,
        "user_id": user.id,
        "user": user.serialize(),
        "role": "user"
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
@jwt_required()
def get_users():
    return jsonify([user.serialize() for user in User.query.all()]), 200


@api.route('/user', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def handle_user():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        raise APIException("User not found", 404)

    if request.method == 'GET':
        return jsonify(user.serialize()), 200

    if request.method == 'PUT':
        data = request.get_json()
        for field in ["username", "name", "last_name", "email", "password", "money", "is_active", "address", "latitude", "longitude"]:
            if field in data:
                if field in ["latitude", "longitude"]:
                    if data[field] is None:
                        setattr(user, field, None)
                    else:
                        try:
                            setattr(user, field, float(data[field]))
                        except (ValueError, TypeError):
                            raise APIException(f"Invalid value for {field}", 400)
                else:
                    setattr(user, field, data[field])
        db.session.commit()
        return jsonify({"msg": "User updated", "user": user.serialize()}), 200


    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted"}), 200



# ----------- ADMIN USER -----------

# @api.route('/adminuser', methods=['GET', 'POST'])
# def handle_adminuser():
#     if request.method == 'GET':
#         return jsonify([admin.serialize() for admin in AdminUser.query.all()]), 200

#     data = request.get_json()
#     if 'email' not in data or 'password' not in data:
#         raise APIException('Fields "email" and "password" are required', 400)

#     admin = AdminUser(email=data['email'], password=data['password'])
#     db.session.add(admin)
#     db.session.commit()
#     return jsonify({"msg": "Admin created", "admin": admin.serialize()}), 201

# @api.route('/adminuser/<int:id>', methods=['GET', 'PUT', 'DELETE'])
# def handle_single_admin(id):
#     admin = AdminUser.query.get(id)
#     if not admin:
#         raise APIException('Admin not found', 404)

#     if request.method == 'GET':
#         return jsonify(admin.serialize()), 200

#     if request.method == 'PUT':
#         data = request.get_json()
#         admin.email = data.get('email', admin.email)
#         admin.password = data.get('password', admin.password)
#         db.session.commit()
#         return jsonify({"msg": "Admin updated"}), 200

#     db.session.delete(admin)
#     db.session.commit()
#     return jsonify({"msg": "Admin deleted"}), 200


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
    status = request.args.get('status', 'SCHEDULED')
    
    if not competition_code:
        raise APIException("Missing competition parameter", 400)
    
    try:
        headers = {'X-Auth-Token': FOOTBALL_DATA_API_KEY}
        params = {'status': status}
        url = f"{FOOTBALL_DATA_BASE_URL}/competitions/{competition_code}/matches?status=SCHEDULED"
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        return jsonify(resp.json()), 200
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
# Lectura del resultado final del partido concreto 
@api.route('/football/matches/<int:match_id>', methods=['GET'])
def get_football_match_by_id(match_id):
    try:
        headers = {'X-Auth-Token': FOOTBALL_DATA_API_KEY}
        url = f"{FOOTBALL_DATA_BASE_URL}/matches/{match_id}"
        resp = requests.get(url, headers=headers, timeout=15)
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


# @api.route('/playground/<int:pg_id>/bet/<int:bet_id>', methods=['GET'])
# def get_single_bet(pg_id, bet_id):
    
#     playground = Playground.query.get(pg_id)
#     if not playground:
#         raise APIException("Playground not found", 404)
    
#     bet = Bet.query.filter_by(playground_id=pg_id, id=bet_id).first()
#     if not bet:
#         raise APIException("Bet not found in this playground", 404)

#     return jsonify(bet.serialize()), 200


@api.route('/playground/<int:pg_id>/bet', methods=['POST'])
@jwt_required()
def create_bet(pg_id):

    body = request.get_json(silent=True) or {}
    user_id = int(get_jwt_identity())

    # -- validar usuario y playground ---   
    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", 404)
    
    playground=Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)
    
    # --- campos base ---
    name = (body.get('name') or '').strip()
    if not name:
        raise APIException("Name is required", 400)
    
    amount = body.get('amount')
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        raise APIException("Amount must be a number", 400)
    
    status_str = body.get("status")
    type_str = body.get("type", "sports")

    event_description = body.get("event_description")
    deadline_str = body.get("deadline")

    league = body.get("league")
    match = body.get("match")

    # --- sports de Api ---
    competition_code   = body.get("competition_code")
    external_match_id  = body.get("external_match_id")

    options = body.get('options', [])
    if not options or not isinstance(options, list):
        raise APIException("At least one option is required", 400)

    try:
        status_enum = BetStatus[status_str] if status_str else BetStatus.active
    except KeyError:
        raise APIException(f"Invalid status '{status_str}'", 400)

    try:
        type_enum = BetType[type_str]
    except KeyError:
        raise APIException(f"Invalid type '{type_str}'", 400)
    
    # --- Deadline ---
    # Si ES sports: el deadline viene de la API (external_match_id)
    # Si NO es sports: usamos el deadline indicado por creador bet

    def parse_iso(s: str) -> datetime:
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
        if dt.tzinfo is not None:
            dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
        return dt
    
    deadline = None

# --- deadline según tipo ---

    if type_enum == BetType.sports:
        if external_match_id:
            try:
                emid = int(external_match_id)
            except (TypeError, ValueError):
                raise APIException("external_match_id must be an integer", 400)
            
            api_key = os.getenv("FOOTBALL_DATA_API_KEY")
            if not api_key:
                raise APIException("FOOTBALL_DATA_API_KEY is not configured", 500)
            
            try:
                r = requests.get(
                    f"https://api.football-data.org/v4/matches/{emid}",
                    headers={"X-Auth-Token": api_key},
                    timeout=10
                )
                r.raise_for_status()
                data = r.json()
            except requests.RequestException as e:
                raise APIException(f"Failed to loading match from Football-Data: {e}", 502)
            
            match_payload = data.get("match", data)
            utc_date = match_payload.get("utcDate")
            if not utc_date:
                raise APIException("External API did not return 'utcDate' for the match", 502)
            # deadline = kickoff del partido (UTC)
            deadline = parse_iso(utc_date)

            external_match_id = emid
        else:
            # Apuesta deportiva sin external_match_id: no ponemos deadline automático
            deadline = None
    else:
        # NO sports: permitimos enviar deadline manual
        if deadline_str:
            try:
                deadline = parse_iso(deadline_str)
            except Exception:
                raise APIException("Invalid deadline format (use ISO 8601)", 400)
    
    # --- Opciones ---
    bet_options = []
    for opt in options:
        label = (opt.get('label') or '').strip()
        if not label:
            raise APIException("Option label is required", 400)
        ext_team_id = opt.get("external_team_id")
        try:
            ext_team_id = int(ext_team_id) if ext_team_id is not None else None
        except (TypeError, ValueError):
            ext_team_id = None

        bet_options.append(BetOption(label=label, external_team_id=ext_team_id))

     # --- Crear bet ---
    new_bet = Bet(
        name=name,
        amount=amount,
        status=status_enum,
        deadline=deadline,
        type=type_enum,
        user_id=user_id,
        playground_id=pg_id,
        league=league,
        match=match,
        event_description=event_description,
        options=bet_options,
        competition_code=competition_code,
        external_match_id=external_match_id
    )

    db.session.add(new_bet)
    db.session.commit()

    return jsonify({
        "message": "New bet created succesfully",
        "bet": new_bet.serialize()
    }), 201


@api.route('/playground/<int:pg_id>/bet/<int:bet_id>', methods=['DELETE'])
@jwt_required()
def delete_single_bet(pg_id, bet_id):
    user_id = int(get_jwt_identity())
    user_role = get_jwt().get("role")

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)
    
    bet = Bet.query.filter_by(playground_id=pg_id, id=bet_id).first()
    if not bet:
        raise APIException("Bet not found in this playground", 404)
    
    if user_role != "admin" and bet.user_id != user_id:
        raise APIException("You are not authorized to delete this bet", 403)
    
    db.session.delete(bet)
    db.session.commit()

    return jsonify({
        "message": "Bet deleted successfully", 
        "bet_id": bet_id,
        "playground_id": pg_id
    }), 200



@api.route('/playground/<int:pg_id>/bet/<int:bet_id>', methods=['PUT'])
@jwt_required()
def update_bet(pg_id, bet_id):
    jwt_data = get_jwt()
    user_role = jwt_data.get("role")
    user_id = get_jwt_identity()
    body = request.get_json()

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)

    bet = Bet.query.filter_by(playground_id=pg_id, id=bet_id).first()
    if not bet:
        raise APIException("Bet not found", 404)
    
    if user_role != "admin" and bet.user_id != int(user_id):
        raise APIException("You are not authorized to update this bet", 403)
    
    bet.name = body.get('name', bet.name)
    bet.amount = body.get('amount', bet.amount)
    bet.event_description = body.get('event_description', bet.event_description)
    bet.league = body.get("league", bet.league)
    bet.match = body.get("match", bet.match)



    if bet.amount is None:
        raise APIException("Amount is required", 404)
    
    type_str = body.get("type")
    if type_str:
        try:
            bet.type = BetType[type_str]
        except KeyError:
            raise APIException(f"Invalid type '{type_str}'", 400)


    new_options = body.get('options', [])
    if not isinstance(new_options, list) or not new_options:
        raise APIException("At least one option is required", 400)

    current_options_by_id = {opt.id: opt for opt in bet.options}
    updated_options = []

    for opt in new_options:
        label = opt.get('label')
        if not label:
            raise APIException("Each option must have a label", 400)

        opt_id = opt.get('id')
        if opt_id and opt_id in current_options_by_id:
            existing_opt = current_options_by_id.pop(opt_id)
            existing_opt.label = label
            updated_options.append(existing_opt)
        else:
            new_opt = BetOption(label=label)
            updated_options.append(new_opt)

    for deleted_opt in current_options_by_id.values():
        db.session.delete(deleted_opt)

    bet.options = updated_options

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
        "message": "Bet updated successfully",
        "bet": bet.serialize()
    }), 200


#-------------- USER-BET ------------------

@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/vote', methods=['POST'])
@jwt_required()
def vote_bet_option(pg_id, bet_id):
    user_id = int(get_jwt_identity())
    body = request.get_json(silent=True) or {}
    option_id = body.get("option_id")

    try:
        option_id = int(option_id) if option_id is not None else None
    except (TypeError, ValueError):
        option_id = None

    if not option_id:
        raise APIException("Option ID is required", 400)

    # Validar que la apuesta existe y pertenece al playground
    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        raise APIException("Bet not found in this playground", 404)

    # Bloqueo por estado/tiempo
    if bet.status in (BetStatus.locked, BetStatus.resolved, BetStatus.cancelled):
        return jsonify({"message": "Bet is not open for voting"}), 400

    if bet.deadline and bet.deadline <= datetime.utcnow():
        return jsonify({"message": "Bet deadline passed"}), 400

    # Validar que la opción pertenece a la apuesta
    option = BetOption.query.filter_by(id=option_id, bet_id=bet_id).first()
    if not option:
        raise APIException("Option not found or doesn't belong to the bet", 404)

    # Validar que el usuario existe
    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", 404)

    # Validar saldo suficiente
    if user.money < bet.amount:
        raise APIException("Insufficient balance to participate", 400)

    # Validar que el usuario no haya votado ya
    existing_vote = UserBet.query.filter_by(user_id=user_id, bet_id=bet_id).first()
    if existing_vote:
        raise APIException("You have already voted and cannot change your vote", 400)

    # Registrar voto
    new_user_bet = UserBet(
        user_id=user_id,
        bet_id=bet_id,
        option_id=option_id
    )
    db.session.add(new_user_bet)

    # Descontar dinero del usuario
    user.money -= bet.amount

    db.session.commit()

    # Devolver la apuesta actualizada
    return jsonify(bet.serialize_with_votes(user_id=user_id)), 200




@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/options', methods=['GET'])
def get_bet_options(pg_id, bet_id):
    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        raise APIException("Bet not found", 404)

    options = BetOption.query.filter_by(bet_id=bet_id).all()

    return jsonify([option.serialize() for option in options]), 200

@api.route('/playground/<int:pg_id>/bet/<int:bet_id>', methods=['GET'])
@jwt_required()
def get_bet(pg_id, bet_id):
    user_id = get_jwt_identity() 

    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        raise APIException("Bet not found", 404)

    return jsonify(bet.serialize_with_votes(user_id=user_id)), 200


# @api.route('/playground/<int:pg_id>/bet/<int:bet_id>/options', methods=['POST'])
# def create_bet_option_2(pg_id, bet_id):
#     body = request.get_json()

#     playground = Playground.query.get(pg_id)
#     if not playground:
#         raise APIException("Playground not found", 404)

#     bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
#     if not bet:
#         raise APIException("Bet not found", 404)

#     label = body.get('label')
#     if not label or not label.strip():
#         raise APIException("Label is required", 400)

#     new_option = BetOption(label=label, bet_id=bet_id)
#     db.session.add(new_option)
#     db.session.commit()

#     return jsonify({
#         "message": "New option created succesfully",
#         "bet": new_option.serialize()
#     }), 201


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
@jwt_required()
def get_admin_users():
    admins = AdminUser.query.all()
    return jsonify([a.serialize() for a in admins]), 200


@api.route('/admin_users/<int:id>', methods=['GET'])
@jwt_required()
def get_admin_user(id):
    current_user = get_jwt_identity()
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
    
    hashed_password =  generate_password_hash(data["password"])

    new_admin = AdminUser(
        email=data["email"],
        password=hashed_password  
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"msg": "Admin user created successfully", "admin": new_admin.serialize()}), 201


@api.route('/admin_users/<int:id>', methods=['PUT'])
@jwt_required()
def update_admin_user(id):
    current_user = get_jwt_identity()
    admin = AdminUser.query.get(id)
    if not admin:
        raise APIException("Admin user not found", 404)

    data = request.get_json()
    admin.email = data.get("email", admin.email)
    if "password" in data and data["password"]:
        admin.password = generate_password_hash(data["password"])
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
            token = create_access_token(
                identity="superadmin",
                additional_claims={
                    "email": email,
                    "role": "admin"
                }
            )
            return jsonify({"msg": "Admin login exitoso", "token": token}), 200
        return jsonify({"msg": "Invalid credentials"}), 401

    if not check_password_hash(admin.password, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(admin.id),
        additional_claims={
            "email": admin.email,
            "role": "admin"
        }
    )
    return jsonify({
        "msg": "Admin login exitoso",
        "token": token,
        "admin": admin.serialize(),
        "role": "admin"
    }), 200

    
@api.route('/playground/<int:pg_id>/invite', methods=['POST'])
@jwt_required()
def invite_user_to_playground(pg_id):
    current_user_id = int(get_jwt_identity())
    body = request.get_json()
    user_id = body.get("user_id")

    if not user_id:
        raise APIException("user_id is required", 400)

    playground = Playground.query.get(pg_id)
    if not playground:
        raise APIException("Playground not found", 404)

    if playground.created_by != current_user_id:
        raise APIException("You are not the owner of this playground", 403)

    # Ya miembro?
    if PlaygroundUser.query.filter_by(user_id=user_id, playground_id=pg_id).first():
        return jsonify({"msg": "El usuario ya es miembro"}), 200

    # ¿Ya existe una invitación o solicitud pendiente?
    existing = PlaygroundAccessRequest.query.filter_by(
        user_id=user_id, playground_id=pg_id
    ).filter(PlaygroundAccessRequest.status.in_(["pending", "invited"])).first()
    if existing:
        return jsonify({"msg": "Ya hay una solicitud/invitación pendiente"}), 200

    # Creamos INVITACIÓN (owner -> user)
    invitation = PlaygroundAccessRequest(
        user_id=user_id,
        playground_id=pg_id,
        status="invited"
    )
    db.session.add(invitation)
    db.session.commit()

    return jsonify({"msg": "Invitación enviada"}), 201

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


@api.route('/playground/all', methods=['GET'])
@jwt_required()
def get_all_playgrounds():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    playgrounds = Playground.query.all()
    return jsonify({"playgrounds": [pg.serialize() for pg in playgrounds]}), 200


@api.route('/adminuser/private', methods=['GET'])
@jwt_required()
def admin_private():
    claims = get_jwt()
    print("Claims:", claims)
    if claims.get("role") != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    return jsonify({
        "admin": {
            "email": claims.get("email"),
            "role": claims.get("role")
        }
    }), 200




@api.route('/admin_bets/all', methods=['GET'])
@jwt_required()
def get_admin_bets():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    bets = Bet.query.all()
    return jsonify({"bets": [bet.serialize() for bet in bets]}), 200

@api.route('/admin_bets/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_admin_bet(id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    bet = Bet.query.get(id)
    if not bet:
        return jsonify({"msg": "Bet not found"}), 404

    db.session.delete(bet)
    db.session.commit()

    return jsonify({"msg": "Bet deleted"}), 200

@api.route('/admin_bets/<int:id>', methods=['PUT'])
@jwt_required()
def update_admin_bet(id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    bet = Bet.query.get(id)
    if not bet:
        return jsonify({"msg": "Bet not found"}), 404 

    data = request.get_json()

    allowed_fields = ["name", "amount", "status", "deadline", "user_id", "playground_id"]
    for field in allowed_fields:
        if field in data:
            setattr(bet, field, data[field])

    db.session.commit()

    return jsonify({"msg": "Bet updated", "bet": bet.serialize()}), 200

@api.route('/playgrounds/search', methods=['GET'])
@jwt_required()
def search_playgrounds():
    query = request.args.get("q", "").strip().lower()
    if len(query) < 1:
        results = Playground.query.order_by(Playground.created_at.desc()).limit(5).all()
    else:
        results = Playground.query.filter(Playground.name.ilike(f"%{query}%")).limit(5).all()

    return jsonify([{
        "id": pg.id,
        "name": pg.name,
        "slug": pg.slug,
        "created_by": pg.created_by
    } for pg in results]), 200


@api.route('/playground/<int:pg_id>/access-request', methods=['POST'])
@jwt_required()
def request_playground_access(pg_id):
    user_id = get_jwt_identity()

    existing = PlaygroundAccessRequest.query.filter_by(
        user_id=user_id, playground_id=pg_id, status="pending"
    ).first()

    if existing:
        return jsonify({"msg": "Solicitud ya enviada"}), 400

    new_req = PlaygroundAccessRequest(
        user_id=user_id,
        playground_id=pg_id
    )

    db.session.add(new_req)
    db.session.commit()

    return jsonify({"msg": "Solicitud enviada"}), 201

@api.route('/requests', methods=['GET'])
@jwt_required()
def get_requests():
    current_user_id = int(get_jwt_identity())

    # Lo que recibe el OWNER (usuarios que pidieron acceso)
    received_owner = PlaygroundAccessRequest.query.join(Playground).filter(
        Playground.created_by == current_user_id,
        PlaygroundAccessRequest.status == "pending"
    ).all()

    # Invitaciones que el usuario HA RECIBIDO del owner
    received_invites = PlaygroundAccessRequest.query.filter_by(
        user_id=current_user_id, status="invited"
    ).all()

    # Solicitudes que yo ENVIÉ (no incluye invitaciones)
    sent = PlaygroundAccessRequest.query.filter_by(
        user_id=current_user_id
    ).filter(PlaygroundAccessRequest.status != "invited").all()

    return jsonify({
        "received": [r.serialize() for r in (received_owner + received_invites)],
        "sent": [r.serialize() for r in sent]
    }), 200

@api.route('/requests', methods=['POST'])
@jwt_required()
def create_access_request():
    current_user_id = get_jwt_identity()
    body = request.get_json()
    pg_id = body.get("playground_id")

    if not pg_id:
        raise APIException("playground_id is required", 400)

    # Validar que no haya una solicitud previa
    existing = PlaygroundAccessRequest.query.filter_by(
        user_id=current_user_id,
        playground_id=pg_id,
        status="pending"
    ).first()

    if existing:
        return jsonify({"msg": "Solicitud ya enviada"}), 200

    new_request = PlaygroundAccessRequest(
        user_id=current_user_id,
        playground_id=pg_id,
        status="pending"
    )
    db.session.add(new_request)
    db.session.commit()

    return jsonify({"msg": "Solicitud enviada"}), 201

@api.route('/users/find', methods=['GET'])
@jwt_required()
def find_users():
    q = (request.args.get("q") or "").strip()
    if not q:
        return jsonify([]), 200

    users = User.query.filter(
        (User.username.ilike(f"{q}%")) | (User.email.ilike(f"{q}%"))
    ).order_by(User.username.asc()).limit(10).all()

    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email}
        for u in users
    ]), 200

@api.route('/requests/<int:req_id>/<string:action>', methods=['POST'])
@jwt_required()
def resolve_access_request(req_id, action):
    if action not in ("accept", "reject"):
        raise APIException("Invalid action", 400)

    current_user_id = int(get_jwt_identity())
    req = PlaygroundAccessRequest.query.get(req_id)
    if not req:
        raise APIException("Request not found", 404)

    if req.status not in ("pending", "invited"):
        return jsonify({"msg": "Request already processed"}), 200

    playground = Playground.query.get(req.playground_id)
    if not playground:
        raise APIException("Playground not found", 404)

    # pending  -> debe aceptar/rechazar el OWNER
    # invited  -> debe aceptar/rechazar el USUARIO invitado
    if req.status == "pending" and playground.created_by != current_user_id:
        raise APIException("Only the playground owner can process this", 403)
    if req.status == "invited" and req.user_id != current_user_id:
        raise APIException("Only the invited user can process this", 403)

    if action == "reject":
        req.status = "rejected"
        db.session.commit()
        return jsonify({"msg": "Request rejected", "request": req.serialize()}), 200

    # accept
    already_member = PlaygroundUser.query.filter_by(
        user_id=req.user_id, playground_id=req.playground_id
    ).first()
    if not already_member:
        db.session.add(PlaygroundUser(
            user_id=req.user_id,
            playground_id=req.playground_id,
            joined_at=datetime.utcnow()
        ))
    req.status = "accepted"
    db.session.commit()

    return jsonify({"msg": "Request accepted", "request": req.serialize()}), 200

@api.route('/admin/messages', methods=['GET'])
@jwt_required()
def get_all_messages_byadmin():
    current_admin_id = get_jwt_identity()

    admin = AdminUser.query.get(current_admin_id)
    if not admin or admin.role != "admin":
        raise APIException("Access denied. Only admins can view all messages.", 403)

    messages = Message.query.all()
    return jsonify({
        "messages": [msg.serialize() for msg in messages]
    }), 200


# *------- Resolución apuesta Manual --------*

# TODO

def can_manual_resolve(bet: "Bet") -> bool:
    """Se puede resolver si no está cerrada y (ya es locked o pasó el deadline)."""
    if bet.status in (BetStatus.resolved, BetStatus.cancelled):
        return False
    if bet.status == BetStatus.locked:
        return True
    if bet.deadline and bet.deadline <= datetime.utcnow():
        return True
    return False

@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/resolve-manual', methods=['PUT'])
@jwt_required()
def resolve_bet_manual(pg_id, bet_id):
    current_user_id = int(get_jwt_identity())
    jwt_data = get_jwt()
    is_admin_user = jwt_data.get("role") == "admin"
    current_user_id = int(get_jwt_identity())
    jwt_data = get_jwt()
    is_admin_user = jwt_data.get("role") == "admin"

    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        return jsonify({"message": "Bet not found"}), 404

    if bet.user_id != current_user_id and not is_admin_user:
    if bet.user_id != current_user_id and not is_admin_user:
        return jsonify({"message": "Not allowed"}), 403
    
    if bet.status in (BetStatus.resolved, BetStatus.cancelled):
        return jsonify({"message": "Bet already finished"}), 400

    if getattr(bet, "external_match_id", None) and not is_admin_user:

    if getattr(bet, "external_match_id", None) and not is_admin_user:
        return jsonify({"message": "This bet is linked to an external match; use auto resolution"}), 400


    data = request.get_json(silent=True) or {}
    winner_option_id = data.get("winner_option_id")
    try:
        winner_option_id = int(winner_option_id) if winner_option_id is not None else None
    except (TypeError, ValueError):
        winner_option_id = None

    if not winner_option_id:
        return jsonify({"message": "winner_option_id is required"}), 400

    winner = BetOption.query.filter_by(id=winner_option_id, bet_id=bet.id).first()
    if not winner:
        return jsonify({"message": "Winner option invalid for this bet"}), 400

    if not is_admin_user and bet.user_id != current_user_id and bet.deadline and bet.deadline > datetime.utcnow():
    if not is_admin_user and bet.user_id != current_user_id and bet.deadline and bet.deadline > datetime.utcnow():
        return jsonify({"message": "Bet cannot be resolved before the deadline"}), 400

    bet.winner_option_id = winner.id
    bet.status = BetStatus.resolved
    bet.resolved_at = datetime.utcnow()
    db.session.commit()

    return jsonify(bet.serialize_with_votes(user_id=current_user_id)), 200


# *------- Resolución apuesta API + Manual por admin/creador apuesta --------*

@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/resolve-auto', methods=['PUT'])
@jwt_required()
def resolve_bet_auto(pg_id, bet_id):
    """
    Resuelve automáticamente una apuesta vinculada a la API integrada (usando external_match_id).
    Solo admins o el creador de la apuesta pueden ejecutarlo manualmente.
    """
    uid = int(get_jwt_identity())

    bet = Bet.query.filter_by(id=bet_id, playground_id=pg_id).first()
    if not bet:
        return jsonify({"message": "Bet not found"}), 404

    if not bet.external_match_id:
        return jsonify({"message": "This bet is not linked to an external match"}), 400

    # Solo permitir si es admin o creador
    if bet.user_id != uid and not is_admin(uid):
        return jsonify({"message": "Not allowed"}), 403

    if bet.status in (BetStatus.resolved, BetStatus.cancelled):
        return jsonify({"message": "Bet already finished"}), 400

    # # Verificamos si ya pasó el deadline
    # if bet.deadline and bet.deadline > datetime.utcnow():
    #     return jsonify({"message": "Bet cannot be resolved before the deadline"}), 400

    # --- Aquí llamamos a la API externa ---
    # Llamada a football-data
    try:
        match = fd_get_match(int(bet.external_match_id))
    except Exception as e:
        return jsonify({"message": f"Error loading external result: {e}"}), 502

    # Aseguramos que el partido ha terminado
    status = (match or {}).get("status")
    if status != "FINISHED":
        return jsonify({"message": f"Match not finished yet (status={status})"}), 400


    # Ganador: HOME_TEAM, AWAY_TEAM o DRAW
    winner_code = (match.get("score") or {}).get("winner")
    if winner_code not in ("HOME_TEAM", "AWAY_TEAM", "DRAW"):
        return jsonify({"message": "No winner info in external API"}), 400

    # Buscar en bet.options la que coincida con ese código
    winner_option = next((opt for opt in bet.options if opt.label.lower() == winner_code.lower()), None)
    if not winner_option:
        return jsonify({"message": f"No matching option for code {winner_code}"}), 400
    
    home = (match.get("homeTeam") or {}).get("name") or (match.get("homeTeam") or {}).get("shortName", "")
    away = (match.get("awayTeam") or {}).get("name") or (match.get("awayTeam") or {}).get("shortName", "")

    #--mapeo opciones por label---
    def normalize(s: str) -> str:
        return (s or "").strip().lower()
    
    #--- opciones de ganadores ---
    wanted_labels = []
    if winner_code == "HOME_TEAM":
        wanted_labels = [home]
    elif winner_code == "AWAY_TEAM":
        wanted_labels = [away]
    else:
        wanted_labels = ["draw", "empate", "tie"]

    winner_option = None
    for opt in bet.options:
        lab = normalize(opt.label)
        if lab in map(normalize, wanted_labels):
            winner_option = opt
            break

    if not winner_option:
        # fallback: nombre del equipo
        for opt in bet.options:
            lab = normalize(opt.label)
            if winner_code == "HOME_TEAM" and normalize(home) in lab:
                winner_option = opt; break
            if winner_code == "AWAY_TEAM" and normalize(away) in lab:
                winner_option = opt; break

    if not winner_option:
        return jsonify({"message": f"No matching bet option for winner {winner_code} ({home} vs {away})"}), 400


    # Guardar como ganadora
    bet.winner_option_id = winner_option.id
    bet.status = BetStatus.resolved
    bet.resolved_at = datetime.utcnow()
    db.session.commit()

    return jsonify(bet.serialize_with_votes(user_id=uid)), 200


# *-------Listar ganadores apuestas ----------*

@api.route('/bets/winners', methods=['GET'])
@jwt_required()
def all_bet_winners():
    
    claims = get_jwt() or {}
    role = claims.get("role") or ("admin" if claims.get("is_admin") else "user")
    if role not in ("user", "admin"):
        return jsonify({"message": "Unauthorized role"}), 403
    
    # Obtener todas las apuestas resueltas con ganador definido
    bets = Bet.query.filter(
        Bet.status == BetStatus.resolved,
        Bet.winner_option_id.isnot(None)
    ).order_by(Bet.resolved_at.desc()).all()

    data = []
    for bet in bets:
        winners = (
            db.session.query(User.id, User.username)
            .join(UserBet, UserBet.user_id == User.id)
            .filter(
                UserBet.bet_id == bet.id,
                UserBet.option_id == bet.winner_option_id
            )
            .all()
        )
        data.append({
            "bet_id": bet.id,
            "bet_name": bet.name,
            "playground_id": bet.playground_id,
            "winner_option_id": bet.winner_option_id,
            "winner_option_label": next(
                (opt.label for opt in bet.options if opt.id == bet.winner_option_id), 
                None
            ),
            "winners": [{"id": uid, "username": uname} for uid, uname in winners],
            "resolved_at": bet.resolved_at.isoformat() if bet.resolved_at else None
        })

    return jsonify(data), 200


# *-------Listar ganador o ganadores de una apuesta espeficifica ----------*

@api.route('/playground/<int:pg_id>/bet/<int:bet_id>/winners', methods=['GET'])
@jwt_required(optional=True) 
def bet_winners(pg_id, bet_id):
    """
    Devuelve la lista de usuarios que acertaron la opción ganadora
    de la apuesta indicada (debe estar RESUELTA).
    """
    # 1) Cargar la apuesta y validar que pertenece al playground
    bet = db.session.get(Bet, bet_id)
    if not bet or bet.playground_id != pg_id:
        return jsonify({"message": "Bet not found"}), 404

    # 2) Debe estar resuelta y con opción ganadora
    if bet.status != BetStatus.resolved or not bet.winner_option_id:
        return jsonify({"message": "Bet not resolved"}), 400

    # 3) Cargar label de la opción ganadora (si existe)
    winner_opt = db.session.get(BetOption, bet.winner_option_id)
    winner_label = winner_opt.label if winner_opt else None

    # 4) Usuarios que acertaron (votaron la opción ganadora)
    winners = (
        db.session.query(User.id, User.username)
        .join(UserBet, UserBet.user_id == User.id)
        .filter(
            UserBet.bet_id == bet.id,
            UserBet.option_id == bet.winner_option_id
        )
        .all()
    )

    return jsonify({
        "bet_id": bet.id,
        "playground_id": bet.playground_id,
        "status": bet.status.value if bet.status else None,
        "winner_option_id": bet.winner_option_id,
        "winner_option_label": winner_label,
        "winners": [{"id": uid, "username": uname} for uid, uname in winners]
    }), 200
