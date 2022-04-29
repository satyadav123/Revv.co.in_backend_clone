const express = require("express");
const router = express.Router();
const crudController = require("./crud.controller");
const Location = require("../models/location.model");

router.get("/", async (req, res) => {
  try {
    const data = await Location.find().populate("model").lean().exec();
    return res.status(200).send({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/", crudController.addOne(Location));

router.patch("/:id", crudController.updateById(Location));

router.delete("/:id", crudController.deleteById(Location));

module.exports = router;
