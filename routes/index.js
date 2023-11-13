var express = require('express');
var router = express.Router();
const axios = require('axios');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const http = require('http');

const partnerId = process.env.YOUR_PARTNER_ID;
const secretKey = process.env.YOUR_SECRET_KEY;

//setting up users Auth
const { findOne } = require('./users');

/* LOCAL PASSPORT STRATEGY */

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('userAuth');
});

router.get('/mlbb-moogold', function(req, res, next){
  res.render('index');
})

router.get('/home', async function(req, res, next){
  let user = await userModel.findOne({email: req.session.passport.user});
  res.render('home', {user});
})

router.get('/test', function(req, res, next){
  res.render('test');
})


// router.use("/payment", async (req, res, next) => {

// try{
  
//   var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
 
//   var order = await instance.orders.create({
//     amount: req.body.amount,  // amount in the smallest currency unit
//     currency: "INR",
//     receipt: "order_rcptid_11", 
//   });

// res.status(201).json({
//   success: true,
//   order,
// });

// }catch(err){
//   next(err);
// }

// });



// router.post('/pay-verify', async (req,res, next) => {

//   var expectedSignature = crypto.createHmac('sha256', 'NbuBBPdNMiBejAITkjNeVHds')
//                                   .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
//                                   .digest('hex');
//                                   console.log("sig"+req.body.razorpay_signature);
//                                   console.log("sig"+expectedSignature);
 
//   if(expectedSignature === req.body.razorpay_signature){
//     console.log("Payment Success");
//     //sending product details to its owner
//   }else{
//     console.log("Payment Fail");
//     res.redirect("/home");
//   }
 
// })


//listing products


 
module.exports = router;
