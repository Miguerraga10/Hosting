import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Esquema RSVP
const rsvpSchema = new mongoose.Schema({
  nombre: String,
  asistentes: Number,
  mensaje: String,
  confirmado: Boolean,
  fecha: { type: Date, default: Date.now }
});
const RSVP = mongoose.model('Confirmaciones', rsvpSchema, 'Confirmaciones');

// Conexión MongoDB Atlas
const uri = 'mongodb+srv://M10:Miguel1005@cluster0.t74ecjo.mongodb.net/invitacion15sNicolFranco?retryWrites=true&w=majority';
mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB Atlas');
});
mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB Atlas:', err.message);
});
mongoose.connect(uri);

// Ruta para guardar RSVP
app.post('/api/rsvp', async (req, res) => {
  try {
    const nuevo = new RSVP(req.body);
    await nuevo.save();
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta para obtener todos los RSVP
app.get('/api/confirmaciones', async (req, res) => {
  try {
    const lista = await RSVP.find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Servidor backend en puerto', PORT));
