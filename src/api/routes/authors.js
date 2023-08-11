const express = require("express");
const { getTodosLosAutores, getAutorPorID, crearAutor, actualizarAutor, eliminarAutor, getAutorPorIDyLibrosEscritos, actualizarLibrosEscritosporIDs } = require("../controllers/authors.js");
const { hasValidAuthJWT } = require("../middlewares/authentication.js");
const router = express.Router();

router.get("/", getTodosLosAutores)
router.get("/:id", getAutorPorID)
router.get("/populate/:id", getAutorPorIDyLibrosEscritos)
router.post("/", hasValidAuthJWT, crearAutor)
router.put("/:id", hasValidAuthJWT, actualizarAutor)
router.put("/:idAutor/:idLibro", hasValidAuthJWT, actualizarLibrosEscritosporIDs)
router.delete("/:id", hasValidAuthJWT, eliminarAutor)
router.get("*", (req, res) => {
    res.status(404).json({ error: "Ruta no encontrada en autores" });
  });
module.exports = router