require("dotenv").config();

const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
          if(err){
              return reject(err)
          }
          return resolve(decoded)
          });
        
    })
}


const authenticate = async (req,res,next) => {
// If token is not sended then show errr(header is present)
if(!req.headers.authorization)
return res.status(400).send({message : "Authorization token not found or incorrect"})

// if present than starts with "Bearer "
if(!req.headers.authorization.startsWith("Bearer "))
return res.status(400).send({message : "Authorization token not found or incorrect"})

const token = req.headers.authorization.trim().split(" ")[1]


let decoded;
try {
    decoded = await verifyToken(token)
}
catch(err){
    console.log(err)
    return res.status(400).send({message : "Authorization token not found or incorrect"})
}

    // req.userID = decoded.user._id;
    //we need user id in the authentication middleware
 req.user = decoded.user;
 return next();
}

module.exports = authenticate;