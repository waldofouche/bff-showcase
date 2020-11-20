 // Product .JSON template for adding products to the db
// Basic schema with some rudementry error checking
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderID: {type: String, required: true},
    orderProductName: {type: String, required: true},
    orderQuantity: {type: String, required: true, unique: true},
    productID: {type: String,required: true },
    productVariationID: {type: String, required: true},
    orderPrice: {type: Number, required: true},
    productVariationID: {type: Number, required: true},
    orderStatus: {type: Number, required: true},
    productSize: {type: Number, required: true},
    orderDateCreated: {type: Number, required: true},
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

// Export Module
module.exports = Order;