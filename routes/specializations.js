const auth = require("../middleware/auth");
const { Specialization, validate } = require("../models/specialization");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//get sub specializations
router.get("/getSpecializations", async (req, res) => {
    const totalCount = await Specialization.countDocuments()
    const specializations = await Specialization.find()
        .sort("name");

    res.send(createBaseResponse(specializations, true, 200, totalCount));
})

//add specialization number
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, error.details[0].message));

    let specialization = await Specialization.findOne({ name: req.body.name });
    if (specialization)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "Specialization aleary exists."));

    specialization = new Specialization(_.pick(req.body, ["name", "subSpecializations"]));
    await specialization.save();

    res.send(createBaseResponse(specialization, true, 200));
});

module.exports = router;
