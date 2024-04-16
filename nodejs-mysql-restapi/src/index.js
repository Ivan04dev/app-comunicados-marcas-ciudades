import express from 'express'
import cors from 'cors';

import comunicadosRoutes from './routes/comunicados.routes.js'
import indexRoutes from './routes/index.routes.js'
import {PORT} from './config.js'

// Instancia de express 
const app = express();

// Habilita el uso de CORS para poder comunicarse con el Frontend
app.use(cors());

app.use(express.json());

// Rutas
app.use(comunicadosRoutes)
app.use(indexRoutes)
app.use( (req, res, next) => {
    res.status(404).json({msg: "Página no encontrada"})
})

// Se define el puerto 
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto 3000 2.0 updated")
})