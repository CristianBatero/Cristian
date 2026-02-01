import sqlite3
import hashlib
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
app = Flask(__name__)
DB_NAME = 'auth_users.db'
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Crear tabla base
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (username TEXT PRIMARY KEY, password_hash TEXT, expiry_date TEXT, is_premium INTEGER)''')
    
    # Migración: Agregar columna 'alias' si no existe
    try:
        c.execute("ALTER TABLE users ADD COLUMN alias TEXT")
    except Exception:
        pass # La columna ya existe
        
    conn.commit()
    conn.close()
def hash_password(password):
    if not password: return ""
    return hashlib.sha256(password.encode()).hexdigest()
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # ---------------------------
    # MODO 1: LOGIN POR TOKEN (Device ID)
    # ---------------------------
    if 'token' in data:
        token = data['token']
        # En este modo, el 'username' en la BD es el Token
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("SELECT expiry_date, is_premium, alias FROM users WHERE username=?", (token,))
        user = c.fetchone()
        conn.close()
        
        if user:
            # Token encontrado. Verificar expiración.
            expiry_date = datetime.strptime(user[0], '%Y-%m-%d')
            # Sumar 1 dia para que expire al final del dia
            if expiry_date + timedelta(days=1) > datetime.now():
                return jsonify({
                    "success": True,
                    "is_premium": bool(user[1]),
                    "expiry": user[0],
                    "message": f"Bienvenido {user[2] or 'Token User'}"
                })
            else:
                return jsonify({"success": False, "message": "Tu Token ha expirado."})
        else:
            return jsonify({"success": False, "message": "Este dispositivo no está registrado."})
    # ---------------------------
    # MODO 2: LOGIN POR USUARIO / PASSWORD
    # ---------------------------
    username = data.get('username')
    password = data.get('password')
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT password_hash, expiry_date, is_premium FROM users WHERE username=?", (username,))
    user = c.fetchone()
    conn.close()
    
    if user and user[0] == hash_password(password):
        expiry_date = datetime.strptime(user[1], '%Y-%m-%d')
        if expiry_date + timedelta(days=1) > datetime.now():
            return jsonify({
                "success": True,
                "is_premium": bool(user[2]),
                "expiry": user[1]
            })
        else:
            return jsonify({"success": False, "message": "Tu cuenta ha expirado."})
    
    return jsonify({"success": False, "message": "Credenciales inválidas."})
@app.route('/admin/add', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username') # Puede ser User o Token
    password = data.get('password') # Puede ser pass o vacio (si es token)
    days = data.get('days', 30)
    alias = data.get('alias', '') # Nombre real del cliente
    
    expiry = (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d')
    p_hash = hash_password(password) if password else "TOKEN_USER"
    
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        # Insertar o Reemplazar (para actualizar dias facilmente)
        c.execute("INSERT OR REPLACE INTO users (username, password_hash, expiry_date, is_premium, alias) VALUES (?, ?, ?, 1, ?)", 
                  (username, p_hash, expiry, alias))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": f"Usuario/Token guardado. Vence: {expiry}"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
@app.route('/admin/users', methods=['GET'])
def list_users():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT username, expiry_date, is_premium, alias FROM users")
    rows = c.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        result.append({
            "username": row['username'],
            "expiry": row['expiry_date'],
            "premium": bool(row['is_premium']),
            "alias": row['alias'] if row['alias'] else ""
        })
    return jsonify(result)
if __name__ == '__main__':
    init_db()
    print("🚀 Servidor VPS Auth Iniciado en puerto 5000")
    app.run(host='0.0.0.0', port=5000)
