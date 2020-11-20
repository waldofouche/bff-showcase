const { json, response } = require('express');

const router = require('express').Router();
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: "https://www.bffclothing.org/",
  consumerKey: "ck_d4bc40bb6a128e06757682352c3d136a3a4865a4",
  consumerSecret: "cs_902488a8b4fbcf1d3a91a8f99d31820e282ad1c7",
  version: "wc/v3"
});
// var tempData

// router.get( '/getProducts', ( req, response ) => {
//   api.get('products', function(err, data, res) {
//     response.json( JSON.parse(res.data) );
// })});
router.route("/products").get((req, res) => {
    
    api.get("products", {
        per_page: 20, // 20 products per page
      })
        .then((response) => {
          // Successful request
          res.send(response.data);

        })
        .catch((error) => {
          // Invalid request, for 4xx and 5xx statuses
          console.log("Response Status:", error.response.status);
          console.log("Response Headers:", error.response.headers);
          console.log("Response Data:", error.response.data);

          
        })
        .finally(() => {
          // Always executed.
          // response.json(JSON.parse(response.data));
        });
});

router.route("/orders").get((req, res) => {

  api.get("orders", {
    per_page: 20
  })
  .then((response) => {
    res.send(response.data);
  })
  .catch((error) => {
    console.log("Response Status: ", error.response.status)
    console.log("Response Headers: ", error.response.headers)
    console.log("Response Data: ", error.response.data)

  })
  .finally(() => {

  });
})



module.exports = router;