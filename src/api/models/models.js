const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema({
    titulo: String,
    anio_publicacion: Number,
    genero: String,
    nombreAutor: String,
    autor: mongoose.Schema.Types.ObjectId
});

const autorSchema = new mongoose.Schema({
    nombre: String,
    librosEscritos: [mongoose.Schema.Types.ObjectId]
});

const userSchema = new mongoose.Schema(
    {
      email: { type: String, unique: true, required: true, trim: true },
      password: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function (value) {
            return /^(?=.*?[a-z])(?=.*?[A-Z]).{6,}$/.test(value);
          },
          message:
            'La contraseña debe tener al menos 6 caracteres, al menos una mayúscula y una minúscula.'
        }
      },
      avatar: { type: String, required: false, trim: true }
    },
    {
      collection: 'users'
    }
  );
  

const Libro = mongoose.model("Libro", libroSchema);
const Autor = mongoose.model("Autor", autorSchema);
const User = mongoose.model("User", userSchema)

module.exports = {
    Libro,
    Autor,
    User
};
