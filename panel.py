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
    print("1. ➕ Crear / Editar Usuario (Password)")
    print("2. 📱 Registrar Usuario por TOKEN (ID)")
    print("3. ⏳ Añadir Días (Renovar)")
    print("4. ❌ Borrar Usuario/Token")
    print("5. 📋 Listar Todos")
    print("0. 🚪 Salir")
    print("\033[96m" + "-"*40 + "\033[0m")
    return input("Selecciona una opción: ")
def add_user():
    clear()
    header()
    print("--- CREAR USUARIO CON CONTRASEÑA ---")
    user = input("Nombre de usuario: ").strip() # Limpiar espacios
    pw = input("Contraseña: ").strip()
    days = input("Días de acceso (defecto 30): ").strip() or "30"
    
    data = {"username": user, "password": pw, "days": int(days)}
    try:
        r = requests.post(f"{BASE_URL}/admin/add", json=data)
        print("\n" + r.json().get('message', 'Error'))
    except Exception as e:
        print(f"Error: {e}")
    input("\nPresiona Enter para volver...")
def add_token_user():
    clear()
    header()
    print("--- REGISTRAR USUARIO POR TOKEN (ID) ---")
    print("Copia el ID que la app muestra en 'Token Mode'")
    token = input("Token (Device ID): ").strip() # LIMPIAR ESPACIOS
    alias = input("Nombre del Cliente (Alias/Referencia): ").strip()
    days = input("Días de acceso (defecto 30): ").strip() or "30"
    
    data = {"username": token, "password": "", "days": int(days), "alias": alias}
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
    user = input("Usuario o Token a renovar: ").strip()
    days = input("Días a añadir: ").strip()
    data = {"username": user, "days": int(days)} 
    try:
        r = requests.post(f"{BASE_URL}/admin/add", json=data)
        print("\n" + r.json().get('message', 'Error'))
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
        print(f"{'USUARIO/TOKEN':<20} | {'ALIAS':<15} | {'EXPIRA':<12}")
        print("-" * 60)
        for u in users:
            alias = u.get('alias', '')
            print(f"{u['username']:<20} | {alias:<15} | {u['expiry']:<12}")
    except Exception as e:
        print(f"Error: {e}")
    input("\nPresiona Enter para volver...")
def main():
    try:
        requests.get(BASE_URL, timeout=2)
    except:
        print(f"\033[91mERROR: El servidor API ({BASE_URL}) no parece estar funcionando.\033[0m")
        sys.exit(1)
    if not login(): sys.exit(1)
    while True:
        clear()
        choice = menu()
        if choice == '1': add_user()
        elif choice == '2': add_token_user()
        elif choice == '3': add_days()
        elif choice == '5': list_users()
        elif choice == '0': break
        else: input("Opción inválida...")
if __name__ == '__main__':
    main()
