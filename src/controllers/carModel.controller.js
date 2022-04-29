const express = require("express");
const router = express.Router();
const crudController = require("./crud.controller");
const CarModel = require("../models/carModel.model");

router.get("/", crudController.listAll(CarModel));

router.post("/", crudController.addOne(CarModel));

router.patch("/:id", crudController.updateById(CarModel));

router.delete("/:id", crudController.deleteById(CarModel));

module.exports = router;
