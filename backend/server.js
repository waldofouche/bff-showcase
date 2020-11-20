const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();
// Set up Express
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Set up mongoose 
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true }
);


const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
}) 
// add routes here
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const saleReportRouter = require('./routes/saleReport');
const woocommerceRouter = require('./routes/wooCommerce');
const ordersRouter = require('./routes/orders');

// Add app.use corresponding to routes
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/saleReports', saleReportRouter);
app.use('/wooCommerce', woocommerceRouter);
app.use('/orders', ordersRouter)


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

