const express = require("express");
const router = express.Router();
const crudController = require("./crud.controller");
const Car = require("../models/car.model");

router.get("/",crudController.listAll(Car));
// router.get("/", async(req,res) => {
//     try {
//       const data = await Car.find().populate('location').lean().exec();
//       return res.status(200).send({ data });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send(error);
//     }
// });


router.post("/", crudController.addOne(Car));

router.patch("/:id", crudController.updateById(Car));

router.delete("/:id", crudController.deleteById(Car));

module.exports = router;
