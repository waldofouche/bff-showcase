const router = require('express').Router();
const SaleReport = require('../models/saleReport.model');

 /* GET Sales Reports. */
 router.route('/list').get((req,res) => {
     SaleReport.find()
     SaleReport.find()
      .then(saleReport => res.json(saleReport))
      .catch(err=> res.status(400).json('Error: '+ err));
 });

 /* ADD new Sale Report */
 router.route('/add').post((req,res) =>{
     const productName = req.body.productName;
     const amount = Number(req.body.amount);
     const soldMethod = req.body.soldMethod;
     const soldBy = req.body.soldBy;

     const newSaleReport = new SaleReport({
         productName,
         amount,
         soldMethod,
         soldBy
     });
     // Save Report to db
     newSaleReport.save()
      .then(() => res.json('Sale Report added!'))
      .catch(err => res.status(400).json('Error: ' + err));
 });

 router.route("/:id").delete((req,res)=> {
     SaleReport.findByIdAndDelete(req.params.id)
      .then(() => res.json('Report Deleted.'))
      .catch(err=> res.status(400).json('Error: ' + err));
 });

 // Export Module
module.exports = router;