const mongoose = require("mongoose");

const CardSchema = mongoose.Schema(
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
  },
  /*timestamps sustituye default:Date.now() ya que crea un objeto con un id donde se almacenara la
  fecha */
  { timestamps: true }
);
module.exports = mongoose.model("Card", CardSchema);
