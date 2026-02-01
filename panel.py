import requests
import os
import sys
import getpass
# Configuración
BASE_URL = "http://localhost:5000"
ADMIN_PIN = "1823"
def clear():
    os.system('clear' if os.name == 'posix' else 'cls')
def header():
    print("\033[96m" + "="*40)
    print("      PANEL DE ADMINISTRACIÓN ELITE")
    print("="*40 + "\033[0m")
def login():
    clear()
    header()
    print("\033[93m🔒 ACCESO RESTRINGIDO\033[0m")
    pin = getpass.getpass("Introduce el PIN de Administrador: ")
    if pin == ADMIN_PIN:
        return True
    else:
        print("\033[91mPIN Incorrecto.\033[0m")
        return False
def menu():
    header()
    print("1. ➕ Crear / Editar Usuario")
    print("2. ⏳ Añadir Días (Renovar)")
    print("3. ❌ Borrar Usuario")
    print("4. 📋 Listar Todos los Usuarios")
    print("5. 📧 Enviar Notificación a un Usuario")
    print("6. 📢 Notificación a TODOS (Broadcast)")
    print("0. 🚪 Salir")
    print("\033[96m" + "-"*40 + "\033[0m")
    return input("Selecciona una opción: ")
def add_user():
    clear()
    header()
    print("--- CREAR / EDITAR USUARIO ---")
    user = input("Nombre de usuario: ")
    pw = input("Contraseña: ")
    days = input("Días de acceso (defecto 30): ") or "30"
    
    data = {"username": user, "password": pw, "days": int(days)}
    try:
        r = requests.post(f"{BASE_URL}/admin/add", json=data)
        print("\n" + r.json().get('message', 'Error'))
    except Exception as e:
        print(f"Error: {e}")
    input("\nPresiona Enter para volver...")
def add_days():
    clear()
    header()
    print("--- AÑADIR DÍAS ---")
    user = input("Nombre de usuario: ")
    days = input("Días a añadir: ")
    data = {"username": user, "password": "SAME_OR_NEW_PW", "days": int(days)}
    try:
        r = requests.post(f"{BASE_URL}/admin/add", json=data)
        print("\n" + r.json().get('message', 'Error'))
    except Exception as e:
        print(f"Error: {e}")
    input("\nPresiona Enter para volver...")
def delete_user():
    clear()
    header()
    print("--- BORRAR USUARIO ---")
    user = input("Nombre de usuario: ")
    confirm = input(f"¿Seguro que quieres borrar a {user}? (s/n): ")
    if confirm.lower() == 's':
        try:
            r = requests.post(f"{BASE_URL}/admin/delete", json={"username": user})
            print("\nUsuario eliminado correctamente.")
        except Exception as e:
            print(f"Error: {e}")
    input("\nPresiona Enter para volver...")
def list_users():
    clear()
    header()
    print("--- LISTADO DE USUARIOS ---")
    try:
        r = requests.get(f"{BASE_URL}/admin/users")
        users = r.json()
        print(f"{'USUARIO':<15} | {'EXPIRACIÓN':<12} | {'PREMIUM'}")
        print("-" * 40)
        for u in users:
            print(f"{u['username']:<15} | {u['expiry']:<12} | {u['premium']}")
    except Exception as e:
        print(f"Error: {e}")
    input("\nPresiona Enter para volver...")
def send_notification():
    clear()
    header()
    target = input("Usuario destino (deja vacío para TODOS): ") or "all"
    msg = input("Mensaje: ")
    
    try:
        r = requests.post(f"{BASE_URL}/admin/notify", json={"target": target, "message": msg})
        if r.status_code == 200:
            print("\n✅ Notificación enviada con éxito.")
    except Exception as e:
        print(f"Error: {e}")
    input("\nPresiona Enter para volver...")
def main():
    try:
        requests.get(BASE_URL, timeout=2)
    except:
        print(f"\033[91mERROR: El servidor API ({BASE_URL}) no parece estar funcionando.\033[0m")
        print("Asegúrate de ejecutar 'python3 cris.py' antes de abrir el panel.")
        sys.exit(1)
    if not login():
        sys.exit(1)
    while True:
        clear()
        choice = menu()
        if choice == '1': add_user()
        elif choice == '2': add_days()
        elif choice == '3': delete_user()
        elif choice == '4': list_users()
        elif choice == '5' or choice == '6': send_notification()
        elif choice == '0': break
        else: input("Opción inválida. Presiona Enter...")
if __name__ == '__main__':
    main()
