// Product .JSON template for adding products to the db
// Basic schema with some rudementry error checking
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    invProductName: {type: String, required: true},
    invSKU: {type: String, required: true, unique: true, trim: true, minlength: 3 },
    invSupplier: {type: String,required: true },
    invPrice: {type: Number, required: true},
    invCurrentStock: {type: Number, required: true},
    invOnOrder: {type: Number, required: true},
    invRoyalty: {type: Number, required: true},
    invWooID: {type: Number, required: true},
    invSalePrice: {type: Number, required: true},
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

// Export Module
module.exports = Product;