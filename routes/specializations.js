const auth = require("../middleware/auth");
const { Specialization, validate } = require("../models/specialization");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//get specializations
router.get("/getSpecializations", async (req, res) => {
    const specializations = await Specialization.find()
        .sort("name");

    res.send(createBaseResponse(specializations, true, 200, 1));
})

//get subSpecializations
router.get("/getSubSpecializations", async (req, res) => {
    const specializations = await Specialization.find()
        .sort("name");
    let subSpecializations = []
    for (let i = 0; i < specializations.length; i++) {
        subSpecializations = [...subSpecializations, ...specializations[i].subSpecializations]
    }
    res.send(createBaseResponse(subSpecializations, true, 200, 1));
})

//add specialization number
router.post("/addSpecialization", async (req, res) => {
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

//add specialization number
router.post("/editSpecialization/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, error.details[0].message));

    let specialization = await Specialization.findOne({ _id: req.params.id });
    if (!specialization)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "Specialization doesn't exists."));

    specialization = await Specialization.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            subSpecializations: req.body.subSpecializations
        });

    res.send(createBaseResponse(specialization, true, 200));
});

//delete Specialization
router.delete("/deleteSpecialization/:id", async (req, res) => {
    let specialization = await Specialization.findOne({ _id: req.params.id });
    if (!specialization)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "Specialization donn't exist."));

    specialization = await Specialization.findByIdAndDelete(req.params.id,);

    res.send(createBaseResponse(specialization, true, 200));
});

module.exports = router;
