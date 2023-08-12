const { hashPassword, verifyPassword, passwordRequirementsOK } = require("../../config/password.js");
const { crearUser, getUserPorEmail, updateAvatar } = require("./users.js");
const { signToken } = require("../../config/jwt.js");

const registrarUsuario = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!passwordRequirementsOK(password)){
        return res.status(400).json({ data: "La contraseña debe tener al menos 6 caracteres, una mayúscula y una minúscula." });
      }
      const hash = await hashPassword(password);
      const result = await crearUser(req, res, { email, hash });
  
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
  
      const newUser = result.user;
      return res.status(201).json({ createdUser: { email: newUser.email, id: newUser._id } });
    } catch (error) {
      return res.status(400).json({ data: "Error registrando usuario" });
    }
  };

const loginUsuario = async (req, res)=>{
    const {email, password} = req.body
    
    const user = await getUserPorEmail(email)

    if (!user){
        return res.status(404).json({data: 'El usuario no existe'})
    }
    const isValidPassword = await verifyPassword(password, user?.password || '')

    if (!isValidPassword){
        return res.status(401).json({data: 'Email o contraseña incorrectos'})
    }
    const {password: nouse, ...rest} = user
    const token = signToken({id: user._id})
    res.status(200).json({data: {
        token,
        usuario: rest
    }})
}

const updateUserWithAvatar = async (req, res, next)=>{
  const {path} = req.file
  const {id} = req.user
  await updateAvatar(id, path)
  res.status(201).json({data: {
      mensaje:'Archivo subido a la carpeta "avatar"',
      ruta: path
  }})
}

module.exports = {
  registrarUsuario,
  loginUsuario,
  updateUserWithAvatar
};
