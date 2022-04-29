// allowedRole = ["seller", "admin"]
const authorise = (allowedRole) => {

    return(req,res,next) => {
    // getting the user;
        const user = req.user;
        let isPermitted = false;
        console.log( "*",req.user)
    // checking if he has permitted role
 
        // if(user.role.includes(allowedRole)){
        //     isPermitted = true;
        // }
        console.log("ril",user.role)
    allowedRole.map(role => {    
        if(user.role.includes(role)){
            isPermitted = true;
        }
    })

           // if permitted, he can go ahead
           if(isPermitted){
               return next()
           }
           else{
            return res.status(401).send({message : "You are not authorised to perform this operation"})
        }
    }
}

// const authoriseId = () => {
//     return async(req, res, next) => {
//       let userId = req.user._id;
  
//       let postuserId;
  
//       try {
//         const post = await Post.findById(req.params.id).lean().exec();
  
//         postuserId = post.user_id.toHexString();
  
//       } catch (err) {
//         return res.status(500).send({ message: err.message });
//       }
  
//       if (userId === postuserId) return next();
  
//       return res.status(403).send({ message: "permission denied" });
//     };
//   };
  
  module.exports = { authorise, authoriseId };

