"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Adminsite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


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



@api.route('/adminsite', methods=['GET'])
def get_adminsite():
    all_adminsite = db.session.execute(select(Adminsite)).scalars().all()
    results = list(map(lambda adminsite: adminsite.serialize(), all_adminsite))
   
    return jsonify(results), 200


@api.route('/adminsite/<int:id>', methods=['GET'])
def get_adminsite_byid(id):
    admin_id = db.session.get(Adminsite, id) 

    response_body = {
        "id": admin_id.serialize()
    }

    return jsonify(response_body),200


@api.route('/adminsite/<int:id>', methods=['DELETE'])
def delete_adminsite_byid(id):
    
    admin_to_delete = db.session.execute(select(Adminsite).where(Adminsite.id == id)).scalars().first()

    if admin_to_delete is None:
        return {
        "msg": "Something happened, the favorite planet does not exist"
    } , 401
    

    db.session.delete(admin_to_delete)
    db.session.commit()

    return {
        "msg": "Admin deleted"
    } , 200


@api.route('/adminsite', methods=['POST'])
def add_adminsite():
    body = request.get_json()

    adminsite = Adminsite(
        email=body['email'],
        password=body['password']
    )
    db.session.add(adminsite)
    db.session.commit()

    return 'New Admin add!', 200


@api.route('/adminsite/<int:id>', methods=['PUT'])
def edit_adminsite(id):
    admin_id = db.session.get(Adminsite, id)
    body= request.get_json()

    admin_id.email=body['email'],
    admin_id.password=body['password']

   
    db.session.commit()
    return 'Data updated!', 200

