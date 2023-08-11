const express = require("express");
const { getTodosLosLibros, getLibroPorID, crearLibro, actualizarLibro, eliminarLibro, getLibroPorIDyAutor } = require("../controllers/books.js");
const router = express.Router();

router.get("/", getTodosLosLibros)
router.get("/:id", getLibroPorID)
router.get("/populate/:id", getLibroPorIDyAutor)
router.post("/", crearLibro)
router.put("/:id", actualizarLibro)
router.delete("/:id", eliminarLibro)
router.get("*", (req, res) => {
    res.status(404).json({ error: "Ruta no encontrada en libros" });
  });
module.exports = router