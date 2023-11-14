var express = require('express');
var router = express.Router();
const axios = require('axios');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const http = require('http');

 
const partnerId = process.env.YOUR_PARTNER_ID;
const secretKey = process.env.YOUR_SECRET_KEY;

//other page routes --->
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/mlbb-moogold', function(req, res, next){
  res.render('index');
})


//creating order
router.post('/proceed', function(req, res, next){
  //Obtain Product ID from Product Detail API
const payload = {
  path: "order/create_order",
  data: {
      category: "1",
      "product-id": "1874705",
      quantity: "1",
      "Player ID": "12314123",
      Server: "Asia Pacific - Eden"
  }
};

const timestamp = Math.floor(Date.now() / 1000);
const path = "order/create_order";

const STRING_TO_SIGN = JSON.stringify(payload) + timestamp + path;
const auth = CryptoJS.HmacSHA256(STRING_TO_SIGN, secretKey).toString();
const auth_basic = Buffer.from(`${partnerId}:${secretKey}`).toString('base64');

axios.post("https://moogold.com/wp-json/v1/api/order/create_order", payload, {
  headers: {
      timestamp,
      auth,
      Authorization: `Basic ${auth_basic}`,
      'Content-Type': 'routerlication/json'
  }
})
.then(response => {
  console.log(response.data);
  console.log("proceed run !");
})
.catch(error => {
  console.error(error);
  console.log("We are Facing Some issue");
});

})



module.exports = router;