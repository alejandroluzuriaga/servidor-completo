const { verifyToken } = require('../../config/jwt');

const hasValidAuthJWT = (req, res, next) =>{
    try {
        const [, token] = req.headers.authorization.split(' ')
        const payload = verifyToken(token)
        req.user = payload
        next();
    } catch (error) {
        res.status(401).json({data: 'No tienes permisos para realizar esta operación'})
    }
} 

module.exports = {
    hasValidAuthJWT
}