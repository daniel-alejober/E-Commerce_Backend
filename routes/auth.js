const express = require("express");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

//Registrar
router.post("/register", async (req, res) => {
  //podemos agregar validaciones antes
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    //encriptar la contraseña
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.ENCRYPT_PASS
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    /*Va a buscar a el usuario por el username y si lo encuentra traera toda su informacion
    y se guarda en usar */
    const user = await User.findOne({ username: req.body.username });
    //si no hay usuario
    if (!user) {
      res.status(401).json({ msg: "Wrong Credentials! (User)" });
      return;
    }

    //descencryptar la contraseña
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.ENCRYPT_PASS
    );
    /*la convertimos a string toString(), 
    CryptoJS.enc.Utf8 sirve para caracteres especiales*/
    const deshashPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (deshashPassword !== req.body.password) {
      res.status(401).json({ msg: "Wrong Credentials! (Password)" });
      return;
    }

    /*Creamos el jwt */
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /*enviar todos los datos menos la contraseña, destructuramos el password y lo demas,
    y en la respuesta solo enviamos lo demas, pero ya que tomamos todo mongo
    regresa varios objetos, y la informacion del usuario se encuentra en _doc,
    tomamos una copia de other y se la agregamos al accesstoken*/
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json("Error user doesn't exist");
  }
});

module.exports = router;
