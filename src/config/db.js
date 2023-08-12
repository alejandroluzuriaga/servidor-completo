const mongoose = require("mongoose");

mongoose.set("strict", false);
mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a la base de datos!");
  })
  .catch((err) => {
    console.log("Error conectando a la base de datos", err);
    process.exit(1);
  });