var userIdInput = document.getElementById("exampleInputEmail1");
var serverIdInput = document.getElementById("exampleInputPassword1");
var itemList = document.querySelectorAll(".item-card");
var buyButton = document.getElementById("rzp-button2");
var quantityCounter = document.getElementById("quantityCounter");
var whatsappBtn = document.getElementById("whatsappBtn");
var preventTouching = document.getElementById("preventTouching");
var orderConfBtn = document.getElementById("orderConfBtn");
var warn = document.getElementById("warn");
var rs = document.querySelector(".rs");
var inputEmail = document.getElementById("inputEmail");

//date formating
let dd = new Date().getDate();
let mm = new Date().getMonth();
let yyyy = new Date().getFullYear();
let dateFormat = `${dd}-${mm}-${yyyy}`;

//time formating
// Get the current date and time
let currentTime = new Date();
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let meridiem = hours >= 12 ? "PM" : "AM";
hours = hours % 12;
hours = hours ? hours : 12;
minutes = minutes < 10 ? "0" + minutes : minutes;
let formattedTime = hours + ":" + minutes + " " + meridiem;
console.log(formattedTime);

var userid = "";
var serverid = "";
var itemid = "";
var itemname = "";
var price = "";
var productQuantity = "";
var emailInput = null;
var order_id = null;


buyButton.addEventListener("click", function () {

  if(serverIdInput.value.length !== 0 && userIdInput.value.length !== 0 && rs.innerHTML !== "0" && inputEmail.value.length !== 0){
    userid = userIdInput.value;
    serverid = serverIdInput.value;
    productQuantity = quantityCounter.value;
    emailInput = document.getElementById("inputEmail").value;
    preventTouching.style.display = "flex";
    warn.style.display = "none";
    
  }else{
    warn.style.display = "initial";
  }

 
});

whatsappBtn.addEventListener("click", function () {

  if(serverIdInput.value.length !== 0 && userIdInput.value.length !== 0 && rs.innerHTML !== "0" && inputEmail.value.length !== 0){
    productQuantity = quantityCounter.value;
    emailInput = document.getElementById("inputEmail").value;
    preventTouching.style.display = "flex";
    
  }else{
    warn.style.display = "initial";
  }

});

itemList.forEach(function (itemCard) {
  itemCard.addEventListener("click", function () {
    itemid = itemCard.getAttribute("item_id");
    itemname = itemCard.getAttribute("item_name");
    const amt = itemCard.getAttribute("data_price");
    price = parseFloat(amt) * productQuantity;
  
  });
});

document.getElementById("rzp-button2").onclick = async function (e) {
  e.preventDefault();

  // Retrieve the value of "final" from the data attribute
  var final = buyButton.getAttribute("data-final");
  var strToNumber = parseFloat(final);
  var amtItem = (strToNumber + 0.026).toFixed(2);

  let response = await fetch("http://localhost:3000/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amtItem * 100 * productQuantity,
    }),
  });

  let orderData = await response.json();
  console.log(orderData.order.id);

  var options = {
    key: "rzp_test_ma2DkqmpPkA3z3", // Enter the Key ID generated from the Dashboard
    amount: final * 100 * productQuantity, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    // "name": "Acme Corp",
    // "description": "Test Transaction",
    // "image": "https://example.com/your_logo",
    order_id: orderData.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: async function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature)
      // alert("Order Confirmed");

      order_id = response.razorpay_order_id;
      window.location.href = `http://localhost:3000/proceed/${userid}/${serverid}/${itemid}/${productQuantity}/${price}/${itemname}/${emailInput}/${response.razorpay_order_id}`;
      // window.location.href = `http://localhost:3000/confirmation/${emailInput}/${userid}/${serverid}/${productQuantity}/${itemname}/${price}/${response.razorpay_order_id}`
      // window.location.href = `http://localhost:3000/pay-status/${response.razorpay_order_id}`;

      $.ajax({
        url: "http://localhost:3000/pay-verify",
        type: "POST",
        data: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
      });
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
};

// For WhatsApp Button

var whatsappBtn = document.getElementById("whatsappBtn");
whatsappBtn.addEventListener("click", function () {
  userid = userIdInput.value;
  serverid = serverIdInput.value;

  console.log(userid);
  console.log(serverid);
});

itemList.forEach(function (itemCard) {
  itemCard.addEventListener("click", function () {
    itemid = itemCard.getAttribute("item_id");
  });
});

whatsappBtn.onclick = async function (e) {
  e.preventDefault();

  // Retrieve the value of "final" from the data attribute
  var final = buyButton.getAttribute("data-final");
  var strToNumber = parseFloat(final);
  var amtItem = (strToNumber + 0.026).toFixed(2);

  let response = await fetch("http://localhost:3000/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amtItem * 100 * productQuantity,
    }),
  });

  let orderData = await response.json();
  console.log(orderData.order.id);

  var options = {
    key: "rzp_test_ma2DkqmpPkA3z3", // Enter the Key ID generated from the Dashboard
    amount: final * 100 * productQuantity, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    // "name": "Acme Corp",
    // "description": "Test Transaction",
    // "image": "https://example.com/your_logo",
    order_id: orderData.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: async function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature)

      window.location.href = `http://localhost:3000/send/${userid}/${serverid}/${itemid}/${itemname}/${price}/${response.razorpay_order_id}/${dateFormat}/${formattedTime}/${productQuantity}/${emailInput}`;
      // window.location.href = `http://localhost:3000/confirmation/${emailInput}/${userid}/${serverid}/${productQuantity}/${itemname}/${price}`
      // window.location.href = `http://localhost:3000/pay-status/${response.razorpay_order_id}`;

      $.ajax({
        url: "http://localhost:3000/pay-verify",
        type: "POST",
        data: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
      });
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
};


orderConfBtn.addEventListener("click", function(){
  preventTouching.style.display = "none"
});

