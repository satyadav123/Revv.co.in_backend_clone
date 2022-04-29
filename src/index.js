const express = require("express");

const cors = require('cors');
const fast2sms = require("fast-two-sms");

const userController = require("./controllers/user.controller")
const passport = require("./configs/google-oauth")
const { body} = require("express-validator");
const {register,login, generateToken} = require("./controllers/auth.controller")
const User = require("./models/user.models")
const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", userController)
app.post("/register",register)
app.post("/login", login)

app.get("/", async function(req,res){
  return res.status(200).send("User");
})
app.use("/user", userController);

app.post("/register",
body("name")
    .trim()
    .not()
    .isEmpty()
    .bail()
    .withMessage("First Name cannot be empty")
    .isLength({ min: 4 })
    .withMessage("First Name must be at least 4 characters"),
  
  body("email")
    .isEmail()
    .custom(async (value) => {
      console.log(value)
      const user = await User.findOne({ email: value });
 
      if (user) {
        throw new Error("Email is already taken");
      }
      return true;
    }),

  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .custom((value) => {
      const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/;
      if (!value.match(passw)) {
        throw new Error("Password must be strong");
      }
      return true;
    }),
  body("mobileNumber").custom((value) => {
    if (value && value.length != 10 ) {
      throw new Error("Mobile Number must be 10 digits");
    }
    return true;
  })

,register)
app.post("/login",

login)



app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));
 
app.get(
'/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session:false } ),

  function(req, res) {
    const token = generateToken(req.user)
    //res.redirect('https://revv-clone-project.netlify.app/')
 
   return res.status(200).send({user:req.user, token})
  //  .redirect('https://revv-clone-project.netlify.app/')
  },
   
)


const carModelController = require("./controllers/carModel.controller");
const carController = require("./controllers/car.controller");
const locationController = require("./controllers/location.controller");

const queryController = require('./controllers/query.controller');
app.use("/car-models", carModelController);
app.use("/cars", carController);
app.use("/locations", locationController);

app.use("/q",queryController);

app.post("/sendmessage", (req, res) => {
  console.log(req.body.number);

  sendMessage(req.body.number,res)
})

function sendMessage(number,res) {

  let otp = "";
  for (var i = 0; i < 6; i++) {
    otp += (Math.floor(Math.random() * (10 - 0)) + 0).toString();
  }
  var optios = {
      authorization: "vjRICqdg1zNLkTS3pHiV8rmxD7ul6cPheM5fOA2s0EtU4oZyFw3K8DXbCmruOiknEvpTafUodHeyhVj9",
      message: `Your One Time Password for the Revv.in Car booking payment is ${otp}`,
      numbers: [number]
  };

  fast2sms.sendMessage(optios)
      .then((response) => {
          // console.log(response);
          res.send("OTP send Sucessfully to your mobile number");
      })
      .catch((error) => {
          // console.log(error);
          res.send("some error taken place")
      });
}

module.exports = app;
