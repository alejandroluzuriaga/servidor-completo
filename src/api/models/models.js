const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema({
    titulo: String,
    anio_publicacion: Number,
    genero: String,
    nombreAutor: String,
    autor: mongoose.Schema.Types.ObjectId
});

const autorSchema = new mongoose.Schema({
    nombre: String,
    librosEscritos: [mongoose.Schema.Types.ObjectId]
});

const Libro = mongoose.model("Libro", libroSchema);
const Autor = mongoose.model("Autor", autorSchema);

module.exports = {Libro, Autor};
