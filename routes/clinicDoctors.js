const auth = require("../middleware/auth");
const { ClinicDoctor, validate } = require("../models/clinicDoctor");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();


//add Clinic Doctor
router.post("/addClinicDoctor", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, error.details[0].message));

    let clinicDoctor = await ClinicDoctor.findOne({ clinic: req.body.clinic, doctor: req.body.doctor });
    if (clinicDoctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "Record already exists."));

    clinicDoctor = new ClinicDoctor(req.body);
    await clinicDoctor.save();

    res.send(createBaseResponse(clinicDoctor, true, 200));
});


// edit Clinic Doctor
router.post("/editClinicDoctor/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, error.details[0].message));

    let clinicDoctor = await ClinicDoctor.findOne({ _id: req.params.id });
    if (!clinicDoctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "Record doesn't exist."));

    clinicDoctor = await ClinicDoctor.findByIdAndUpdate(req.params.id, { ...req.body });

    res.send(createBaseResponse(clinicDoctor, true, 200));
});

//delete Clinic Doctor
router.delete("/deleteClinicDoctor/:id", async (req, res) => {
    let clinicDoctor = await ClinicDoctor.findOne({ _id: req.params.id });
    if (!clinicDoctor)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "Record does't exist."));

    clinicDoctor = await ClinicDoctor.findByIdAndDelete(req.params.id,);

    res.send(createBaseResponse(clinicDoctor, true, 200));
});


module.exports = router;
