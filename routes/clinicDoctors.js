const auth = require("../middleware/auth");
const { ClinicDoctor, validate } = require("../models/clinicDoctor");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");


//add Clinic Doctor
router.post("/addClinicDoctor", [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let clinicDoctor = await ClinicDoctor.findOne({ clinic: req.body.clinic, doctor: req.body.doctor });
    if (clinicDoctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب مسجل بالفعل بالعيادة"));

    clinicDoctor = new ClinicDoctor(req.body);
    await clinicDoctor.save();

    res.send(createBaseResponse(clinicDoctor, true, 200));
});


// edit Clinic Doctor
router.post("/editClinicDoctor/:id", [auth, admin, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let clinicDoctor = await ClinicDoctor.findOne({ _id: req.params.id });
    if (!clinicDoctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب غير موجود"));

    clinicDoctor = await ClinicDoctor.findByIdAndUpdate(req.params.id, { ...req.body });

    res.send(createBaseResponse(clinicDoctor, true, 200));
});

//delete Clinic Doctor
router.delete("/deleteClinicDoctor/:id", [auth, admin, validateObjectId], async (req, res) => {
    let clinicDoctor = await ClinicDoctor.findOne({ _id: req.params.id });
    if (!clinicDoctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب غير موجود"));

    clinicDoctor = await ClinicDoctor.findByIdAndDelete(req.params.id,);

    res.send(createBaseResponse(clinicDoctor, true, 200));
});


module.exports = router;
