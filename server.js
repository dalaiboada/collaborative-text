// server.js
const express = require('express');
const fs = require('fs').promises; // Usamos la versión de promesas para operaciones asíncronas
const path = require('path');

const app = express();
const PORT = 3000;
// Usamos '0.0.0.0' para escuchar en todas las interfaces de red disponibles
const HOST = '0.0.0.0';

// Ruta al archivo de texto plano que compartiremos
const DOCUMENT_PATH = path.join(__dirname, 'shared_document.txt');

// Middleware para parsear el cuerpo de las peticiones JSON
app.use(express.json());

// ----------------------------------------------------
// Configuración de CORS (Permite peticiones desde cualquier origen, útil si accedes desde otra máquina)
// Si el servidor Node.js sirve el HTML, esto es opcional, pero lo mantenemos como buena práctica.
app.use((req, res, next) => {
  // Permite cualquier origen para facilitar las pruebas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Servir archivos estáticos (como index.html)
app.use(express.static(path.join(__dirname)));

// ----------------------------------------------------
// ENDPOINTS DE LA API PARA EL DOCUMENTO

// GET: Leer el contenido del documento
app.get('/api/document', async (req, res) => {
  console.log(`Petición GET para leer el documento desde: ${req.ip}`);
  try {
    // Intentar leer el contenido del archivo
    const content = await fs.readFile(DOCUMENT_PATH, 'utf8');
    res.json({ content });
  } catch (error) {
    // Si el archivo no existe, lo creamos vacío.
    if (error.code === 'ENOENT') {
      await fs.writeFile(DOCUMENT_PATH, '', 'utf8');
      return res.json({ content: '' });
    }
    console.error('Error al leer el archivo:', error);
    res.status(500).json({ error: 'Error interno del servidor al leer el documento.' });
  }
});

// POST: Escribir/Actualizar el contenido del documento
app.post('/api/document', async (req, res) => {
  console.log(`Petición POST para escribir el documento desde: ${req.ip}`);
  const { content } = req.body;

  if (typeof content === 'undefined') {
    return res.status(400).json({ error: 'El cuerpo de la petición debe contener la propiedad "content".' });
  }

  try {
    // Escribir el nuevo contenido en el archivo
    await fs.writeFile(DOCUMENT_PATH, content, 'utf8');
    res.status(200).json({ message: 'Documento guardado con éxito.' });
  } catch (error) {
    console.error('Error al escribir el archivo:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar el documento.' });
  }
});

// ----------------------------------------------------

// Inicializar el servidor
app.listen(PORT, HOST, () => {
  console.log('--------------------------------------------------');
  console.log(`Servidor Express escuchando en TODAS las interfaces!`);
  console.log(`Puerto: ${PORT}`);
  console.log(`Accede a la app usando tu IP estática o localhost:`);
  console.log(`   -> http://localhost:${PORT}`);
  console.log('--------------------------------------------------');
});