require("dotenv").config();
const db = require("./db.js");
const seed = require("../api/seed/seed.js");
const { Libro, Autor, User } = require("../api/models/models.js");

const relationalSeed = (seed) => {
  const localSeed = structuredClone(seed)
  // Iterar a través de los libros en el seed y crear la relación con los autores
  localSeed.libros.forEach((libro, index) => {
    libro.index = index;
    const autorIndex = localSeed.autores.findIndex(autor => autor.nombre === libro._autor);

    if (autorIndex !== -1) {
      const autor = localSeed.autores[autorIndex];
      if (!autor._librosEscritos) {
        autor._librosEscritos = [];
      }
      autor._librosEscritos.push(index);
    }
  })
  localSeed.autores.forEach((autor) => {
    if (!autor.librosEscritos) {
      autor.librosEscritos = []
    }
  });

  return localSeed;
};

const relacionarAutoresconLibros = async (autores, libros) => {
  await Promise.all(
    libros.map(async (libro) => {
      const autor = autores.find((autor) => autor.nombre === libro._autor);
      if (autor) {
        await Autor.findByIdAndUpdate(
          autor._id,
          { $push: { librosEscritos: libro._id } }
        );
        await Libro.findByIdAndUpdate(
          libro._id,
          {
            nombreAutor: autor.nombre,
            autor: autor._id
          }
        )
      }
    })
  );
}

const limpiarCampos = async () => {
  await Autor.updateMany({}, { $unset: { _librosEscritos: 1 } });
  await Libro.updateMany({}, { $unset: { _autor: 1, index: 1 } });
};

// Llamar a la función y obtener el objeto seed actualizado
const updatedSeed = relationalSeed(seed);

const main = async () => {
  // if (Libro.collection && Autor.collection){
  //   await Libro.collection.drop();
  //   await Autor.collection.drop();
  //   await User.collection.drop();
  // }
  const autores = await Autor.insertMany(updatedSeed.autores)
  const libros = await Libro.insertMany(updatedSeed.libros);
  await relacionarAutoresconLibros(autores, libros)
  await limpiarCampos()

};

main()
  .then(() => {
    console.log("Base de datos llenada correctamente")
    process.exit(1)
  })
  .catch((err) => {
    console.log("Error lanzando script!", err);
    process.exit(1);
  });