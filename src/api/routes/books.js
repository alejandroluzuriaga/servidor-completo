const express = require("express");
const { getTodosLosLibros, getLibroPorID, crearLibro, actualizarLibro, eliminarLibro, getLibroPorIDyAutor } = require("../controllers/books.js");
const { hasValidAuthJWT } = require("../middlewares/authentication.js");
const router = express.Router();

router.get("/", getTodosLosLibros)
router.get("/:id", getLibroPorID)
router.get("/populate/:id", getLibroPorIDyAutor)
router.post("/", hasValidAuthJWT, crearLibro)
router.put("/:id", hasValidAuthJWT, actualizarLibro)
router.delete("/:id", hasValidAuthJWT, eliminarLibro)

module.exports = router