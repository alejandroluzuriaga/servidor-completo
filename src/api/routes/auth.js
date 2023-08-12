const express = require('express')
var jwt = require('jsonwebtoken')
const { hasValidAuthJWT } = require('../middlewares/authentication')
const { registrarUsuario, loginUsuario, updateUserWithAvatar } = require('../controllers/auth')
const uploadFile = require('../middlewares/uploadFile')

const router = express.Router()

router.get('/authenticated', hasValidAuthJWT, (req, res)=>{
    res.status(200).json({data: 'Autenticado correctamente!'})
})
router.post('/register', registrarUsuario)
router.post('/login', loginUsuario)
router.post('/avatar', hasValidAuthJWT, uploadFile.single('avatar'), updateUserWithAvatar)

module.exports = router