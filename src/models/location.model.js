const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true ,unique:true},
    petrol_cost: { type: Number, required: true },
    diesel_cost: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('location',locationSchema);