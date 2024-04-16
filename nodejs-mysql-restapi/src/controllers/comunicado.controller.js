// Conexión a la DB 
import { conn } from '../db.js'
import multer from 'multer';
import path from 'path';


// const crearComunicado = async (req, res) => {
//   try {
//     const { titulo, descripcion } = req.body;
//     const portada = req.file; // Archivo de la portada

//     // Verificar si se subió una portada
//     if (!portada) {
//       return res.status(400).json({ msg: "Falta la portada" });
//     }

//     // Generar la ruta de la imagen en el servidor
//     const rutaImagen = path.join(process.cwd(), portada.path);

//     // Ejemplo de cómo guardar la ruta de la imagen en la base de datos
//     // Debes ajustar esto según la estructura de tu tabla
//     const [rows] = await conn.query("INSERT INTO comunicados_tabla(titulo, descripcion, portada) VALUES(?,?,?)", [titulo, descripcion, rutaImagen]);
    
//     if (rows.affectedRows > 0) {
//       return res.status(200).json({ msg: "Comunicado creado correctamente" });
//     }
//   } catch (error) {
//     console.error('Error al crear comunicado:', error);
//     return res.status(500).json({ msg: "Ha ocurrido un error" });
//   }
// };

// const crearComunicado = async (req, res) => {
//   try {
//     const { titulo, descripcion, marca } = req.body;
//     const portada = req.file; // Archivo de la portada
//     const pdf = req.files.pdf; // Archivo PDF
//     const puestos = req.body.puestos; // Array de puestos seleccionados

//     // Verificar si se subió una portada y un PDF
//     if (!portada || !pdf) {
//       return res.status(400).json({ msg: "Falta la portada o el archivo PDF" });
//     }

//     // Generar la ruta de la imagen y el PDF en el servidor
//     const rutaImagen = path.join(process.cwd(), portada.path);
//     const rutaPDF = path.join(process.cwd(), pdf.path);

//     // Insertar el comunicado en la base de datos
//     const [rows] = await conn.query("INSERT INTO comunicados_tabla(titulo, descripcion, portada, pdf, marca, puestos) VALUES(?,?,?,?,?,?)", [titulo, descripcion, rutaImagen, rutaPDF, marca, JSON.stringify(puestos)]);
    
//     if (rows.affectedRows > 0) {
//       return res.status(200).json({ msg: "Comunicado creado correctamente" });
//     }
//   } catch (error) {
//     console.error('Error al crear comunicado:', error);
//     return res.status(500).json({ msg: "Ha ocurrido un error" });
//   }
// };

const crearComunicado = async (req, res) => {
  try {
    const { titulo, descripcion, marca } = req.body;
    console.log(titulo, descripcion, marca)
    const portada = req.file; // Archivo de la portada
    const pdf = req.file; // Archivo PDF
    const puestos = req.body.puestos; // Array de puestos seleccionados
    console.log(puestos)

    // Verificar si se subió una portada y un PDF
    if (!portada || !pdf) {
      return res.status(400).json({ msg: "Falta la portada o el archivo PDF" });
    }

    // Generar la ruta de la imagen y el PDF en el servidor
    const rutaImagen = path.join(process.cwd(), portada.path);
    const rutaPDF = path.join(process.cwd(), pdf.path);

    // Insertar el comunicado en la base de datos
    const [rows] = await conn.query("INSERT INTO comunicados_tabla(titulo, descripcion, portada, pdf, marca, puestos) VALUES(?,?,?,?,?,?)", [titulo, descripcion, rutaImagen, rutaPDF, marca, JSON.stringify(puestos)]);
    
    if (rows.affectedRows > 0) {
      return res.status(200).json({ msg: "Comunicado creado correctamente" });
    }
  } catch (error) {
    console.error('Error al crear comunicado:', error);
    return res.status(500).json({ msg: "Ha ocurrido un error" });
  }
};


const actualizarComunicado = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    const nuevaPortada = req.file; // Nueva imagen de portada, si se proporciona

    // Validar que se esté recibiendo al menos uno de los campos a actualizar
    if (!titulo && !descripcion && !nuevaPortada) {
      return res.status(400).json({ msg: "Nada que actualizar" });
    }

    // Si se proporciona una nueva imagen de portada, procesarla y actualizar el comunicado
    if (nuevaPortada) {
      const rutaNuevaPortada = path.join(process.cwd(), nuevaPortada.path);
      // Actualizar el comunicado con la nueva imagen de portada
      const [result] = await conn.query("UPDATE comunicados_tabla SET titulo = ?, descripcion = ?, portada = ? WHERE id = ?", [titulo, descripcion, rutaNuevaPortada, id]);
      // Verificar si se actualizó correctamente
      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Comunicado no encontrado" });
      }
    } else {
      // Si no se proporciona una nueva imagen de portada, actualizar solo los campos de texto
      const [result] = await conn.query("UPDATE comunicados_tabla SET titulo = ?, descripcion = ? WHERE id = ?", [titulo, descripcion, id]);
      // Verificar si se actualizó correctamente
      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Comunicado no encontrado" });
      }
    }

    res.status(200).json({ msg: "Comunicado actualizado correctamente" });
  } catch (error) {
    console.error('Error al actualizar el comunicado:', error);
    return res.status(500).json({ msg: "Ha ocurrido un error" });
  }
};


const eliminarComunicado = async (req, res) => {
    try {
        const [result] = await conn.query("DELETE FROM comunicados_tabla WHERE id = ?", [req.params.id])
        if(result.affectedRows <=0) return res.status(404).json({msg: "Comunicado no encontrado"})
        // Realiza la acción pero no envía una respuesta (mensaje) al usuario
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            msg: "Ha ocurrido un error"
        })
    }
}

const obtenerComunicados = async (req, res) => {
    try {
        const [rows] = await conn.query("SELECT * FROM comunicados_tabla")
        res.send(rows); // Envía directamente el array de comunicados
    } catch (error) {
        return res.status(500).json({
            msg: "Ha ocurrido un error"
        })
    }
}


const obtenerComunicado = async (req, res) => {
    try {
        // console.log(req.params.id)
        const [rows] = await conn.query("SELECT * FROM comunicados_tabla WHERE id = ?", [req.params.id])
        // console.log(rows)
        if(rows.length <= 0) return res.status(404).json({msg: "Comunicado no encontrado"})
        res.json(rows[0])
        // res.send("Obteniendo comunicado")
    } catch (error) {
        return res.status(500).json({
            msg: "Ha ocurrido un error"
        })
    }
    
}

// localhost:3000/ciudades
// -- Puede ser izzi wizz o wizz plus
// localhost:3000/ciudades/?marca=wizz 
const obtenerCiudades = async (req, res) => {
  const marca = req.query.marca;
  try {
      let query;
      let queryParams = [];
      
      if (!marca || marca === 'nacional') {
          // Si no se selecciona ninguna marca o se selecciona 'nacional', se obtienen todas las ciudades
          query = "SELECT DISTINCT division, region, ciudad FROM atc_sucursal WHERE division <> 'MetroSur' ORDER BY division";
      } else {
          // Si se selecciona una marca diferente a 'nacional', se obtienen las ciudades de esa marca
          query = "SELECT DISTINCT division, region, ciudad FROM atc_sucursal WHERE division <> 'MetroSur' AND marca = ? ORDER BY division";
          queryParams = [marca];
      }

      const [rows] = await conn.query(query, queryParams);
      res.send(rows); // Envía directamente el array de ciudades
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ha ocurrido un error al obtener los datos de las ciudades' });
  }
};

// localhost:3000/divisiones
const obtenerDivisiones = async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT DISTINCT division FROM atc_sucursal WHERE division <> 'MetroSur' ORDER BY division")
    res.send(rows); // Envía directamente el array de comunicados
  } catch (error) {
      return res.status(500).json({
          msg: "Ha ocurrido un error"
      })
  }
}

// localhost:3000/regiones
const obtenerRegiones = async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT DISTINCT region FROM atc_sucursal WHERE region NOT IN('Golfo', '') ORDER BY region")
    res.send(rows); // Envía directamente el array de comunicados
  } catch (error) {
      return res.status(500).json({
          msg: "Ha ocurrido un error"
      })
  }
}

// http://localhost:3000/ciudadesporregion/centro
const getCitiesByRegion = async (req, res) => {
  // const region = req.params.region;
  const { region } = req.params;
  console.log(region)
  try {
    const [rows] = await conn.query("SELECT DISTINCT ciudad FROM atc_sucursal WHERE region = ? ORDER BY ciudad", [region]);
    console.log(rows)
    res.send(rows); // Envía directamente el array de ciudades
  } catch (error) {
      return res.status(500).json({
          msg: "Ha ocurrido un error"
      });
  }
};

// http://localhost:3000/regionespordivision/sur
const getRegionsByDivision = async (req, res) => {
  const { division } = req.params;
  console.log(division)
  try {
    const [rows] = await conn.query("SELECT DISTINCT region FROM atc_sucursal WHERE division = ? ORDER BY ciudad", [division]);
    console.log(rows)
    res.send(rows); // Envía directamente el array de ciudades
  } catch (error) {
      return res.status(500).json({
          msg: "Ha ocurrido un error"
      });
  }
}

// AUN NO HACE NADA 
// const getCitiesByRegionsAndRegionsByDivision = async (req, res) => {
//   const { division, region } = req.params;
//   console.log(division - region)
//   try {
//     const [rows] = await conn.query("SELECT division DISTINCT region FROM atc_sucursal WHERE division = ? AND region = ? ORDER BY ciudad", [division, region]);
//     console.log(rows)
//     res.send(rows); // Envía directamente el array de ciudades
//   } catch (error) {
//       return res.status(500).json({
//           msg: "Ha ocurrido un error"
//       });
//   }
// }

// Si presiona en seleccionar todo 
const getAll = async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT DISTINCT division, region, ciudad FROM atc_sucursal WHERE division <> 'MetroSur' ORDER BY division")
    res.send(rows); // Envía directamente el array de comunicados
  } catch (error) {
      return res.status(500).json({
          msg: "Ha ocurrido un error"
      })
  }
}



// localhost:3000/marcas
const obtenerMarcas = async (req, res) => {
    try {
        const [rows] = await conn.query("SELECT DISTINCT marca FROM atc_sucursal ORDER BY marca")
        res.send(rows); // Envía directamente el array de comunicados
    } catch (error) {
        return res.status(500).json({
            msg: "Ha ocurrido un error"
        })
    }
}

// 10:08 a. m. 15/04/2024

const deseleccionarDivision = async (req, res) => {
  try {
    const { division } = req.body;
    // Filtra las ciudades seleccionadas para eliminar las correspondientes a la división
    const updatedCiudadesSeleccionadas = ciudadesSeleccionadas.filter(ciudad =>
        !Object.keys(ciudades[division]).some(region =>
            ciudades[division][region].includes(ciudad)
        )
    );
    // Enviar la respuesta con las ciudades seleccionadas actualizadas al frontend
    res.status(200).json({ ciudadesSeleccionadas: updatedCiudadesSeleccionadas, msg: "División deseleccionada correctamente" });
  } catch (error) {
    console.error('Error al deseleccionar división:', error);
    return res.status(500).json({ msg: "Ha ocurrido un error" });
  }
};

const deseleccionarRegion = async (req, res) => {
  try {
    const { division, region } = req.body;
    // Filtra las ciudades seleccionadas para eliminar las correspondientes a la región
    const updatedCiudadesSeleccionadas = ciudadesSeleccionadas.filter(ciudad =>
        !(ciudades[division] && ciudades[division][region] && ciudades[division][region].includes(ciudad))
    );
    // Enviar la respuesta con las ciudades seleccionadas actualizadas al frontend
    res.status(200).json({ ciudadesSeleccionadas: updatedCiudadesSeleccionadas, msg: "Región deseleccionada correctamente" });
  } catch (error) {
    console.error('Error al deseleccionar región:', error);
    return res.status(500).json({ msg: "Ha ocurrido un error" });
  }
};

const deseleccionarCiudad = async (req, res) => {
  try {
    const { ciudad } = req.body;
    // Filtra las ciudades seleccionadas para eliminar la ciudad seleccionada
    const updatedCiudadesSeleccionadas = ciudadesSeleccionadas.filter(c => c.id !== ciudad.id);
    // Enviar la respuesta con las ciudades seleccionadas actualizadas al frontend
    res.status(200).json({ ciudadesSeleccionadas: updatedCiudadesSeleccionadas, msg: "Ciudad deseleccionada correctamente" });
  } catch (error) {
    console.error('Error al deseleccionar ciudad:', error);
    return res.status(500).json({ msg: "Ha ocurrido un error" });
  }
};


export {
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
};