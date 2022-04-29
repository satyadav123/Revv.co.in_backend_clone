const express = require("express");
const router = express.Router();
const CarModel = require("../models/carModel.model");
const Car = require('../models/car.model');
const Location = require('../models/location.model');
const carModel = require("../models/car.model");

// get information of cars availiable in a location
router.get("/:locationId/:duration", async (req, res) => {
  try {
    // console.log('req recv');
    let registeredCars = await Car.find({location:req.params.locationId}).lean().exec();

    // console.log(registeredCars);

    
    let modelsAvailiable = getAvailiables(registeredCars);

    // console.log(modelsAvailiable);
    let availiable = [];
    let soldout = [];
    let location = await getLocationData(req.params.locationId);

    for (key in modelsAvailiable) {

      let model = await CarModel.findOne({ _id: key }).lean().exec();
      addRentPlan(model,location,req.params.duration);


      if (modelsAvailiable[key] > 0) {
        availiable.push(model);
      } else {
        soldout.push(model);
      }
    }
    return res.status(200).send({ availiable, soldout });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
});

// get information about cars of a particular model in a location
router.get("/:locationId/model/:modelId", async (req, res) => {
  try {
    let data = await Car.find({
      location: req.params.locationId,
    })
      .lean()
      .exec();

    console.log(data);
    data = data.filter((el) => {
      console.log(el.model, req.params.modelId);
      return el.model.toString() === req.params.modelId && !el.isBooked;
    });
    console.log(data);
    return res.status(200).send({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// apply filters to models
router.get("/:locationId/:duration/filters", async (req, res) => {
  try {
    let registeredCars = await Car.find({
      location: req.params.locationId,
    }).select("model isBooked -_id").lean().exec();
    // console.log(registeredCars);
    let location = await getLocationData(req.params.locationId);

    let modelsAvailiable = getAvailiables(registeredCars);
    let modelIds = registeredCars.map((el) => {
      let id = el.model.toString();
      // console.log(id);
      return id;
    });
    // console.log(modelIds);

    let filter = [{_id:{$in : modelIds}}];
    for (param in req.query) {
      let obj = {};
      if (typeof req.query[param] === "string") {
        obj[param] = { $in: [req.query[param]] };
      } else {
        obj[param] = { $in: req.query[param] };
      }
      filter.push(obj);
    }

   console.log(modelsAvailiable);

    const data = await CarModel.find({ $and: filter }).lean().exec();
    let availiable = [];
    let soldout = [];

    data.forEach((el) => {
      addRentPlan(el,location,req.params.duration);
      if(modelsAvailiable[el._id] > 0){
        availiable.push(el);
      }
      else{
        soldout.push(el);
      }
    });

    // addRentPlan(data,location,req.params.duration);


    return res.status(200).send( { data : {availiable,soldout }});
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});


async function getLocationData(locationId){
  try {
     let loc = await Location.findById(locationId).lean().exec();
      return loc;

  } catch (error) {
      console.log(error);
      return null;
  }
}
async function addRentPlan(data,location,duration){
  let low_dist = 90*duration;
  let mid_dist = 150*duration;
  let high_dist = 240*duration;

  // add prices excluding fuel cost
  
  data.fuel_ex = {
    low: {
      dist : low_dist + "Kms",
      cost : data.rates.low * low_dist
    },
    mid: {
      dist: mid_dist + "Kms",
      cost: data.rates.mid * mid_dist
    },
    high: {
      dist: duration==1?high_dist + "Kms":"Unlimited Kms",
      cost: data.rates.high * high_dist
    }
  }

  // add prices including fuel cost

   let fuel_cost = location.petrol_cost;
   if(data.fuel_type === "Diesel"){
     fuel_cost = location.diesel_cost;
   }

   let cost_per_km = fuel_cost/data.mileage * 0.3;
  //  console.log(cost_per_km);
     data.fuel_in = {
       low: {
         dist: low_dist + "Kms",
         cost: Math.floor(data.rates.low * low_dist*cost_per_km),
       },
       mid: {
         dist: mid_dist + "Kms",
         cost: Math.floor(data.rates.mid * mid_dist*cost_per_km),
       },
       high: {
         dist: high_dist + "Kms",
         cost: Math.floor(data.rates.high * high_dist*cost_per_km),
       },
     };

  // data.fuel_ex.low = data.
}

function getAvailiables(data){
  let modelsAvailiable = {};
  
  
  data.forEach((ele) => {
      if (ele.isBooked) {
        // console.log('booked',ele.isBooked);
        if (modelsAvailiable[ele.model]) {
          modelsAvailiable[ele.model]--;
        } else {
          modelsAvailiable[ele.model] = 0;
        }
      } else {
        // console.log("not booked", ele.isBooked);

        if (modelsAvailiable[ele.model]) {
          modelsAvailiable[ele.model]++;
        } else {
          modelsAvailiable[ele.model] = 1;
        }
      }
    });

    return modelsAvailiable;
}


module.exports = router;
