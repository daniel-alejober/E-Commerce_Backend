const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      require: true,
    },
    address: {
      type: Object,
      require: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  /*timestamps sustituye default:Date.now() ya que crea un objeto con un id donde se almacenara la
  fecha */
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);
