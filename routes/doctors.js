const auth = require("../middleware/auth");
const { Doctor, validate } = require("../models/doctor");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//get Doctors
router.get("/getDoctors", async (req, res) => {
    const totalCount = await Doctor.countDocuments()
    const doctors = await Doctor.find()
        .populate('specialization', "name -_id")
        .sort("name")

    res.send(createBaseResponse(doctors, true, 200, totalCount));
})

//add Doctor
router.post("/addDoctor", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, error.details[0].message));

    let doctor = await Doctor.findOne({ name: req.body.name });
    if (doctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "Doctor already exists."));

    doctor = new Doctor(_.pick(req.body, ["name", "degree", "specialization", "subSpecializations"]));
    await doctor.save();

    res.send(createBaseResponse(doctor, true, 200));
});

//get Doctor by Id
router.get("/getDoctorById", async (req, res) => {
    const doctors = await Doctor.find()
        .populate('specialization', "name -_id")
        .sort("name")

    res.send(createBaseResponse(doctors, true, 200, 1));
})

module.exports = router;
