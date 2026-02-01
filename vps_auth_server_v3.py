import sqlite3
import hashlib
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
app = Flask(__name__)
DB_NAME = 'auth_users.db'
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Tabla de usuarios
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (username TEXT PRIMARY KEY, password_hash TEXT, expiry_date TEXT, is_premium INTEGER)''')
    # Tabla de notificaciones
    c.execute('''CREATE TABLE IF NOT EXISTS notifications
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, target_user TEXT, message TEXT, timestamp TEXT)''')
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
# --- NOTIFICACIONES PARA LA APP ---
@app.route('/notifications', methods=['GET'])
def get_notifications():
    user = request.args.get('user')
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Buscar notificaciones para el usuario específico o para todos
    c.execute("SELECT message, timestamp FROM notifications WHERE target_user=? OR target_user='all' ORDER BY id DESC LIMIT 5", (user,))
    notifs = [{"message": row[0], "time": row[1]} for row in c.fetchall()]
    conn.close()
    return jsonify(notifs)
# --- SECCIÓN ADMINISTRATIVA (Para panel.py) ---
@app.route('/admin/add', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    days = data.get('days', 30)
    
    expiry = (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d')
    p_hash = hash_password(password)
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT OR REPLACE INTO users (username, password_hash, expiry_date, is_premium) VALUES (?, ?, ?, 1)", 
                  (username, p_hash, expiry))
        conn.commit()
        return jsonify({"success": True, "message": f"Usuario {username} activado hasta {expiry}"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    finally:
        conn.close()
@app.route('/admin/users', methods=['GET'])
def list_users():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT username, expiry_date, is_premium FROM users")
    users = [{"username": row[0], "expiry": row[1], "premium": bool(row[2])} for row in c.fetchall()]
    conn.close()
    return jsonify(users)
@app.route('/admin/delete', methods=['POST'])
def delete_user():
    data = request.json
    username = data.get('username')
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("DELETE FROM users WHERE username=?", (username,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})
@app.route('/admin/notify', methods=['POST'])
def send_notify():
    data = request.json
    target = data.get('target', 'all')
    msg = data.get('message')
    time = datetime.now().strftime('%H:%M %d/%m')
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO notifications (target_user, message, timestamp) VALUES (?, ?, ?)", (target, msg, time))
    conn.commit()
    conn.close()
    return jsonify({"success": True})
if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)