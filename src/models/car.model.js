const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carModel",
      required: true,
    },
    location:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'location',
      required: true,
    },
    isBooked: { type: Boolean, default: false },
    lastBooking : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'booking',
        default:null
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('car',carSchema);


