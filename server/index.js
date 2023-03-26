const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app= express();
app.use(express.json());

//connection
//"mongodb://localhost:27017/E-Commerce-Website"
// "mongodb+srv://user:Aqib@cluster0.dibbmbn.mongodb.net/Shop?retryWrites=true&w=majority"

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(process.env.PORT , () => console.log(`Listening at ${process.env.PORT}`)))
  .catch((error) => console.log(error));

//Routes
const userRoute = require('./Routes/user')
const authRoute = require('./Routes/auth');
const productRoute = require('./Routes/project');
const cartRoute = require('./Routes/cart');
const orderRoute = require('./Routes/order');
const stripeRoute = require("./routes/stripe");

app.use(cors());
app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/products',productRoute);
app.use('./api/carts',cartRoute);
app.use('/api/orders',orderRoute); 
app.use("/api/checkout", stripeRoute);