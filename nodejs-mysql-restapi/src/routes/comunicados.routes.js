import { Router } from "express";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { 
  obtenerComunicados, 
  obtenerComunicado, 
  crearComunicado, 
  actualizarComunicado, 
  eliminarComunicado,
  obtenerCiudades,
  obtenerMarcas, 
  obtenerDivisiones,
  obtenerRegiones,
  getCitiesByRegion,
  getRegionsByDivision,
  // getCitiesByRegionsAndRegionsByDivision,
  getAll,
  deseleccionarDivision,
  deseleccionarRegion,
  deseleccionarCiudad
} from "../controllers/comunicado.controller.js";

const router = Router();

// Directorio donde se guardarán las imágenes
const uploadDirectory = 'uploads/';

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Verificar si el directorio de destino existe, si no, crearlo
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nombre original del archivo
  }
});

// Middleware de multer para cargar la portada
const uploadPortada = multer({ storage: storage }).single('portada');

// Middleware de multer para cargar el archivo PDF
const uploadPDF = multer({ storage: storage }).single('pdf');

// Ruta para manejar la carga de archivos
router.post('/comunicados', (req, res) => {
  // Primero, cargar la portada
  uploadPortada(req, res, (err) => {
    if (err) {
      // Manejar errores de carga de portada
      return res.status(500).json({ error: 'Error al cargar la portada' });
    }
    
    // Luego, cargar el archivo PDF
    uploadPDF(req, res, (err) => {
      if (err) {
        // Manejar errores de carga de PDF
        return res.status(500).json({ error: 'Error al cargar el PDF' });
      }
      
      // Si ambos archivos se cargaron correctamente, continuar con la lógica para crear el comunicado
      // Llamar a la función en el controlador para crear el comunicado
      comunicadoController.crearComunicado(req, res);
    });
  });
});

// COMUNICADOS 
router.get("/comunicados", obtenerComunicados);
router.get("/comunicados/:id", obtenerComunicado);
router.patch("/comunicados/:id", actualizarComunicado);
router.delete("/comunicados/:id", eliminarComunicado);

// ATC_SUCURSAL 
router.get("/ciudades", obtenerCiudades);
router.get("/ciudades/ciudad", obtenerCiudades);
router.get("/marcas", obtenerMarcas);
router.get("/divisiones", obtenerDivisiones)
router.get("/regiones", obtenerRegiones)

router.get("/ciudadesporregion/:region", getCitiesByRegion)
router.get("/regionespordivision/:division", getRegionsByDivision)
// router.get("/todo/:division/:region", getCitiesByRegionsAndRegionsByDivision)
router.get("/todo", getAll)

router.post("/deseleccionardivision", deseleccionarDivision);
router.post("/deseleccionarregion", deseleccionarRegion);
router.post("/deseleccionarciudad", deseleccionarCiudad);


export default router;
