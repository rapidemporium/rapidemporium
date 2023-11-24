var express = require('express');
var router = express.Router();
const axios = require('axios');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const http = require('http');
const fs = require('fs');
const mobileLegends = require('../API/mobile-legends.json');
const Razorpay = require("razorpay");
 
const partnerId = process.env.YOUR_PARTNER_ID;
const secretKey = process.env.YOUR_SECRET_KEY;


//PAYMENT GATEWAY
var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

router.post("/payment", async (req, res, next) => {
  // let {amount} = req.body;
try{
  
  var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
 
  var order = await instance.orders.create({
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  });

res.status(201).json({
  success: true,
  order,
});

}catch(err){
console.log(err);
console.log("We are facing some problem, please try again after some time!")
}

});

router.post('/pay-verify', async (req,res, next) => {

  var expectedSignature = crypto.createHmac('sha256', 'NbuBBPdNMiBejAITkjNeVHds')
  .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
  .digest('hex');
  console.log("sig"+req.body.razorpay_signature);
  console.log("sig"+expectedSignature);

if(expectedSignature === req.body.razorpay_signature){
console.log("Payment Success");
//sending product details to its owner
}else{
console.log("Payment Fail");
res.redirect("/");
}
 
})



//other page routes --->
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});


router.get('/mlbb-moogold', function(req, res, next){
  fs.readFile('API/mobile-legends.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading the file');
      return;
    }
    const mobileLegendData = JSON.parse(data);
    let mobileLegendList = [];
    mobileLegendList = mobileLegendData.Variation;
    
    // Render the 'index' view and pass 'mobileLegendData' data to it
    res.render('index', { mobileLegendList });
  });
});


//creating order
router.get('/proceed/:userid/:serverid/:itemid', function(req, res, next){
  //Obtain Product ID from Product Detail API
  const userid = req.params.userid;
  const serverid = req.params.serverid;
  const itemid = req.params.itemid;
	
  console.log("user: ", userid);
  console.log("server: ", serverid);
  console.log("item: ", itemid)
	
const payload = {
  path: "order/create_order",
  data: {
        category: "1",
        "product-id": "4700134",
        quantity: "1",
        "Player ID": "830847469",
	"Server ID": "12302",
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
  res.redirect(`/pay-status/${userid}`);
})
.catch(error => {
  console.error(error);
  console.log("We are Facing Some issue");
});

})


//listing products
router.get('/products', async (req, res) => {
  try {
  
    const category_id = 50; // Replace with the desired category ID
    const productList = {
      path: "product/list_product",
      category_id: category_id
    };
    
// Make a request to the MooGold API with Basic Authentication
const timestamp = Math.floor(Date.now() / 1000);
const path = "product/list_product";
const STRING_TO_SIGN = JSON.stringify(productList) + timestamp + path;
const auth = CryptoJS.HmacSHA256(STRING_TO_SIGN, secretKey).toString();
const auth_basic = Buffer.from(`${partnerId}:${secretKey}`).toString('base64');

const response = await axios.post("https://moogold.com/wp-json/v1/api/product/list_product", productList, {
  headers: {
      timestamp,
      auth,
      Authorization: `Basic ${auth_basic}`,
      'Content-Type': 'application/json'
  }
})
console.log(response.data);
res.status(200).json(response.data);

  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//product details

router.get('/products/details', async (req, res) => {
  try {
    
    const product_id = 15145; // Replace with the desired category ID
    const productList = {
      path: "product/product_detail",
      product_id: product_id
    };
    
// Make a request to the MooGold API with Basic Authentication
const timestamp = Math.floor(Date.now() / 1000);
const path = "product/product_detail";
const STRING_TO_SIGN = JSON.stringify(productList) + timestamp + path;
const auth = CryptoJS.HmacSHA256(STRING_TO_SIGN, secretKey).toString();
const auth_basic = Buffer.from(`${partnerId}:${secretKey}`).toString('base64');

const response = await axios.post("https://moogold.com/wp-json/v1/api/product/product_detail", productList, {
  headers: {
      timestamp,
      auth,
      Authorization: `Basic ${auth_basic}`,
      'Content-Type': 'application/json'
  }
})
console.log(response.data);
res.status(200).json(response.data);
mlbbData = response.data;

  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.post('/player-varification', async function(req, res, next){

// const userid = req.body.userid;
// const serverid = req.body.serverid;

// const options = {
//   method: 'GET',
//   url: `https://id-game-checker.p.rapidapi.com/mobile-legends/${userid}/${serverid}`,
//   headers: {
//     'X-RapidAPI-Key': '30e2096546msh25496d9f35b184fp15ed6cjsnc60b405c5d89',
//     'X-RapidAPI-Host': 'id-game-checker.p.rapidapi.com'
//   }
// };

// try {
// 	const response = await axios.request(options);
//   const playerInfo = response.data;
	
//   res.json(playerInfo);
  
// } catch (error){
// 	console.error(error);
//   console.log("Try After 1 Min");
// }
// })
 

router.get('/pay-status/:orderid', function(req, res){
  res.render('paywindow');
})


module.exports = router;
