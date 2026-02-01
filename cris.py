import sqlite3
import hashlib
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
app = Flask(__name__)
DB_NAME = 'auth_users.db'
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Tabla Usuarios
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (username TEXT PRIMARY KEY, password_hash TEXT, expiry_date TEXT, is_premium INTEGER, alias TEXT)''')
    
    # Tabla Notificaciones
    c.execute('''CREATE TABLE IF NOT EXISTS notifications
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, target TEXT, message TEXT, time TEXT)''')
    
    # Migración: Agregar columna 'alias' si no existe por si acaso
    try: c.execute("ALTER TABLE users ADD COLUMN alias TEXT")
    except: pass
    
    conn.commit()
    conn.close()
def hash_password(password):
    if not password: return ""
    return hashlib.sha256(password.encode()).hexdigest()
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if 'token' in data:
        token = data['token'].strip()
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("SELECT expiry_date, is_premium, alias FROM users WHERE username=?", (token,))
        user = c.fetchone()
        conn.close()
        if user:
            expiry_date = datetime.strptime(user[0], '%Y-%m-%d')
            if expiry_date + timedelta(days=1) > datetime.now():
                return jsonify({"success": True, "is_premium": bool(user[1]), "expiry": user[0], "message": f"Hola {user[2] or 'Elite'}"})
            return jsonify({"success": False, "message": "Token expirado."})
        return jsonify({"success": False, "message": "Dispositivo no registrado."})
    user = data.get('username', '').strip()
    pw = data.get('password', '').strip()
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT password_hash, expiry_date, is_premium FROM users WHERE username=?", (user,))
    row = c.fetchone()
    conn.close()
    if row and row[0] == hash_password(pw):
        expiry_date = datetime.strptime(row[1], '%Y-%m-%d')
        if expiry_date + timedelta(days=1) > datetime.now():
            return jsonify({"success": True, "is_premium": bool(row[2]), "expiry": row[1]})
        return jsonify({"success": False, "message": "Cuenta expirada."})
    return jsonify({"success": False, "message": "Credenciales inválidas."})
@app.route('/admin/add', methods=['POST'])
def add_user():
    data = request.json
    user = data.get('username', '').strip()
    pw = data.get('password', '').strip()
    days = data.get('days', 30)
    alias = data.get('alias', '').strip()
    expiry = (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d')
    p_hash = hash_password(pw) if pw else "TOKEN_USER"
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO users (username, password_hash, expiry_date, is_premium, alias) VALUES (?, ?, ?, 1, ?)", 
                  (user, p_hash, expiry, alias))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": f"Usuario/Token {user} guardado hasta {expiry}"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
@app.route('/admin/delete', methods=['POST'])
def delete_user():
    data = request.json
    user = data.get('username', '').strip()
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("DELETE FROM users WHERE username=?", (user,))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": f"Usuario {user} eliminado."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
@app.route('/admin/users', methods=['GET'])
def list_users():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT username, expiry_date, alias FROM users")
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return jsonify(rows)
@app.route('/admin/notify', methods=['POST'])
def add_notification():
    data = request.json
    target = data.get('target', 'all').strip()
    msg = data.get('message', '').strip()
    time = datetime.now().strftime('%H:%M')
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("INSERT INTO notifications (target, message, time) VALUES (?, ?, ?)", (target, msg, time))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
@app.route('/notifications', methods=['GET'])
def get_notifications():
    user = request.args.get('user', 'all')
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT message, time FROM notifications WHERE target='all' OR target=? ORDER BY id DESC LIMIT 1", (user,))
    row = c.fetchone()
    conn.close()
    if row: return jsonify([dict(row)])
    return jsonify([])
if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)
