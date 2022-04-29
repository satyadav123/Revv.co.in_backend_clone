const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
//  let nodemailer = require('nodemailer');
let {transporter }= require('./transporter');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
// const path = require("path");




const User = require("../models/user.models")

// let transporter = nodemailer.createTransport({



//   service:'gmail',
//   auth: {
//       user: 'clonerevv@gmail.com',
//       pass: 'Revv@123'
//   }
// });



//   service:'gmail',
//   auth: {
//       user: 'clonerevv@gmail.com',
//       pass: 'Revv@123'
//   }
// });
passport.use(new GoogleStrategy({
    clientID: "985434999614-9qvb2h5n1g6ire1p1g3mimjnqihn1pkd.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5656/auth/google/callback"
  },

  async function(accessToken, refreshToken, profile, cb) {

   console.log("profile",profile)
    let user = await User.findOne({email : profile?._json?.email}).lean().exec()

    if(!user){
        user = await User.create({
            name : profile._json.given_name,        
            email : profile._json.email,
            picture :profile._json.picture ,
            password : uuidv4(), 
            role : ["customer"]
        })
    }
    console.log(user) ;
    const mailoptions ={
      from: '"revv admin" <clonerevv@gmail.com>', // sender address
      to: profile._json.email, // list of receivers
      subject: `Welcome to Revv, ${profile._json.given_name}`, // Subject line
      html: `
        <p>Dear ${profile._json.given_name}!</p>
        <p>Thanks for choosing Revv!</p>
        <p>We are excited to have you on-board, and look forward to delivering a fantastic mobility experience. 
            It is a whole new world of privacy, freedom and convenience - just like your own car!
            <br><br>          
            We are excited to have you on-board, and look forward to delivering a fantastic mobility experience. It is a whole new world of privacy, freedom and convenience - just like your own car!
    <br><br>
            When you make your first booking with us, we will send you a password to this email id, which you can use to make your account secure. This will not be required if you are using Facebook/Google login.
            <br>   <br>   
            Should you need any further assistance, contact us at care@revv.co.in, or call us on +91 9250035555.
            <br>  <br>     
            Look forward to see you again at Revv.
            <br> <br>     
            Team @ Revv   
            <br><br>   
        </p>
`, // html body
    }

    // console.log("mailoptions",mailoptions)
    const result =await transporter.sendMail(mailoptions)
    if(result){
      console.log("Email sent")
    }
    else {
      console.log("Email not sent" )

      res.redirect('http://localhost:5656/Revv%20front%20end/index.html')

    } 

    console.log("d")           
    return cb(null, user);
  }
));
module.exports = passport;