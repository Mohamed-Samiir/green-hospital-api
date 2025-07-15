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
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, error.details[0].message, "يوجد خطأ بالمدخلات"));

        let clinicDoctor = await ClinicDoctor.findOne({ clinic: req.body.clinic, doctor: req.body.doctor });
        if (clinicDoctor)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب مسجل بالفعل بالعيادة"));

        // Ensure branches is always an array
        const clinicDoctorData = {
            ...req.body,
            branches: req.body.branches || []
        };

        clinicDoctor = new ClinicDoctor(clinicDoctorData);
        await clinicDoctor.save();

        res.send(createBaseResponse(clinicDoctor, true, 200, 0, null, "تم إضافة الطبيب بنجاح"));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء إضافة الطبيب"));
    }
});


// edit Clinic Doctor
router.post("/editClinicDoctor/:id", [auth, admin, validateObjectId], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, error.details[0].message, "يوجد خطأ بالمدخلات"));

        let clinicDoctor = await ClinicDoctor.findOne({ _id: req.params.id });
        if (!clinicDoctor)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب غير موجود"));

        // Properly handle branches array update
        const updateData = {
            clinic: req.body.clinic,
            doctor: req.body.doctor,
            branches: req.body.branches || [], // Ensure branches is always an array
            price: req.body.price,
            acceptInsurance: req.body.acceptInsurance,
            freeVisitFollowup: req.body.freeVisitFollowup,
            ageFrom: req.body.ageFrom,
            ageFromUnit: req.body.ageFromUnit,
            ageTo: req.body.ageTo,
            ageToUnit: req.body.ageToUnit,
            notes: req.body.notes
        };

        clinicDoctor = await ClinicDoctor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return the updated document
        );

        res.send(createBaseResponse(clinicDoctor, true, 200, 0, null, "تم تعديل الطبيب بنجاح"));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء تعديل الطبيب"));
    }
});

//delete Clinic Doctor
router.delete("/deleteClinicDoctor/:id", [auth, admin, validateObjectId], async (req, res) => {
    try {
        let clinicDoctor = await ClinicDoctor.findOne({ _id: req.params.id });
        if (!clinicDoctor)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الطبيب غير موجود"));

        clinicDoctor = await ClinicDoctor.findByIdAndDelete(req.params.id);

        res.send(createBaseResponse(clinicDoctor, true, 200, 0, null, "تم حذف الطبيب بنجاح"));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء حذف الطبيب"));
    }
});


module.exports = router;
