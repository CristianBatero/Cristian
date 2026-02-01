
#!/bash
# ELITE ADBLOCK DNS SETUP - PRO VERSION
# Este script instalará AdGuard Home en tu VPS para un filtrado de anuncios profesional.
echo -e "\e[96m====================================================="
echo -e "      ELITE ADBLOCK DNS SETUP - VPS PRO VERSION"
echo -e "=====================================================\e[0m"
# 1. Actualizar sistema
echo -e "\e[93m[1/4] Actualizando sistema...\e[0m"
sudo apt-get update -y && sudo apt-get upgrade -y
# 2. Instalar dependencias
echo -e "\e[93m[2/4] Instalando dependencias necesarias...\e[0m"
sudo apt-get install -y curl tar wget
# 3. Descargar e instalar AdGuard Home
echo -e "\e[93m[3/4] Instalando AdGuard Home...\e[0m"
# INTENTAR LIBERAR EL PUERTO 53 (Frecuente en Ubuntu/Debian)
echo -e "\e[9 Yellow]Intentando liberar el puerto 53 (systemd-resolved)...\e[0m"
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved
# Configurar un DNS temporal para que el VPS no se quede sin internet durante la instalación
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
# 4. Configurar Firewall
echo -e "\e[93m[4/4] Configurando Firewall...\e[0m"
if command -v ufw > /dev/null; then
    sudo ufw allow 53/tcp
    sudo ufw allow 53/udp
    sudo ufw allow 3000/tcp # Puerto de instalación inicial
    sudo ufw allow 9595/tcp # Puerto definitivo para la web (SEGURO - EVITA LOGS Y CONFLICTOS)
    echo "Puertos 53, 3000 y 9595 abiertos en UFW."
fi
echo -e "\e[92m====================================================="
echo -e "      ¡INSTALACIÓN COMPLETADA!"
echo -e "=====================================================\e[0m"
echo -e "CONFIGURACIÓN FINAL (PUERTOS DISPONIBLES):"
echo -e "1. Accede a: \e[96mhttp://$(curl -s ifconfig.me):3000\e[0m"
echo -e "2. EN LA CONFIGURACIÓN INICIAL (PASO 2):"
echo -e "   - Interfaz Web: Cambia el puerto 80 por \e[92m9595\e[0m."
echo -e "   - Servidor DNS: Déjalo en el puerto \e[92m53\e[0m."
echo -e "3. Una vez terminado, entrarás por: \e[96mhttp://$(curl -s ifconfig.me):9595\e[0m"
echo -e "-----------------------------------------------------"
echo -e "NOTA: Si el puerto 53 sigue ocupado por otro servicio,"
echo -e "puedes ver cuál es con: \e[93msudo lsof -i :53\e[0m"
echo -e "====================================================="