const { Autor, Libro } = require("../models/models.js");
const mongoose = require("mongoose")

const getTodosLosAutores = async (req, res) => {
  try {
    const autores = await Autor.find().lean();

    if (!autores) {
      return res.status(404).json({ error: "No hay autores en la BD" });
    }

    res.status(200).json({ data: autores });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};


const getAutorPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const autor = await Autor.findById(id);
    if (!autor) {
      return res.status(404).json({ error: "No existe este autor en la BD" });
    }
    res.status(200).json({ data: autor });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const crearAutor = async (req, res) => {
  try {
    const {nombre} = req.body
    if (!nombre) {
      return res.status(500).json({ data: "Es necesario indicar el nombre del autor" });
    }

    const camposOK = validarCamposPermitidos(req.body)
    if (!camposOK){
      return res.status(400).json({error: "Campos incorrectos. Solo es necesario 'nombre' del autor"})
    }

    const existe = await Autor.findOne({ nombre: req.body.nombre }).lean();
    if (existe) {
      return res.status(400).json({ error: `Autor ya existente en la base de datos` });
    }
    
    const autor = new Autor({
      nombre: nombre,
      librosEscritos: [],
    });

    await autor.save();

    res.status(201).json({ data: autor });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const actualizarAutor = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  try {

    const camposOK = validarCamposPermitidos(req.body)
    if (!camposOK){
      return res.status(400).json({error: "Campos incorrectos. Solo puedes modificar 'nombre' del autor"})
    }
    const actualizacion = {};
    if (nombre !== null) actualizacion.nombre = nombre;

    if (Object.keys(actualizacion).length === 0) {
      return res
        .status(400)
        .json({ error: "No se proporcionaron campos para actualizar" });
    }

    const autorActualizado = await Autor.findByIdAndUpdate(id, actualizacion, {new: true,});

    if (!autorActualizado) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    await Promise.all( //Actualizar el nombre del autor en los libros que ha escrito
      autorActualizado.librosEscritos.map(async (objectID) =>{
        console.log(objectID.toString())
        await Libro.findByIdAndUpdate(objectID.toString(), {nombreAutor: autorActualizado.nombre})
      })
    )

    res.status(200).json({ data: autorActualizado });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const eliminarAutor = async (req, res) => {
  const { id } = req.params;
  try {
    const autor = await Autor.findById(id);

    if (!autor) {
      return res.status(404).json({ error: "Este autor no está en la base de datos" });
    } else {
    await Promise.all(  //Eliminar el campo "autor" de  todos los libros que haya escrito el autor a eliminar
      autor.librosEscritos.map(async (objectID) => {
        await Libro.findByIdAndUpdate(objectID.toString(), {
          $set: { autor: null }
        });
      })
    );
      await Autor.deleteOne({ _id: id });

      return res.status(200).json({ data: `Autor borrado: ${autor.get("nombre")}` });
    }
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const getAutorPorIDyLibrosEscritos = async (req, res) => {
  const { id } = req.params;
  try {
    const autor = await Autor.findById(id)
      .populate({
        path: 'librosEscritos',
        model: 'Libro',
        select: {
          titulo: true,
          anio_publicacion: true,
          genero: true,
        }
      });

    if (!autor) {
      return res.status(404).json({ error: "Este autor no está en la BD" });
    } else {
      return res.status(200).json({ data: autor });
    }
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const actualizarLibrosEscritosporIDs = async (req, res) => {
  const { idAutor, idLibro } = req.params;
  try {
    const autor = await Autor.findById(idAutor)
    const libro = await Libro.findById(idLibro)

    if (!autor || !libro) {
      return res.status(404).json({ data: "Autor o libro inexistente en la BD" });
    }

    const existe = existeIDenLibrosEscritos(autor.librosEscritos, idLibro) //Comprobar si la id del libro ya esta en el array de libros escritos del autor
    if (!existe) { //Libro no está en array
      await agregarLibroEscrito(idAutor, idLibro) //Agregar libro a libros escritos
      if (libro.autor){ //El campo autor no es null
        if (libro.autor.toString() !== idAutor){ 
          await eliminarLibroAutor(libro.autor.toString(), idLibro)//Eliminar el idLibro del autor anterior 
          await actualizarInfoLibro(idAutor, idLibro, autor) //Actualizar los datos del libro (nombre e id del autor nuevo)
        }
      } else{ //El campo autor es null
        await actualizarInfoLibro(idAutor, idLibro, autor) //Actualizar los datos del libro (nombre e id del autor nuevo)
      }
      
      return res.status(201).json({ data: `Libro agregado a la lista de libros de ${autor.get('nombre')}`, titulo: libro.get('titulo')  });

    } else {//Libro está en array
      await eliminarLibroAutor(idAutor, idLibro)
      return res.status(200).json({ data: `Libro eliminado de la lista de libros de ${autor.get('nombre')}`, titulo: libro.get('titulo')  });
    }
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

// Funciones auxiliares para controladores
const agregarLibroEscrito = async (idAutor, idLibro) =>{
  await Autor.findByIdAndUpdate(idAutor, {
    $push: {
      librosEscritos: new mongoose.Types.ObjectId(idLibro)
    }
  })
}

const eliminarLibroAutor = async (idAutor, idLibro) =>{
  await Autor.findByIdAndUpdate(idAutor, {
    $pull: {
      librosEscritos: new mongoose.Types.ObjectId(idLibro)
    }
  })
}

const actualizarInfoLibro = async (idAutor, idLibro, autor) =>{
  await Libro.findByIdAndUpdate(idLibro, {
    nombreAutor: autor.nombre,
    autor: new mongoose.Types.ObjectId(idAutor)
  })
}

const existeIDenLibrosEscritos = (libros, idLibro) => {
  return libros.some(id => id.toString() === idLibro);
}

const validarCamposPermitidos = (body) =>{
  const camposPermitidos = ["nombre"];
  for (const campo in body) {
    if (!camposPermitidos.includes(campo)) {
      return false;
    }
  }
  return true;
}

module.exports = {
  getTodosLosAutores,
  getAutorPorID,
  crearAutor,
  actualizarAutor,
  eliminarAutor,
  getAutorPorIDyLibrosEscritos,
  actualizarLibrosEscritosporIDs,
  eliminarLibroAutor,
  agregarLibroEscrito
};
