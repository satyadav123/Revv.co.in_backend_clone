const mongoose = require("mongoose");

module.exports = () => {
    return mongoose.connect(
    "mongodb+srv://revvbackend:revv123@cluster0.h57o8.mongodb.net/revv_backend"
    );
};