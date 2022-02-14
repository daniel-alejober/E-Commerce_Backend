const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

/*STRIPE ES UN LIBRERIA PARA PODER HACER METODOS DE PAGO*/
router.post("/payment", (req, res) => {
  /*vamos a decirle que stripe.cargos.crear con un objeto que contendra
    fuente quien lo compra(token), cantidad y en dolares */
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    /*creamos una respues de exito y fracaso */
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
