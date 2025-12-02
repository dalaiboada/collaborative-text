# 📝 IP Static Validation and Collaborative Text Editor

Este proyecto es una aplicación mínima de prueba construida con Node.js y Express. Su objetivo principal es **validar la configuración de una dirección IP estática** en un servidor, asegurando que el servidor Express escuche correctamente en todas las interfaces de red (`0.0.0.0`).

Además, sirve como un simple editor de texto plano (single-file document) para probar la interacción y concurrencia básica de clientes múltiples.

## 🚀 Funcionalidades

* **Escucha de Múltiples Interfaces:** El servidor Express escucha en `0.0.0.0:3000`, permitiendo el acceso desde `localhost` y la IP estática configurada.

* **Editor de Texto Plano:** Permite a múltiples clientes leer y sobrescribir el contenido de un único archivo (`shared_document.txt`).

* **Scripts de Control:** Incluye archivos `.bat` para iniciar y detener el servidor fácilmente en entornos Windows.

## 🛠️ Requisitos

* Node.js (v14 o superior)

* npm (incluido con Node.js)

## 📦 Instalación y Ejecución

### 1. Clonar el Repositorio

`git clone https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories cd ip-static-validation-editor`


### 2. Instalar Dependencias

Instala el framework Express:

`npm install express`


### 3. Iniciar el Servidor (Windows)

Usa el script de inicio rápido:

`start_server.bat`

### 4. Acceder a la Aplicación

Una vez iniciado, accede a la aplicación desde tu navegador:

* **Localmente:** `http://localhost:3000`

* **Remotamente (Prueba de IP):** `http://TU_IP_ESTATICA:3000`

## 🛑 Detener el Servidor (Windows)

Para detener el proceso del servidor sin usar `Ctrl+C` en la ventana principal:

1. Asegúrate de que la ventana del servidor esté abierta.

2. Ejecuta el script de detención:

`stop_server.bat`


*(Advertencia: Este script detiene cualquier proceso de `node.exe` que esté corriendo)*
