const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const stripe = require("./routes/stripe");

const PORT = process.env.PORT || 4000;
const app = express();
conectarDB();

app.use(cors());
app.use(express.json({ extended: true }));

app.use("/api/users", authRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", stripe);

app.listen(PORT, () => {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});
