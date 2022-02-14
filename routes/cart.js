const express = require("express");
const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const router = express.Router();

//Create
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(400).json("Error created cart");
  }
});

//Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  /*ya que en verifyToken solicitamos un user y dentro del token viene el id,
    req.params es lo que viene en la url y en este caso es el :id,
    el if de abajo es por si el usuario quiere cambiar su contraseña */
  try {
    /*va a buscar y actualizar pero para encontrarlo lo va a buscar el los paramas(url) el id,
      y despues lo que va a actualizar */
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (error) {
    res.status(500).json("Error update cart");
  }
});

//Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (error) {
    res.status(400).json("Error deleted cart");
  }
});

//Get user cart, ver el carrito de compra, aqui el parametro cambia al id del usuario
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json("Error getting cart");
  }
});

//Get all cart only admin
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json("Error getting cart");
  }
});

module.exports = router;
