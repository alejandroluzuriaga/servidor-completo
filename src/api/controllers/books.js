const { get, default: mongoose } = require("mongoose");
const { Libro, Autor } = require("../models/models.js")
const {eliminarLibroAutor, agregarLibroEscrito} = require("./authors.js")

const getTodosLosLibros = async (req, res) => {
  try {
    const libros = await Libro.find().lean();

    if (!libros) {
      return res.status(404).json({ error: "No hay libros en la BD" });
    }

    res.status(200).json({ data: libros });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const getLibroPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findById(id);
    if (!libro) {
      return res.status(404).json({ error: "No existe este libro en la BD" });
    }
    res.status(200).json({ data: libro });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const crearLibro = async (req, res) => {
  try {
    const { titulo, nombreAutor, anio_publicacion, genero } = req.body;

    if (!titulo || !nombreAutor || !anio_publicacion || !genero) {
      return res.status(500).json({ data: "Campos incompletos o incorrectos. Si el autor es anónimo, usa 'Anónimo' como nombre del autor" });
    }

    const libro = new Libro({
      titulo,
      nombreAutor,
      anio_publicacion,
      genero,
    });

    await libro.save();
    const autor = await Autor.findOne({nombre: libro.nombreAutor}).lean()

    if (autor) {
      await agregarLibroEscrito(autor._id.toString(), libro._id.toString())//Si autor ya existe, agrega el libro en su array de libros escritos directamente.
    }

    await Libro.findByIdAndUpdate(libro._id.toString(), {autor: autor?._id || null}, {
      new: true,
    });

    res.status(201).json({ data: libro });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const actualizarLibro = async (req, res) => {
  const { id } = req.params;
  const { titulo, anio_publicacion, genero } = req.body;

  console.log(req.body)

  try {
    if (req.body.nombreAutor){
      return res
        .status(500)
        .json({error: "No es posible modificar el nombre del autor del libro con esta función. Actualiza los datos del autor con el PUT correcto"})
    }

    const camposOK = validarCamposPermitidos(req.body)
    if (!camposOK){
      return res.status(400).json({error: "Campos incorrectos. Solo puedes modificar 'titulo, anio_publicacion y genero'"})
    }

    const actualizacion = {};
    if (titulo !== null) actualizacion.titulo = titulo;
    if (anio_publicacion !== null) actualizacion.anio_publicacion = anio_publicacion;
    if (genero !== null) actualizacion.genero = genero;

    if (Object.keys(actualizacion).length === 0) {
      return res
        .status(400)
        .json({ error: "No se proporcionaron campos para actualizar" });
    }

    if (Object.keys(actualizacion).length > 3){
      return res
        .status(400)
        .json({ error: "Demasiados campos para actualizar" });
    }

    const libroActualizado = await Libro.findByIdAndUpdate(id, actualizacion, {
      new: true,
    });

    if (!libroActualizado) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.status(200).json({ data: libroActualizado });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const eliminarLibro = async (req, res) => {
  const { id } = req.params;
  try {
    const libro = await Libro.findById(id);

    if (!libro) {
      return res.status(404).json({ error: "No hay libros en la BD" });
    } else {
      await Libro.deleteOne({ _id: id }); //Borrar libro
      await eliminarLibroAutor(libro.autor.toString(), id) //Borrar libro de los libros escritos del autor
      return res.status(200).json({ data: 'Libro borrado:', libro });
    }
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const getLibroPorIDyAutor = async (req, res) => {
  const { id } = req.params;
  try {
    const libro = await Libro.findById(id)
      .populate({
        path: 'autor',
        model: 'Autor',
        select: {
          nombre: true,
          librosEscritos: true
        },
        populate: {
          path: 'librosEscritos',
          model: 'Libro', // Cambia 'Libro' por el nombre de tu modelo de libros si es diferente
          select: {
            titulo: true,
            anio_publicacion: true,
            genero: true,
          },
        },
      });

    if (!libro) {
      return res.status(404).json({ error: "Este libro no está en la BD" });
    } else {
      return res.status(200).json({ data: libro });
    }
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
}

const validarCamposPermitidos = (body) =>{
  const camposPermitidos = ["titulo", "anio_publicacion", "genero"];
  for (const campo in body) {
    if (!camposPermitidos.includes(campo)) {
      return false;
    }
  }
  return true;
}


module.exports = {
  getTodosLosLibros,
  getLibroPorID,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  getLibroPorIDyAutor
}