// server.js
import express from 'express';
import { promises as fs } from 'fs'; // Importación con 'promises as fs'
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para __dirname 
import http from 'http';
import { Server } from "socket.io";

// Definición de __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;
const HOST = '0.0.0.0'; 

// Crear servidor HTTP y adjuntar Socket.IO
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// Ruta al archivo de texto plano
const DOCUMENT_PATH = path.join(__dirname, 'shared_document.txt');

app.use(express.json());

// Configuración de CORS de Express
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// ----------------------------------------------------
app.get('/api/document', async (req, res) => {
    console.log(`Petición GET para leer el documento desde: ${req.ip}`);
    
    try {
      const content = await fs.readFile(DOCUMENT_PATH, 'utf8');
      res.json({ content });
    } 
    catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(DOCUMENT_PATH, '', 'utf8');
        return res.json({ content: '' });
      }
      console.error('Error al leer el archivo:', error);
      res.status(500).json({ error: 'Error interno del servidor al leer el documento.' });
    }
});

app.post('/api/document', async (req, res) => {
    console.log(`Petición POST para escribir el documento desde: ${req.ip}`);
    const { content } = req.body;

    if (typeof content === 'undefined') {
        return res.status(400).json({ 
          error: 'El cuerpo de la petición debe contener la propiedad "content".' 
        });
    }

    try {
        await fs.writeFile(DOCUMENT_PATH, content, 'utf8');
        res.status(200).json({ message: 'Documento guardado con éxito.' });
    } catch (error) {
        console.error('Error al escribir el archivo:', error);
        res.status(500).json({ error: 'Error interno del servidor al guardar el documento.' });
    }
});

// ----------------------------------------------------
// EVENTOS DE SOCKET.IO 
io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('document_change', (newContent) => {
        socket.broadcast.emit('document_update', newContent);
    });
    
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});
// ----------------------------------------------------

server.listen(PORT, HOST, () => {
    console.log('--------------------------------------------------');
    console.log(`Servidor Express y Socket.IO (ES Modules) escuchando!`);
    console.log(`Puerto: ${PORT}`);
    console.log(`   -> http://localhost:${PORT}`);
    console.log('--------------------------------------------------');
});