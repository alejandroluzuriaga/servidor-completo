const express = require('express')
const librosRouter = require("./books")
const autoresRouter = require("./authors.js")
const authRouter = require("./auth.js")
const usersRouter = require("./users.js")

const router = express.Router()

router.use('/libros', librosRouter)
router.use('/autores', autoresRouter)
router.use('/users', usersRouter)
router.use('/auth', authRouter)

module.exports = router