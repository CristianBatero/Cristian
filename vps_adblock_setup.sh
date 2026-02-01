#!/bin/bash
# ELITE ADBLOCK DNS SETUP - VPS PRO VERSION
# Fixed for Unix Line Endings and APT Locks
echo -e "====================================================="
echo -e "      ELITE ADBLOCK DNS SETUP - VPS PRO VERSION"
echo -e "====================================================="
# 1. Esperar a que el bloqueo de apt se libere
wait_for_apt() {
    echo -e "\e[93m[1/4] Verificando bloqueos de sistema (apt)...\e[0m"
    while fuser /var/lib/apt/lists/lock >/dev/null 2>&1 ; do
        echo "El sistema está ocupado (actualizando/instalando). Esperando 5 segundos..."
        sleep 5
    done
}
wait_for_apt
sudo apt-get update
# 2. Instalar dependencias
echo -e "\e[93m[2/4] Instalando dependencias necesarias...\e[0m"
sudo apt-get install -y curl tar wget
# 3. Descargar e instalar AdGuard Home
echo -e "\e[93m[3/4] Instalando AdGuard Home...\e[0m"
# INTENTAR LIBERAR EL PUERTO 53 (Frecuente en Ubuntu/Debian)
echo -e "\e[93mIntentando liberar el puerto 53 (systemd-resolved)...\e[0m"
if systemctl is-active --quiet systemd-resolved; then
    sudo systemctl stop systemd-resolved
    sudo systemctl disable systemd-resolved
fi
# Configurar un DNS temporal para que el VPS no se quede sin internet
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf > /dev/null
# Instalación oficial
curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
# 4. Configurar Firewall
echo -e "\e[93m[4/4] Configurando Firewall...\e[0m"
if command -v ufw > /dev/null; then
    sudo ufw allow 53/tcp
    sudo ufw allow 53/udp
    sudo ufw allow 3000/tcp 
    sudo ufw allow 9595/tcp 
    echo "Puertos 53, 3000 y 9595 abiertos en UFW."
fi
echo -e "\e[92m====================================================="
echo -e "      ¡INSTALACIÓN COMPLETADA!"
echo -e "=====================================================\e[0m"
echo -e "CONFIGURACIÓN FINAL (PUERTOS DISPONIBLES):"
echo -e "1. Accede a: \e[96mhttp://$(curl -s ifconfig.me):3000\e[0m"
echo -e "2. EN EL PASO 2 DEL ASISTENTE:"
echo -e "   - Interfaz Web: Cambia el puerto 80 por \e[92m9595\e[0m."
echo -e "   - Servidor DNS: Déjalo en el puerto \e[92m53\e[0m."
echo -e "3. Una vez terminado, entrarás por: \e[96mhttp://$(curl -s ifconfig.me):9595\e[0m"
echo -e "====================================================="
