@echo off
REM Script para iniciar el servidor Node.js/Express en Windows.

echo ==========================================
echo    Iniciando Servidor de Edicion Express
echo    Servidor Node.js
echo ==========================================
echo La aplicacion esta accesible en las siguientes rutas:
echo 1. Acceso Local (desde esta maquina): http://localhost:3000
echo 2. Acceso Remoto (desde otra maquina): http://[TU_IP_ESTATICA]:3000
echo ------------------------------------------

REM Ejecuta el archivo del servidor
node server.js

REM El comando 'pause' mantiene la ventana abierta 
REM despues de que el servidor se detenga (con Ctrl+C) 
REM o si falla al iniciarse, para que puedas ver los errores.
pause