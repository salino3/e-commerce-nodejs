// npm init -y
// npm install express mongoose dotenv nodemon
// npm install crypto-js
// npm install jsonwebtoken

const express = require("express");
const app = express();
const mongoose = require("./db");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const productRouter = require("./routes/products");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);

app.listen(process.env.PORT || 5200, () => {
  console.log("Backend server is running on port " + process.env.PORT);
});
