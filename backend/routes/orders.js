const router = require('express').Router();
let Order = require('../models/order.model');

  /* GET Products page. */
router.route('/').get((req, res) => {
    Order.find()
      .then(orders => res.json(orders))
      .catch(err => res.status(400).json('Error: ' + err));
  });

  /* GET Product */
router.route('/get/:id').get((req,res) => {
    Order.findById(req.params.id)
     .then(order => res.json(order))
     .catch(err => res.status(400).json('Error: ' + err));
});

  /* ADD new Product */
router.route('/add').post((req, res) => {
    const orderID = req.body.OrderId;
    const orderProductName = req.body.productName;
    const orderQuantity =req.body.orderQuantity;
    const productID = req.body.productID;
    const orderPrice = Number(req.body.OrderPrice);
    const productVariationID = Number(req.body.variationID);
    const orderStatus = Number(req.body.status);
    const productSize = Number(req.body.size);
    const orderDateCreated = Number(req.body.dateCreated);

    const newOrder = new Order({
      orderID,
      orderProductName,
      orderQuantity,
      productID,
      orderPrice,
      productVariationID,
      orderStatus,
      productSize,
      orderDateCreated,
    });

    newOrder.save()
    .then(() => res.json('Order added!'))
    .catch(err => res.status(400).json('Error: ' + err));
  });
    
  /* DELETE Product */
router.route('/:id').delete((req, res) => {
    Order.findByIdAndDelete(req.params.id)
      .then(() => res.json('Order deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });

  /* UPDATE Product */
router.route('/update/:id').post((req, res) => {
    Order.findByIdAndUpdate(req.params.id)
      .then(order => {
        order.orderID = req.body.id;
        order.orderProductName = req.body.productName;
        order.orderQuantity =req.body.orderQuantity;
        order.productID = req.body.prodctID;
        order.orderPrice = Number(req.body.price);
        order.productVariationID = Number(req.body.variationID);
        order.orderStatus = Number(req.body.status);
        order.productSize = Number(req.body.size);
        order.orderDateCreated = Number(req.body.dateCreated);
        
        order.save()
          .then(() => res.json('Product updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });
  
// Export Module
module.exports = router;