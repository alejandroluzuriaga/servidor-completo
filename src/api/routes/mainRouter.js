const express = require('express')
const librosRouter = require("./books")
const autoresRouter = require("./authors.js")

const router = express.Router()

router.use('/libros', librosRouter)
router.use('/autores', autoresRouter)

module.exports = router