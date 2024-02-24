const auth = require("../middleware/auth");
const { Doctor, validate } = require("../models/doctor");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//get Doctors
router.get("/", async (req, res) => {
    const pageNumber = req.body.page ? req.body.page : 0
    const pageCount = req.body.count ? req.body.count : 10
    const totalCount = await Doctor.countDocuments()
    const doctors = await Doctor.find()
        .populate('specialization', "name -_id")
        .skip(pageNumber * pageCount)
        .limit(pageCount)
        .sort("name")

    res.send(createBaseResponse(doctors, true, 200, totalCount));
})

//add Doctor
router.post("/", async (req, res) => {
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

module.exports = router;
