const express = require("express");
const Order = require("../models/Order");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
const router = express.Router();

//Create order-pedido
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(400).json("Error created Order");
  }
});

//Update order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  /*ya que en verifyToken solicitamos un user y dentro del token viene el id,
    req.params es lo que viene en la url y en este caso es el :id,
    el if de abajo es por si el usuario quiere cambiar su contraseña */
  try {
    /*va a buscar y actualizar pero para encontrarlo lo va a buscar el los paramas(url) el id,
      y despues lo que va a actualizar */
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).json("Error update Order");
  }
});

//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (error) {
    res.status(400).json("Error deleted Order");
  }
});

/*Get user order, ver la orden de compra puede tener mas de un pedido
, aqui el parametro cambia al id del usuario*/
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json("Error getting orders");
  }
});

//Get all cart only admin
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json("Error getting orders");
  }
});

// Get monthly income -- estadisticas por mes de los productos
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  /*tomaremos el ultimo mes y el mes anterior dependiendo del ultimo mes*/
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  /*
   *Vamos a tomar el id del producto que viene por query "?",
   *---n.e.e.-- */
  const productId = req.query.pid;
  try {
    /*vamos a agrupar los datos para eso usamos,
    $macth la coincidencia, de cuando fue que se crado respecto del mes pasado,
    despues vamos a tomar los numeros de los meses,
     usamos $project, creamos una variable $month que tome el mes de cuando fue creado el usuario en
     $createdAd que esta en la db, y las ventas que se han hecho en ese mes $amount esta
     definida en eL MODELO*/
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      /*creamos un grupo con los datos, primero vamos a agregar el mes en el cual fue creado, y le vamos
      a sumar todas las ventas */
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
