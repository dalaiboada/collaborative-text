// client.js
// 1. IMPORTACIÓN DE SOCKET.IO
// Nota: La librería de Socket.IO se sigue cargando con el <script src="/socket.io/socket.io.js"></script> en el HTML, 
// y expone el objeto 'io' globalmente. No necesita una importación explícita si se carga así.

const socket = io(); // Asumimos que 'io' está globalmente disponible por el script del HTML

const API_URL = '/api/document';
const documentContent = document.getElementById('document-content');
const statusMessage = document.getElementById('status-message');
const loadButton = document.getElementById('load-button');
const saveButton = document.getElementById('save-button');

// Función para mostrar mensajes de estado
const showStatus = (message, isError = false) => {
    statusMessage.textContent = message;
    statusMessage.className = `text-sm font-medium p-2 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
};

// Función de utilidad para manejar peticiones con reintentos
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            return response;
        } catch (error) {
            if (i < retries - 1) await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); 
            else throw error;
        }
    }
}

// Cargar el contenido del documento desde el servidor (REST GET)
const loadDocument = async () => {
    loadButton.disabled = true;
    loadButton.textContent = 'Cargando...';
    showStatus('Cargando el documento...');

    try {
        const response = await fetchWithRetry(API_URL, { method: 'GET' });
        const data = await response.json();

        documentContent.value = data.content;
        showStatus('Documento cargado con éxito. Hora: ' + new Date().toLocaleTimeString());
    } 
    catch (error) {
        console.error('Error al cargar:', error);
        showStatus('ERROR al cargar el documento. Revisa que el servidor Node.js esté corriendo. Detalles: ' + error.message, true);
    } 
    finally {
        loadButton.disabled = false;
        loadButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 15m15.356-2H15V8m-6 2l-2 2-2-2"></path></svg> Cargar (Refrescar)';
    }
};

// Guardar el contenido del documento en el servidor (REST POST)
const saveDocument = async () => {
    saveButton.disabled = true;
    saveButton.textContent = 'Guardando...';
    showStatus('Guardando cambios...');

    const content = documentContent.value;

    try {
        const response = await fetchWithRetry(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: content })
        });

        const data = await response.json();
        showStatus('Documento guardado: ' + data.message + '. Hora: ' + new Date().toLocaleTimeString());

    } catch (error) {
        console.error('Error al guardar:', error);
        showStatus('ERROR al guardar el documento. Detalles: ' + error.message, true);
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg> Guardar Cambios';
    }
};

// MANEJO DE EVENTOS DE SOCKET.IO
socket.on('connect', () => {
    showStatus('Conectado al servidor de documentos en tiempo real.', false);
});

socket.on('document_update', (newContent) => {
    if (document.activeElement !== documentContent) {
        documentContent.value = newContent;
        showStatus('Actualización recibida de otro colaborador. Hora: ' + new Date().toLocaleTimeString(), false);
    }
});

// EMITIR CAMBIOS DE ESTE CLIENTE
documentContent.addEventListener('input', () => {
    const content = documentContent.value;
    socket.emit('document_change', content);
});

// Asignar eventos a los botones
loadButton.addEventListener('click', loadDocument);
saveButton.addEventListener('click', saveDocument);


// Cargar el documento al iniciar la aplicación (se exporta para que sea llamado por el HTML)
// Nota: En ES Modules, las variables y funciones no están globalmente disponibles por defecto.
// Para este caso, lo llamaremos directamente con el evento DOMContentLoaded en el HTML.

// Puedes exponer la función si fuera necesario, pero para este caso no hace falta.
// window.loadDocument = loadDocument; // No es necesario.

// Cargar al inicio
window.addEventListener('DOMContentLoaded', loadDocument);