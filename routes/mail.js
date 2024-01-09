require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.MAIL_CLIENT_ID,
  process.env.MAIL_CLIENT_SECRET,
  process.env.MAIL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.MAIL_REFRESH_TOKEN });

async function sendMail(
  email,
  userid,
  serverid,
  quantity,
  itemname,
  price,
  orderid
) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
     var finalPrice = price * quantity;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      // host: "smtp.gmail.com",
      // port: 465,
      // secure: true,
      auth: {
        type: "OAuth2",
        user: "useretheharsh0408@gmail.com",
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
        accessToken: accessToken,
        expires: 1484314697598,
      },
    });

    const mailOptions = {
      from: "RAPID EMPORIUM <useretheharsh0408@gmail.com>",
      to: email,
      subject: "Order Confirmation Mail",
      text: `Order Confirmation Mail\n\nOrderID: ${orderid}\nProduct Name: ${itemname}\nProduct Quantity: ${quantity}\nTotal Amount: ${price}\nPlayer Id: ${userid}\nServer Id: ${serverid}\n\nThank you for Shopping`,
      html: `<h2>Order Confirmation Mail</h2>
        <p>OrderID: ${orderid}</p>
        <p>Product Name: ${itemname}</p>
        <p>Product Quantity: ${quantity}</p>
        <p>Total Amount: ₹${finalPrice}</p>
        <p>Player Id: ${userid}</p>
        <p>Server Id: ${serverid}</p>
        <p>Thank you for your purchase! We appreciate your support and hope you enjoy your new ${itemname}</p>`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Message Sent Successfully");
    return result;
  } catch (error) {
    console.log("There is some problem");
  }
}

module.exports = sendMail;
