// Product .JSON template for adding products to the db
// Basic schema with some rudementry error checking
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const saleReportSchema = new Schema({
    productName: {type: String, required: true},
    amount: {type: Number, required: true},
    soldMethod: {type: String, required: true},
    soldBy: {type: String, required: true}
}, {
    timestamps: true,
  });

const SaleReport = mongoose.model('SaleReport', saleReportSchema);

module.exports = SaleReport;