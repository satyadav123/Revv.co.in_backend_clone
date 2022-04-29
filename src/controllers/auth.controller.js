
const User = require("../models/user.models")
const jwt = require('jsonwebtoken');
// const {google} = require('googleapis');

require('dotenv').config();
const {transporter} = require("../configs/mail");

const {validationResult } = require("express-validator");


//https://www.npmjs.com/package/jsonwebtoken(creat token)
const generateToken = (user) => {
    return jwt.sign({user}, process.env.SECRET_KEY)
}

const register = async (req, res) => {

    try{
        const errors= validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      
      if (!req.body.name) {
        return res.status(400).send({message : "Please enter your name" })
      }

        let user = await User.findOne({email : req.body.email}).lean().exec();  
        //checking email
        if(user){
            return res.status(400).send({message : "Email already exists" })
        }





        // if new user, create it or allow to register;
        user = await User.create(req.body);    
        const token = generateToken(user)
        console.log("a")

        // send email  to customer
        let status = "ok";
       const mailoptions ={
        from: '"revv admin" <clonerevv@gmail.com>', // sender address
        to: `${user.email}`, // list of receivers
        subject: `Welcome to Revv, ${user.name}`, // Subject line
        // text: "Hello sir/madam, Your account is creatrd successfully, on Revv", // plain text body
        html: `
        <p>Dear ${user.name}!</p>
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
       console.log("c")

      const result =await transporter.sendMail(mailoptions)
        if(result){
          console.log("Email sent")
        }
        else {
          console.log("Email not sent" )

          
        }       
   
      console.log("d")           
        return res.status(200).send({user, token,status});
    }
    catch(err){
        console.log({ message: err.message })
        return res.status(400).send({ message: err.message });
    }
}



const login = async (req, res) => {
    try{       
        const user = await User.findOne({email : req.body.email})
        //checked if mail exists
        if(!user){
            return res.status(400).send("Wrong Email or Password")
        }

        //if email exists, check password;
        const match = user.checkPassword(req.body.password)

        // if it doesn't match
        if(!match){
            return res.status(400).send({message : "Wrong Email or Password"})
        }

        // if it matches
        const token = generateToken(user)
        return res.status(200).send({user, token});

    }
    catch(err){
        res.status(400).send({message : err.message})
    }
}

module.exports = {register,login,generateToken}

