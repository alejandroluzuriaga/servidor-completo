const bcrypt = require("bcrypt")

const saltRounds = 10

const hashPassword = async (password) =>{
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

const verifyPassword = async (password, hash) =>{
    const isValid = await bcrypt.compare(password, hash);
    return isValid
}

const passwordRequirementsOK = (value)=> {
    return /^(?=.*?[a-z])(?=.*?[A-Z]).{6,}$/.test(value);
}

module.exports = {
    hashPassword,
    verifyPassword,
    passwordRequirementsOK
}