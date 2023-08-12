const express = require('express')
const { hasValidAuthJWT } = require('../middlewares/authentication')
const { crearUser, getTodosLosUsers, getUserPorID, eliminarUser } = require('../controllers/users')

const router = express.Router()

router.get('/', getTodosLosUsers)
router.get('/:id', hasValidAuthJWT, getUserPorID)
router.delete('/:id', hasValidAuthJWT, eliminarUser)

module.exports = router