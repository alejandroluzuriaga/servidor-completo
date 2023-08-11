const express = require("express");
const { getTodosLosAutores, getAutorPorID, crearAutor, actualizarAutor, eliminarAutor, getAutorPorIDyLibrosEscritos, actualizarLibrosEscritosporIDs } = require("../controllers/authors.js");
const router = express.Router();

router.get("/", getTodosLosAutores)
router.get("/:id", getAutorPorID)
router.get("/populate/:id", getAutorPorIDyLibrosEscritos)
router.post("/", crearAutor)
router.put("/:id", actualizarAutor)
router.put("/:idAutor/:idLibro", actualizarLibrosEscritosporIDs)
router.delete("/:id", eliminarAutor)
router.get("*", (req, res) => {
    res.status(404).json({ error: "Ruta no encontrada en autores" });
  });
module.exports = router