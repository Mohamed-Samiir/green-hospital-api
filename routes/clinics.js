const auth = require("../middleware/auth");
const { Clinic, validate } = require("../models/clinic");
const { ClinicDoctor } = require("../models/clinicDoctor");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");


//get Clinics
router.get("/getClinics", auth, async (req, res) => {
    const totalCount = await Clinic.countDocuments()
    const clinics = await Clinic.find()
        .sort("name")

    let clinicsResponse = []
    if (clinics.length) {
        for (let i = 0; i < clinics.length; i++) {
            let clinicDoctors = await ClinicDoctor.find({ clinic: clinics[i]._id }).populate('doctor')
            clinicsResponse.push({
                name: clinics[i].name,
                _id: clinics[i]._id,
                doctors: clinicDoctors
            })
        }
    }

    res.send(createBaseResponse(clinicsResponse, true, 200, totalCount));
})

//add Clinic
router.post("/addClinic", [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let clinic = await Clinic.findOne({ name: req.body.name });
    if (clinic)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "العيادة مضافة بالفعل"));

    clinic = new Clinic(req.body);
    await clinic.save();

    res.send(createBaseResponse(clinic, true, 200));
});


// edit Clinic
router.post("/editClinic/:id", [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let clinic = await Clinic.findOne({ _id: req.params.id });
    if (!clinic)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "العيادة غير موجودة"));

    clinic = await Clinic.findByIdAndUpdate(req.params.id, { name: req.body.name });

    res.send(createBaseResponse(clinic, true, 200));
});

//delete Clinic
router.delete("/deleteClinic/:id", [auth, admin, validateObjectId], async (req, res) => {
    let clinic = await Clinic.findOne({ _id: req.params.id });
    if (!clinic)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "العيادة غير موجودة"));

    let clinicDoctors = await ClinicDoctor.deleteMany({ clinic: clinic._id })
    clinic = await Clinic.findByIdAndDelete(req.params.id);
    res.send(createBaseResponse(clinic, true, 200));
});


module.exports = router;
