const nodemailer = require("nodemailer");
const {google} = require('googleapis');


const YOUR_CLIENT_ID = "985434999614-9uqeot76vucp652qesm0e4o4ebnsc5pj.apps.googleusercontent.com";
const YOUR_CLIENT_SECRET =  "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";
const YOUR_REDIRECT_URL = "https://developers.google.com/oauthplayground"
const  refresh_token ="1//04wTf3b0gRp75CgYIARAAGAQSNgF-L9IrGONEZU8F8_Pbx0CgIw3h3RPcJA1oFfyVKpCMgQWS0PWUCM0mf_nZH4iUifOSvKBG4Q";


const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: refresh_token
}); 
// 


const accessToken =  oauth2Client.getAccessToken()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
       type: "OAuth2",
       user: "tvpatil330@gmail.com", 
       pass : "ab15cd@1995",
       clientId: YOUR_CLIENT_ID,
       clientSecret: YOUR_CLIENT_SECRET,
       refreshToken: refresh_token,
       accessToken: accessToken,
  }
});

  module.exports ={ transporter}
