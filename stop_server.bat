@echo off
REM Script para detener el servidor Node.js/Express.

echo ==========================================
echo    Intentando detener el servidor Express...
echo ==========================================

REM Detiene forzosamente el proceso Node.js por nombre de imagen.
REM ADVERTENCIA: Esto detendra CUALQUIER proceso de Node.js que este corriendo.
taskkill /F /IM node.exe

REM Comprueba el resultado del comando taskkill
if %ERRORLEVEL% equ 0 (
    echo.
    echo Servidor Node.js detenido exitosamente (o no se encontro).
) else (
    echo.
    echo Hubo un error al intentar detener el servidor.
    echo El servidor puede no haber estado corriendo o necesitas permisos de administrador.
)

echo.
echo ==========================================
echo Presione cualquier tecla para cerrar esta ventana...
REM Este comando detiene la pantalla hasta que se presiona una tecla.
pause