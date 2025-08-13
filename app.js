const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'capacitor://localhost',                  // APK / Capacitor
  'http://localhost',                        // Desarrollo navegador
  'http://localhost:8100',                   // Ionic live reload
  'https://frontend-oficial.onrender.com',   // Frontend en Render
  'https://mdbackend-ys7z.onrender.com'     // Backend en Render
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', corsOptions); // Maneja preflight requests


app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const authRoutes = require('./app/routes/authRoutes');
const usuarioRoutes = require('./app/routes/usuarioRoutes');
const itemsRoutes = require('./app/routes/items');
const historialRoutes = require('./app/routes/historialRoutes');
const inventarioRoutes = require('./app/routes/inventarioRoutes');
const uploadRoutes = require('./app/routes/uploadRoutes');
const categoriaRoutes = require('./app/routes/categoriaRoutes'); // ← ✅ NUEVO

app.use('/api', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/categorias', categoriaRoutes); 

module.exports = app;
