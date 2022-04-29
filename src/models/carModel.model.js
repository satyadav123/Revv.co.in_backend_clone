const mongoose = require('mongoose');

const carsModelSchema = new mongoose.Schema({
  model_name: { type: String, required: true },
  brand: { type: String, required: true },
  segment: { type: String, required: true },
  fuel_type: { type: String, enum: ["Petrol", "Diesel"], required: true },
  transmission_type: {
    type: String,
    enum: ["Manual", "Automatic"],
    required: true,
  },
  seats: { type: String, required: true },
  image_url: { type: String, required: true },
  rates: {
    low: { type: Number, required: true },
    mid: { type: Number, required: true },
    high: { type: Number, required: true },
  },
  extraChargePerKm: { type: Number, required: true },
  mileage:{type:Number,required:true}
},{
    timestamps:true
});

module.exports = mongoose.model('carModel',carsModelSchema);