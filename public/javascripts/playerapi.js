//91764003
var userIdInput = document.getElementById("exampleInputEmail1");
var serverIdInput = document.getElementById("exampleInputPassword1");
var playerId = document.getElementById("mlbb-playerid");
var playerName = document.getElementById("mlbb-playername");
var vServer = document.getElementById("mlbb-serverid");
var gameName = document.getElementById("exampleModalLabel");
var button2 = document.getElementById("rzp-button2");
var Info = document.querySelector(".info");
var verifyErr = document.querySelector(".verify-err");
var isVarify = document.querySelector(".isVerify");
var whatsappBtn = document.getElementById("whatsappBtn");

var buyButton = document.querySelector("#rzp-button1");

var userid = "";
var serverid = "";

buyButton.addEventListener("click", async function () {
  userid = userIdInput.value;
  serverid = serverIdInput.value;

  const options = {
    method: "GET",
    url: `https://id-game-checker.p.rapidapi.com/mobile-legends/${userid}/${serverid}`,
    headers: {
      "X-RapidAPI-Key": "e2d09dc5e7msh304deeb04e7ee11p18c813jsn74eeb3cf68ad",
      "X-RapidAPI-Host": "id-game-checker.p.rapidapi.com",
    },
  };

  try {
    console.log("Sab thik");
    const response = await axios.request(options);
    const playerInfo = response.data;

    const pattern = /^[0-9@]+$/;

    if (pattern.test(playerInfo.data.username)) {
      verifyErr.style.display = "initial";
      verifyErr.innerHTML = "Enter valid playerID or Try after some time";
      Info.style.display = "none";
      button2.style.display = "none";
      whatsappBtn.style.display = "none";
    } else {
      gameName.innerHTML = playerInfo.data.game;
      playerName.value = playerInfo.data.username;
      playerId.value = playerInfo.data.userId;
      button2.style.display = "initial";
      verifyErr.style.display = "none";
      isVarify.style.display = "initial";
      whatsappBtn.style.display = "initial";
    }
  } catch (error) {
    console.error(error);
    verifyErr.style.display = "initial";
    verifyErr.innerHTML = "Enter valid playerID or Try after some time";
    Info.style.display = "none";
    button2.style.display = "none";
    console.log("Koi toh error");
  }
});
