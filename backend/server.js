import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Esquema RSVP
const rsvpSchema = new mongoose.Schema({
  nombre: String,
  asistentes: Number,
  mensaje: String,
  confirmado: Boolean,
  fecha: { type: Date, default: Date.now }
});

const RSVP = mongoose.model(
  process.env.COLLECTION_NAME || 'Confirmaciones', 
  rsvpSchema, 
  process.env.COLLECTION_NAME || 'Confirmaciones'
);

// Configuración de conexión MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Error: MONGODB_URI no está definida en las variables de entorno');
  process.exit(1);
}

mongoose.connection.on('connected', () => {
  console.log(`Conectado a MongoDB Atlas - Base de datos: ${process.env.DB_NAME || 'invitacion15sNicolFranco'}`);
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB Atlas:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Desconectado de MongoDB Atlas');
});

// Conexión a MongoDB
mongoose.connect(mongoUri);

// Ruta para guardar RSVP
app.post('/api/rsvp', async (req, res) => {
  try {
    const nuevo = new RSVP(req.body);
    await nuevo.save();
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Error al guardar RSVP:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta para obtener todos los RSVP
app.get('/api/confirmaciones', async (req, res) => {
  try {
    console.log('Solicitud recibida para /api/confirmaciones');
    const lista = await RSVP.find();
    console.log(`Encontradas ${lista.length} confirmaciones`);
    res.json(lista);
  } catch (err) {
    console.error('Error al obtener confirmaciones:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});
