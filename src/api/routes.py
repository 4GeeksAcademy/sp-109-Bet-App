"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Playground, AdminUser, Bet
from api.utils import generate_sitemap, APIException, generate_unique_slug
from flask_cors import CORS
from sqlalchemy import select
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API



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

    # Verificar si el email o username ya existen
    if User.query.filter_by(email=body["email"]).first() is not None:
        raise APIException("Email already exists", 400)
    if User.query.filter_by(username=body["username"]).first() is not None:
        raise APIException("Username already exists", 400)

    user = User(
        username=body["username"],
        name=body["name"],
        last_name=body["last_name"],
        email=body["email"],
        password=body["password"],  # Sin seguridad aún
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


@api.route('/adminuser', methods=['GET'])
def get_adminsite():
    all_adminsite = db.session.execute(select(AdminUser)).scalars().all()
    results = list(map(lambda adminsite: adminsite.serialize(), all_adminsite))
   
    return jsonify(results), 200


@api.route('/adminuser/<int:id>', methods=['GET'])
def get_adminsite_byid(id):
    admin= db.session.get(AdminUser, id) 

    if not admin: 
        raise APIException('Admin not found',404)

    response_body = {
        "id": admin.serialize()
    }

    return jsonify(response_body),200


@api.route('/adminuser/<int:id>', methods=['DELETE'])
def delete_adminsite_byid(id):
    
    admin_to_delete = db.session.execute(select(AdminUser).where(AdminUser.id == id)).scalars().first()

    if not admin_to_delete:
        raise APIException('Admin not found',404)
    

    db.session.delete(admin_to_delete)
    db.session.commit()

    return {
        "msg": "Admin deleted"
    } , 200


@api.route('/adminuser', methods=['POST'])
def add_adminsite():
    body = request.get_json()

    if not body or 'email' not in body or 'password' not in body:
        raise APIException('Fields "email" and "password" are required', 400)

    adminsite = AdminUser(
        email=body['email'],
        password=body['password']
    )


    db.session.add(adminsite)
    db.session.commit()

    return 'New Admin add!', 201


@api.route('/adminuser/<int:id>', methods=['PUT'])
def edit_adminsite(id):
    admin = db.session.get(AdminUser, id)
    if not admin:
        raise APIException('Admin not found', 404)

    body= request.get_json()
    if not body:
        raise APIException('Request body must be JSON',400)

    if 'email' in body:
        admin.email=body['email'],
    if 'password' in body:
        admin.password=body['password']

   
    db.session.commit()
    return 'Admin updated successfully!', 200



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

    user_id = body.get("user_id")
    if not user_id:
        raise APIException("user_id is required", 400)

    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", 404)

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
        user_id=user_id,
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
        "message": "New bet updated succesfully",
        "bet": bet.serialize()
    }), 200