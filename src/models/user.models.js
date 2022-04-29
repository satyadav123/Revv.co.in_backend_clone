const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name : { type : String, required : true},
        email : { type : String, required : true, unique:true },
        password : {type : String, required : true},
        mobileNumber :{type : Number, required : false},
        picture :{    type : String
                , required : false},
        address :{type : String, required : false},
    },
    {
        timestamps :true,
        versionKey:false,
    }
);

// pre middlewware used before save do this operation
//https://www.npmjs.com/package/bcrypt(To hash a password:)
// convert password into hasing
userSchema.pre("save" , function(next){
    var hash = bcrypt.hashSync(this.password, 5);
    this.password = hash;
    console.log(hash)  ;
    return next();
    // Store hash in your password DB.
})

// ES6 not supported
userSchema.methods.checkPassword = function (password) {
    // console.log(this.password)
    return bcrypt.compareSync(password, this.password); 
}

const User  = mongoose.model("user", userSchema);

module.exports = User;