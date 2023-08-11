var jwt = require("jsonwebtoken")
const SECRET_TOKEN = 'Clavinova99?!'

const signToken = (payload) =>{
    const token = jwt.sign(payload, SECRET_TOKEN, { expiresIn: '1h' })
    return token
}

const verifyToken = (token) =>{
    const payload = jwt.verify(token, SECRET_TOKEN)
    return payload
}

module.exports = {
    signToken,
    verifyToken
}