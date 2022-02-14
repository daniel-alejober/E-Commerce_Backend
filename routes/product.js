const express = require("express");
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const router = express.Router();

//Create product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(400).json("Error created product");
  }
});

//Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  /*ya que en verifyToken solicitamos un user y dentro del token viene el id,
    req.params es lo que viene en la url y en este caso es el :id,
    el if de abajo es por si el usuario quiere cambiar su contraseña */
  try {
    /*va a buscar y actualizar pero para encontrarlo lo va a buscar el los paramas(url) el id,
      y despues lo que va a actualizar */
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(500).json("Error update product");
  }
});

//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (error) {
    res.status(400).json("Error deleted product");
  }
});

//Get one product, regresa el producto por el id
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json("Error getting product");
  }
});

//Get all products or some products
router.get("/", async (req, res) => {
  /*vamos a poner algo en la busqueda en el query --> ? despues del ? es un query
  y es new por que asi se llama asi lo vamos a poner en la url new */
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    /*si hay un queryNew en la url /api/products?new=true
    .sort({ createdAt: -1 }) devolvera los ultimos productos agregados
     devolvera 5 productos .limit(5) */
    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (queryCategory) {
      /*si hay un queryCategory /api/products?category=women
    encontrara todos los productos por categories(asi los llamammos en el modelo)
     $in :[queryCategory] es como vamos a encontrar esa cateria en el array*/
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      /*si no hay query *seran todos los productos de la db*/
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json("Error getting products");
  }
});

module.exports = router;
