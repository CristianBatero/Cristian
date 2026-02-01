import requests, os, sys, getpass
BASE_URL = "http://localhost:5000"
ADMIN_PIN = "1823"
def clear(): os.system('clear' if os.name == 'posix' else 'cls')
def header():
    print("\033[96m" + "="*45)
    print("      PANEL DE ADMINISTRACIÓN ELITE V3")
    print("="*45 + "\033[0m")
def menu():
    header()
    print("1. ➕ Crear / Editar Usuario (Email/Pass)")
    print("2. 📱 Registrar Usuario por TOKEN (ID)")
    print("3. ⏳ Añadir Días (Renovación)")
    print("4. ❌ Borrar Usuario o Token")
    print("5. 📋 Listar Todos los Registros")
    print("6. 📧 Enviar Notificación a un Usuario")
    print("7. 📢 Notificación a TODOS (Broadcast)")
    print("0. 🚪 Salir")
    print("\033[96m" + "-"*45 + "\033[0m")
    return input("Selecciona una opción: ")
def add_user():
    clear(); header(); print("--- CREAR/EDITAR POR PASSWORD ---")
    u = input("Usuario: ").strip(); p = input("Password: ").strip(); d = input("Días (30): ").strip() or "30"
    r = requests.post(f"{BASE_URL}/admin/add", json={"username":u,"password":p,"days":int(d)})
    print("\n" + r.json().get('message','Error'))
    input("\nEnter...")
def add_token():
    clear(); header(); print("--- REGISTRAR POR TOKEN (ID) ---")
    t = input("Token (Device ID): ").strip(); a = input("Alias (Nombre): ").strip(); d = input("Días (30): ").strip() or "30"
    r = requests.post(f"{BASE_URL}/admin/add", json={"username":t,"password":"","days":int(d),"alias":a})
    print("\n" + r.json().get('message','Error'))
    input("\nEnter...")
def add_days():
    clear(); header(); print("--- RENOVAR DÍAS ---")
    u = input("Usuario o Token: ").strip(); d = input("Días a sumar: ").strip()
    r = requests.post(f"{BASE_URL}/admin/add", json={"username":u,"days":int(d)})
    print("\n" + r.json().get('message','Error'))
    input("\nEnter...")
def delete_user():
    clear(); header(); print("--- ELIMINAR USUARIO/TOKEN ---")
    u = input("Usuario o Token a borrar: ").strip()
    if input(f"¿Borrar {u}? (s/n): ").lower() == 's':
        r = requests.post(f"{BASE_URL}/admin/delete", json={"username":u})
        print("\n" + r.json().get('message','Error'))
    input("\nEnter...")
def list_users():
    clear(); header(); print("--- LISTADO GENERAL ---")
    r = requests.get(f"{BASE_URL}/admin/users")
    users = r.json()
    print(f"{'USUARIO/TOKEN':<22} | {'ALIAS':<12} | {'EXPIRA'}")
    print("-" * 50)
    for u in users:
        print(f"{u['username']:<22} | {u.get('alias',''):<12} | {u['expiry_date']}")
    input("\nEnter...")
def send_notification(broadcast=False):
    clear(); header()
    if broadcast:
        print("--- NOTIFICACIÓN A TODOS ---")
        target = "all"
    else:
        print("--- NOTIFICACIÓN PRIVADA ---")
        target = input("Usuario/Token destino: ").strip()
    
    msg = input("Mensaje: ").strip()
    if msg:
        r = requests.post(f"{BASE_URL}/admin/notify", json={"target": target, "message": msg})
        if r.status_code == 200: print("\n✅ Enviado con éxito.")
    input("\nEnter...")
def main():
    pin = getpass.getpass("PIN Admin: ")
    if pin != ADMIN_PIN: sys.exit(0)
    while True:
        clear()
        c = menu()
        if c == '1': add_user()
        elif c == '2': add_token()
        elif c == '3': add_days()
        elif c == '4': delete_user()
        elif c == '5': list_users()
        elif c == '6': send_notification(False)
        elif c == '7': send_notification(True)
        elif c == '0': break
if __name__ == '__main__': main()
