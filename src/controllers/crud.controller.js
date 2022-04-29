const listAll = (model) => async (req, res) => {
  try {
    const data = await model.find().lean().exec();
    return res.status(200).send({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const addOne = (model) => async (req, res) => {
  try {
    const data = await model.create(req.body);
    res.status(201).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const updateById = (model) => async (req, res) => {
  try {
    const data = await model
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .lean()
      .exec();

    return res.status(200).send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const deleteById = (model) => async (req, res) => {
  try {
    const item = await model.findByIdAndDelete(req.params.id).lean().exec();

    return res.status(200).send(item);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = {
  listAll,
  updateById,
  addOne,
  deleteById,
};
