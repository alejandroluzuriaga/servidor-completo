const { User } = require("../models/models.js");
const mongoose = require("mongoose")

const getTodosLosUsers = async (req, res) => {
  try {
    const users = await User.find().lean();

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No hay usuarios en la BD" });
    }

    const usersNoPassword = users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });

    res.status(200).json({ data: usersNoPassword });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const getUserPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();
    
    if (!user) {
      return res.status(404).json({ error: "No existe este usuario en la BD" });
    }

    const { password, ...userData } = user;

    res.status(200).json({ data: userData });
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const getUserPorEmail = async (email) => {
  try {
    const user = await User.findOne({email}).lean();
    return user
  } catch (err) {
    console.log("Error buscando a usuario por email")
  }
};

const crearUser = async (req, res, payload) => {
  try {
    const { email, hash } = payload;
    if (!email || !hash) {
      return res.status(500).json({ data: "Es necesario usar un email y una contraseña (mínimo 6 caracteres y una mayúscula y una minúscula)" });
    }

    const existe = await User.findOne({ email }).lean();
    if (existe) {
      return { user: null, error: "Usuario ya existente en la base de datos. Inicia sesión para autenticarte" };
    } else {
      const user = new User({
        email,
        password: hash
      });
      await user.save();
      return { user, error: null };
    }

  } catch (err) {
    console.log("API error:", err);
    return { user: null, error: "Unexpected server error" };
  }
};

const eliminarUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Este usuario no está en la base de datos" });
    } else {
      await User.deleteOne({ _id: id });
      return res.status(200).json({ data: `Usuario borrado: ${user.get("email")}` });
    }
  } catch (err) {
    console.log("API error:", err);
    res.status(500).json({ data: "Unexpected server error" });
  }
};

const updateAvatar = async (id, path) =>{
  await User.updateOne({_id: id}, {avatar: path})
}

module.exports = {
  getTodosLosUsers,
  getUserPorID,
  crearUser,
  eliminarUser,
  getUserPorEmail,
  updateAvatar
};
