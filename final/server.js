const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Configuración del servidor
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/torneoPadel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Modelo de datos para Participantes
const participanteSchema = new mongoose.Schema({
    nombre: String,
    fechaNacimiento: Date,
    genero: String,
    categoria: String,
    lado: String,
    manoHabil: String,
    puntos: { type: Number, default: 0 } // Inicializar puntos
});

const Participante = mongoose.model('Participante', participanteSchema);

// Modelo de datos para Resultados
const resultadoSchema = new mongoose.Schema({
    ronda: Number,
    partidos: [
        {
            partido: String,
            resultado: String,
            puntos: [Number],
            formato: String, // Almacenar el formato
        },
    ],
});

const Resultado = mongoose.model('Resultado', resultadoSchema);

// Rutas
app.post('/api/participantes', async (req, res) => {
    try {
        const participante = new Participante(req.body);
        await participante.save();
        res.status(201).send(participante);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/api/participantes', async (req, res) => {
    try {
        const participantes = await Participante.find();
        res.send(participantes);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/resultados', async (req, res) => {
    try {
        const { ronda, partidos } = req.body;
        const nuevoResultado = new Resultado({ ronda, partidos });
        await nuevoResultado.save();
        res.status(201).send(nuevoResultado);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/api/resultados', async (req, res) => {
    try {
        const resultados = await Resultado.find();
        res.send(resultados);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
