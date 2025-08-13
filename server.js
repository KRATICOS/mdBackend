require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// Variables de entorno
// Render proporcionará estas variables automáticamente si las configuras en su dashboard
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/mdBackend';
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Inicializar servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
