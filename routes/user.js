const express = require("express");
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const router = express.Router();

//Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  /*ya que en verifyToken solicitamos un user y dentro del token viene el id,
    req.params es lo que viene en la url y en este caso es el :id,
    el if de abajo es por si el usuario quiere cambiar su contraseña */
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.ENCRYPT_PASS
    ).toString();
  }
  try {
    /*va a buscar y actualizar pero para encontrarlo lo va a buscar el los paramas(url) el id,
      y despues lo que va a actualizar */
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json("Error update user");
  }
});

//Delete user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    res.status(400).json("Error deleted user");
  }
});

//Get one user, solo el admin podra ver a todos los usuarios
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(400).json("Error getting user");
  }
});

//Get all user, solo el admin podra ver a todos los usuarios
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  /*vamos a poner algo en la busqueda en el query --> ? despues del ? es un query
  y es new por que asi se llama asi lo vamos a poner en la url new,  /api/users?new=true */
  const query = req.query.new;
  try {
    /*si hay un query en la url devolvera 5 usuarios .limit(5)  
    .sort({ _id: -1 }) devolvera los ultimos usuarios registrados*/
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json("Error getting users");
  }
});

//Get user stats, crear estadisticas de cuando se registraron los usuarios
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    /*vamos a agrupar los datos para eso usamos,
    $macth la coincidencia, de cuando fue que se creo el usuario con respecto del año pasado,
    despues vamos a tomar los numeros de los meses,
     usamos $project, creamos una variable $month que tome el mes de cuando fue creado el usuario en
     $createdAd que esta en la db*/
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      /*creamos un grupo con los datos, primero vamos a agregar el mes en el cual fue creado, y le vamos
      a sumar 1 */
      {
        $group: {
          _id: " $month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
