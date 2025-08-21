const auth = require("../middleware/auth");
const { Doctor, validate } = require("../models/doctor");
const { Specialization } = require("../models/specialization");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");


//get Doctors
router.get("/getDoctors", auth, async (req, res) => {
    const totalCount = await Doctor.countDocuments()
    let doctors = await Doctor.find()
        .populate('specialization')
        .sort("name")

    if (!req.user.isAdmin) {
        doctors = doctors.filter(doc => doc.isActive)
    }

    res.send(createBaseResponse(doctors, true, 200, totalCount));
})

//add Doctor
router.post("/addDoctor", [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let doctor = await Doctor.findOne({ name: req.body.name });
    if (doctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب موجود بالفعل"));

    let doctorObj = { ...req.body }
    let selectedSpecialization = await Specialization.findById(req.body.specialization).select()
    if (selectedSpecialization) {
        let selectedSubSpecializations = selectedSpecialization.subSpecializations.filter(subspec => req.body.subSpecializations.includes(subspec._id.toString()))
        if (selectedSubSpecializations) {
            doctorObj.subSpecializations = selectedSubSpecializations
        }
    }

    doctor = new Doctor(doctorObj);
    await doctor.save();

    res.send(createBaseResponse(doctor, true, 200));
});


//edit Doctor
router.post("/editDoctor/:id", [auth, admin, validateObjectId()], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let doctor = await Doctor.findOne({ _id: req.params.id });
    if (!doctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب غير موجود"));

    let doctorObj = { ...req.body }
    let selectedSpecialization = await Specialization.findById(req.body.specialization).select()
    if (selectedSpecialization) {
        let selectedSubSpecializations = selectedSpecialization.subSpecializations.filter(subspec => req.body.subSpecializations.includes(subspec._id.toString()))
        if (selectedSubSpecializations) {
            doctorObj.subSpecializations = selectedSubSpecializations
        }
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, { ...doctorObj });

    res.send(createBaseResponse(doctor, true, 200));
});

//delete Doctor
router.delete("/deleteDoctor/:id", [auth, admin, validateObjectId()], async (req, res) => {
    let doctor = await Doctor.findOne({ _id: req.params.id });
    if (!doctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب غير موجود"));

    doctor = await Doctor.findByIdAndDelete(req.params.id,);

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
