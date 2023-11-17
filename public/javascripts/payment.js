var userIdInput = document.getElementById("exampleInputEmail1");
var serverIdInput = document.getElementById("exampleInputPassword1");
var itemList = document.querySelectorAll(".item-card");
var buyButton = document.getElementById("rzp-button2");

var userid = '';
var serverid = '';
var itemid = '';


buyButton.addEventListener('click', function(){
userid = userIdInput.value;
serverid = serverIdInput.value;

console.log(userid);
console.log(serverid);
})






itemList.forEach(function(itemCard){
   itemCard.addEventListener("click", function(){
    itemid = itemCard.getAttribute('item_id')
   })
})


 


document.getElementById('rzp-button2').onclick = async function(e){
    e.preventDefault();

    // Retrieve the value of "final" from the data attribute
    var final = buyButton.getAttribute('data-final');

    let response = await fetch("https://rapidemporium-7hhh.onrender.com/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: final * 100,
        })
    })


   let orderData = await response.json();
   console.log(orderData.order.id);

    var options = {
    "key": "rzp_test_PCIwXguS5ffBCG", // Enter the Key ID generated from the Dashboard
    "amount": final * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    // "name": "Acme Corp",
    // "description": "Test Transaction",
    // "image": "https://example.com/your_logo",
    "order_id": orderData.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": async function (response){
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature)
        alert("Order Confirmed");
        window.location.href = `https://rapidemporium-7hhh.onrender.com/proceed/${userid}/${serverid}/${itemid}`
        // window.location.href = `http://localhost:3000/pay-status/${response.razorpay_order_id}`;

$.ajax({
    url: 'https://rapidemporium-7hhh.onrender.com/pay-verify',
    type: 'POST',
    data: {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
    },
})
    },
};
var rzp1 = new Razorpay(options);
    rzp1.open();
}
