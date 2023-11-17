

var itemList = document.querySelectorAll(".item-card");
var rs = document.querySelector(".rs");
var choosed = document.querySelector("#choosed");
var priceCard = document.querySelector(".wrapper");
var clear = document.querySelector(".clear");
var buyButton = document.getElementById("rzp-button2");

// Form Validation ----------->
var userIdInput = document.getElementById("exampleInputEmail1");
var serverIdInput = document.getElementById("exampleInputPassword1");
var emailInput = document.getElementById("exampleInputPassword2");
var warn = document.getElementById("warn");





//on click find item ----- >
itemList.forEach(function(itemcard, index){
    itemcard.addEventListener("click", function(event){
    const price = itemcard.getAttribute("data_price");
    const itemid = itemcard.getAttribute('item_id');
    const itemName = itemcard.getAttribute('item_name');
    console.log("price:", price);
    const finalPrice = price;
    document.querySelector(".rs").innerHTML = finalPrice;
    buyButton.setAttribute('data-final', price);
    document.getElementById('payErr').style.display = "none";

    // var userItem = document.querySelector("#productID");
    // userItem.setAttribute('user-item', itemid);
    // userItem.value = itemName;

         // Check if the form fields are filled
        if (userIdInput.value !== "" && serverIdInput.value !== "") {
            // Set the data-final attribute of the "Buy" button to the item's price
            buyButton.setAttribute("data-final", price);
            warn.style.display = "none";
            console.log("filled");
            priceCard.style.display = "flex";
            
        } else {
            // If the form fields are empty, set the data-final attribute to 0
            buyButton.setAttribute("data-final", "0");
            userIdInput.style.border = "2px solid red";
            serverIdInput.style.border = "2px solid red";
            // emailInput.style.border = "2px solid red";
            warn.style.display = "initial";
            rs.innerHTML = "0";
            choosed.innerHTML = "0";
            priceCard.style.display = "none";
            
        }
         
         //Setting Attribute to purchase button-------------->
        //  buyButton.setAttribute("data-final", price);
     })
    
})

// buy button error handling
// buyButton.addEventListener("click", function(){
//     if(priceCard.style.display = "none"){
//         document.getElementById('payErr').style.display = "initial";
//     }else{
//         document.getElementById('payErr').style.display = "none";
//         priceCard.style.display = "flex";
//     }
// })

//------------------------------

clear.addEventListener("click", function(){
    rs.innerHTML = "0";
    choosed.innerHTML = "0";
    priceCard.style.display = "none";
       //Setting Attribute to purchase button-------------->
       buyButton.setAttribute("data-final", 0);
})


userIdInput.addEventListener("input", function(){
    if(userIdInput.value.length > 0){
        userIdInput.style.border = "1px solid #000";
    }else{
        userIdInput.style.border = "2px solid red";
    }
})
serverIdInput.addEventListener("input", function(){
    if(serverIdInput.value.length > 0){
        serverIdInput.style.border = "1px solid #000";
    }else{
        serverIdInput.style.border = "2px solid red";
    }
})
// emailInput.addEventListener("input", function(){
//     if(emailInput.value.length > 0){
//         emailInput.style.border = "1px solid #000";
//     }else{
//         emailInput.style.border = "2px solid red";
//     }
// })

//setting atribute for email -------->