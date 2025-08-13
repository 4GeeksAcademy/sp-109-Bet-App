import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import Bet, BetStatus, BetType, db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import select
from datetime import datetime, timezone
import requests


# Detectar entorno
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

# Configurar Flask app
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)
app.config["JWT_SECRET_KEY"] = "super-secret-key-final-proyect-que-te-apuestas-app"
jwt = JWTManager(app)
    

# CORS manual (requerido en Codespaces)
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Configuración base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Crear tablas
with app.app_context():
    db.create_all()

# Admin panel y comandos
setup_admin(app)
setup_commands(app)

# Blueprint de la API
app.register_blueprint(api, url_prefix='/api')

# Programación Tareas

FOOTBALL_DATA_API_KEY = os.getenv("FOOTBALL_DATA_API_KEY")
FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4"

scheduler = BackgroundScheduler(timezone="UTC")

def cron_bets():
    """Corre cada minuto: bloquea vencidas y trata de resolver por API."""
    with app.app_context():
        now = datetime.utcnow()

        # 1) ACTIVE -> LOCKED si el deadline ya terminó
        to_lock = db.session.execute(
            select(Bet).where(
                Bet.status == BetStatus.active,
                Bet.deadline.isnot(None),
                Bet.deadline <= now
            )
        ).scalars().all()

        for b in to_lock:
            b.status = BetStatus.locked

        if to_lock:
            db.session.commit()

        # 2) Intentar resolver las apuestas LOCKED con API externa (si aplica)
        locked = db.session.execute(
            select(Bet).where(Bet.status == BetStatus.locked)
        ).scalars().all()

        for b in locked:
            try:
                # Solo para bets deportivas con match externo definido
                if (b.type == BetType.sports or getattr(b.type, "name", "") == "sports") and getattr(b, "external_match_id", None):
                    resolved = try_resolve_with_external_api(b)
                    if resolved:
                        # la función hace commit; continúa
                        pass
            except Exception as e:
                db.session.rollback()
                print(f"[cron_bets] Error resolviendo bet {b.id}: {e}")

def try_resolve_with_external_api(bet: "Bet") -> bool:
    """
    Resuelve una Bet deportiva usando football-data.org sin crear opciones nuevas.
    Mapea:
      - HOME_TEAM -> opción con external_team_id = homeTeam.id
      - AWAY_TEAM -> opción con external_team_id = awayTeam.id
      - DRAW      -> opción existente que represente empate (label='Empate' o external_team_id=None)
    """
    if bet.status in (BetStatus.resolved, BetStatus.cancelled):
        return False

    match_id = getattr(bet, "external_match_id", None)
    if not match_id or not FOOTBALL_DATA_API_KEY:
        return False

    headers = {'X-Auth-Token': FOOTBALL_DATA_API_KEY}
    url = f"{FOOTBALL_DATA_BASE_URL}/matches/{match_id}"

    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as e:
        print(f"[resolve_api] Request error bet {bet.id}: {e}")
        return False

    match = data.get("match") or {}
    if match.get("status") != "FINISHED":
        return False

    score = match.get("score") or {}
    winner_key = score.get("winner")  # "HOME_TEAM" | "AWAY_TEAM" | "DRAW"
    if winner_key not in ("HOME_TEAM", "AWAY_TEAM", "DRAW"):
        return False

    home_team_id = (match.get("homeTeam") or {}).get("id")
    away_team_id = (match.get("awayTeam") or {}).get("id")

    winner_option = None
    if winner_key == "DRAW":
        # Busca una opción existente que represente empate
        winner_option = next(
            (o for o in bet.options
             if (o.external_team_id is None) or (o.label.strip().lower() == "empate")),
            None
        )
    elif winner_key == "HOME_TEAM":
        winner_option = next((o for o in bet.options if o.external_team_id == home_team_id), None)
    elif winner_key == "AWAY_TEAM":
        winner_option = next((o for o in bet.options if o.external_team_id == away_team_id), None)

    if not winner_option:
        # No hay mapeo a opciones existentes → quedará en locked para resolución manual
        return False

    bet.winner_option_id = winner_option.id
    bet.status = BetStatus.resolved
    bet.resolved_at = datetime.now(timezone.utc)
    db.session.commit()
    return True

# Registrar la tarea (cada minuto)
scheduler.add_job(cron_bets, "interval", minutes=1, id="bets_cron",
                  max_instances=1, coalesce=True, replace_existing=True)

# Evitar doble scheduler con el reloader de Flask
if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    scheduler.start()


# Manejo de errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Sitemap para entorno de desarrollo
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Manejo de archivos estáticos
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# Ejecutar servidor
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
    
