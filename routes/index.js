var express = require("express");
var router = express.Router();
const axios = require("axios");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const http = require("http");
var bodyParser = require("body-parser");
const fs = require("fs");
const mobileLegends = require("../API/mobile-legends.json");
const Razorpay = require("razorpay");
const {
  sendMessage,
  getTextMessageInput,
} = require("../public/javascripts/messageapi");
router.use(bodyParser.json());
const sendMail = require("../routes/mail");

const partnerId = process.env.YOUR_PARTNER_ID;
const secretKey = process.env.YOUR_SECRET_KEY;

//PAYMENT GATEWAY
var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

router.post("/payment", async (req, res, next) => {
  // let {amount} = req.body;
  try {
    var instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    var order = await instance.orders.create({
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(
      "We are facing some problem, please try again after some time!"
    );
  }
});

router.post("/pay-verify", async (req, res, next) => {
  var expectedSignature = crypto
    .createHmac("sha256", "NbuBBPdNMiBejAITkjNeVHds")
    .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
    .digest("hex");
  console.log("sig" + req.body.razorpay_signature);
  console.log("sig" + expectedSignature);

  if (expectedSignature === req.body.razorpay_signature) {
    console.log("Payment Success");
    //sending product details to its owner
  } else {
    console.log("Payment Fail");
    res.redirect("/");
  }
});

//other page routes --->
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home");
});

router.get("/mlbb-alpha", function (req, res, next) {
  fs.readFile("API/mobile-legends.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading the file");
      return;
    }
    const mobileLegendData = JSON.parse(data);
    let mobileLegendList = [];
    mobileLegendList = mobileLegendData.Variation;
    // Render the 'index' view and pass 'mobileLegendData' data to it
    res.render("mlbbAlpha", { mobileLegendList });
  });
});

//creating order
router.get(
  "/proceed/:userid/:serverid/:itemid/:quantity/:price/:itemname/:email/:paymentid",
  function (req, res, next) {
    //Obtain Product ID from Product Detail API
    const userid = req.params.userid;
    const serverid = req.params.serverid;
    const itemid = req.params.itemid;
    const quantity = req.params.quantity;
    const price = req.params.price;
    const itemname = req.params.itemname;
    const emailInput = req.params.email;
    const paymentid = req.params.paymentid;

    const payload = {
      path: "order/create_order",
      data: {
        category: "1",
        "product-id": itemid,
        quantity: quantity,
        "User ID": userid,
        "Server ID": serverid,
      },
    };

    const timestamp = Math.floor(Date.now() / 1000);
    const path = "order/create_order";

    const STRING_TO_SIGN = JSON.stringify(payload) + timestamp + path;
    const auth = CryptoJS.HmacSHA256(STRING_TO_SIGN, secretKey).toString();
    const auth_basic = Buffer.from(`${partnerId}:${secretKey}`).toString(
      "base64"
    );

    axios
      .post("https://moogold.com/wp-json/v1/api/order/create_order", payload, {
        headers: {
          timestamp,
          auth,
          Authorization: `Basic ${auth_basic}`,
          "Content-Type": "routerlication/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log("proceed run !");
        res.redirect(
          `http://localhost:3000/confirmation/${emailInput}/${userid}/${serverid}/${quantity}/${itemname}/${price}/${paymentid}`
        );
      })
      .catch((error) => {
        console.error(error);
        console.log("Server under maintenance: please try again after sometime.");
      });
  }
);

//listing products
router.get("/products", async (req, res) => {
  try {
    const category_id = 50; // Replace with the desired category ID
    const productList = {
      path: "product/list_product",
      category_id: category_id,
    };

    // Make a request to the MooGold API with Basic Authentication
    const timestamp = Math.floor(Date.now() / 1000);
    const path = "product/list_product";
    const STRING_TO_SIGN = JSON.stringify(productList) + timestamp + path;
    const auth = CryptoJS.HmacSHA256(STRING_TO_SIGN, secretKey).toString();
    const auth_basic = Buffer.from(`${partnerId}:${secretKey}`).toString(
      "base64"
    );

    const response = await axios.post(
      "https://moogold.com/wp-json/v1/api/product/list_product",
      productList,
      {
        headers: {
          timestamp,
          auth,
          Authorization: `Basic ${auth_basic}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//product details

router.get("/products/details", async (req, res) => {
  try {
    const product_id = 15145; // Replace with the desired category ID
    const productList = {
      path: "product/product_detail",
      product_id: product_id,
    };

    // Make a request to the MooGold API with Basic Authentication
    const timestamp = Math.floor(Date.now() / 1000);
    const path = "product/product_detail";
    const STRING_TO_SIGN = JSON.stringify(productList) + timestamp + path;
    const auth = CryptoJS.HmacSHA256(STRING_TO_SIGN, secretKey).toString();
    const auth_basic = Buffer.from(`${partnerId}:${secretKey}`).toString(
      "base64"
    );

    const response = await axios.post(
      "https://moogold.com/wp-json/v1/api/product/product_detail",
      productList,
      {
        headers: {
          timestamp,
          auth,
          Authorization: `Basic ${auth_basic}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    res.status(200).json(response.data);
    mlbbData = response.data.variation_price;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/pay-status/:orderid", function (req, res) {
  res.render("orderconfirm");
});

router.get("/mlbb-beta", function (req, res) {
  fs.readFile("API/mobile-legends.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading the file");
      return;
    }
    const mobileLegendData = JSON.parse(data);
    let mobileLegendList = [];
    mobileLegendList = mobileLegendData.Variation;
    // Render the 'index' view and pass 'mobileLegendData' data to it
    res.render("mlbbBeta", { mobileLegendList });
  });
});

router.get(
  "/send/:playerid/:serverid/:itemid/:itemname/:price/:orderid/:dateformat/:time/:quantity/:email",
  function (req, res, next) {
    const {
      playerid,
      serverid,
      itemid,
      itemname,
      price,
      orderid,
      dateformat,
      time,
      quantity,
      email,
    } = req.params;

    var data = getTextMessageInput(
      process.env.RECIPIENT_WAID,
      playerid,
      serverid,
      itemid,
      itemname,
      price,
      orderid,
      dateformat,
      time,
      quantity
    );

    sendMessage(data)
      .then(function (response) {
        res.redirect(
          `http://localhost:3000/proceed/${playerid}/${serverid}/${itemid}/${quantity}/${price}/${itemname}/${email}/${orderid}`
        );
        console.log("Message sent!");
        return;
      })
      .catch(function (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      });
  }
);

router.get("/about", function (req, res, next) {
  res.render("about");
});

router.get("/page", function (req, res) {
  res.render("mlbbAlpha");
});

// router.get("/test", function(req,res){
//   res.render("orderconfirm");
// })

router.get(
  "/confirmation/:mail/:userid/:serverid/:quantity/:itemname/:price/:orderid",
  async function (req, res) {
    const email = req.params.mail;
    const userid = req.params.userid;
    const serverid = req.params.serverid;
    const quantity = req.params.quantity;
    const itemname = req.params.itemname;
    const price = req.params.price;
    const orderid = req.params.orderid;

    await sendMail(email, userid, serverid, quantity, itemname, price, orderid);
    res.redirect(`/pay-status/${userid}`);
  }
);

module.exports = router;
