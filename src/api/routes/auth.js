const express = require('express')
var jwt = require('jsonwebtoken')
const { hasValidAuthJWT } = require('../middlewares/authentication')
const { registrarUsuario, loginUsuario } = require('../controllers/auth')

const router = express.Router()

const SECRET_TOKEN = 'Clavinova99?!'

router.get('/authenticated', hasValidAuthJWT, (req, res)=>{
    res.status(200).json({data: 'Autenticado correctamente!'})
})

router.post('/register', registrarUsuario)
router.post('/login', loginUsuario)

module.exports = router