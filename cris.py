import sqlite3
import hashlib
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
app = Flask(__name__)
DB_NAME = 'auth_users.db'
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (username TEXT PRIMARY KEY, password_hash TEXT, expiry_date TEXT, is_premium INTEGER)''')
    conn.commit()
    conn.close()
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT password_hash, expiry_date, is_premium FROM users WHERE username=?", (username,))
    user = c.fetchone()
    conn.close()
    
    if user and user[0] == hash_password(password):
        expiry_date = datetime.strptime(user[1], '%Y-%m-%d')
        if expiry_date > datetime.now():
            return jsonify({
                "success": True,
                "is_premium": bool(user[2]),
                "expiry": user[1]
            })
        else:
            return jsonify({"success": False, "message": "Tu acceso premium ha expirado."})
    
    return jsonify({"success": False, "message": "Usuario o contraseña incorrectos."})
@app.route('/admin/add', methods=['POST'])
def add_user():
    # En producción deberías proteger este endpoint con un ADMIN_TOKEN
    data = request.json
    username = data.get('username')
    password = data.get('password')
    days = data.get('days', 30)
    
    expiry = (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d')
    p_hash = hash_password(password)
    
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("INSERT INTO users (username, password_hash, expiry_date, is_premium) VALUES (?, ?, ?, 1)", 
                  (username, p_hash, expiry))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": f"Usuario {username} agregado hasta {expiry}"})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "El usuario ya existe."})
if __name__ == '__main__':
    init_db()
    # Ejecutar en el puerto 5000 expuesto al público
    app.run(host='0.0.0.0', port=5000)