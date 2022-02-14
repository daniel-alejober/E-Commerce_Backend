const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  /*timestamps sustituye default:Date.now() ya que crea un objeto con un id donde se almacenara la
  fecha */
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
