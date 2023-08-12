require("dotenv").config()
require("./config/db");
const express = require("express");
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const mainRouter = require("./api/routes/mainRouter.js")

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true)
    }
  })
)

//Limita a 50 peticiones cada 3 minutos
const limiter = rateLimit({ 
  windowMs: 3 * 60 * 1000, //3 minutos
  max: 50, //50 peticiones
  standardHeaders: false,
  legacyHeaders: false, 
})

app.use(limiter)

app.use(express.json());

app.use("/", mainRouter);

app.use('*', (req, res, next) => {
  res.status(404).json({ data: 'Página no encontrada' })
})

app.use((error, req, res, next) => {
  res.status(500).json({ data: 'Error interno del servidor' })
})

const PORT = 4001;
app.listen(PORT, () => {
  console.log(
    `Servidor escuchando en el puerto ${PORT}: http://localhost:${PORT}`
  );
});
