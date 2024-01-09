// var themeTxt = document.getElementById("themeTxt");
// var themeSelect = document.querySelector(".theme");
// var flag = 0;

// themeSelect.addEventListener("click", function(){
//    if(flag === 0){
//      themeTxt.innerHTML = "Light";
//      document.querySelector('.logo').style.backgroundColor = "#00193b";
//      document.querySelector('body').style.backgroundColor = "#00193b";
//      document.querySelector('.top-nav ').style.borderBottom = "1px solid #ffffff34";
//      document.querySelector('.side-nav ').style.borderRight = "1px solid #ffffff34";
//      document.querySelector('.side-nav ').style.backgroundColor = "#00193b";
//      document.querySelector('.wrapper ').style.border = "1px solid #ffffff34";
//      document.querySelector('.heading ').style.color = "#dfdfdf";

//      flag = 1;
//    }else if(flag === 1){
//      themeTxt.innerHTML = "Dark";
//      document.querySelector('.logo').style.backgroundColor = "#fff";
//      document.querySelector('body').style.backgroundColor = "#fff";
//      document.querySelector('.top-nav ').style.borderBottom = "1px solid #dfdfdf";
//      document.querySelector('.side-nav ').style.borderRight = "1px solid #dfdfdf";
//      document.querySelector('.side-nav ').style.backgroundColor = "#fff";
//      document.querySelector('.wrapper ').style.border = "1px solid #dfdfdf";
//      document.querySelector('.heading ').style.color = "#000";
//      flag = 0;
//    }
//       })

//news card logic
var vlag = 0;
document.querySelector("#newsIcon").addEventListener("click", function () {
  if (vlag === 0) {
    document.querySelector(".newsCard").style.display = "initial";
    console.log(vlag);
    vlag = 1;
  } else {
    document.querySelector(".newsCard").style.display = "none";
    console.log(vlag);
    vlag = 0;
  }
});

var tag = 0;
document.getElementById("menu").addEventListener("click", function () {
  if (tag === 0) {
    document.querySelector(".side-nav").style.left = "0vw";
    tag = 1;
  } else {
    document.querySelector(".side-nav").style.left = "-65vw";
    tag = 0;
  }
});

//shake animation
function shakeCard() {
  const card = document.querySelectorAll(".sp-items");
  card.forEach(function (item) {
    item.classList.add("shake");
    item.classList.add("shake-border");

    setTimeout(() => {
      item.classList.remove("shake");
      item.classList.remove("shake-border");
    }, 1000);
  });
}

setInterval(shakeCard, 3000); // Trigger shake every 5 seconds
