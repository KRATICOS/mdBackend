const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Variables de entorno
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

// 1. Configurar CORS global para tu app Express (no solo Socket.IO)
app.use(cors({
  origin: '*', // ⚠️ Puedes restringir esto en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Crear servidor HTTP
const server = http.createServer(app);

// 3. Configurar socket.io con CORS
const io = new Server(server, {
  cors: {
    origin: '*', // ⚠️ Puedes restringir esto en producción
    methods: ['GET', 'POST'],
  }
});

// 4. Conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('⚡ Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('⚡ Cliente desconectado:', socket.id);
  });
});

// 5. Rutas que dependen del socket
const notificacionesRoutes = require('./app/routes/notificacionesRoutes')(io);
app.use('/api/notificaciones', notificacionesRoutes);

// 6. Conectar a MongoDB y levantar servidor
mongoose.connect(DB_URL)
  .then(() => {
    console.log('✅ Conectado a MongoDB');

    // Servidor Express para API
    app.listen(PORT, () => {
      console.log(`🚀 Servidor HTTP corriendo en http://0.0.0.0:${PORT}`);
    });

    // Servidor Socket.IO en el mismo puerto
    server.listen(PORT + 1, '0.0.0.0', () => {
      console.log(`⚡ Socket.IO escuchando en http://0.0.0.0:${PORT + 1}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  });
