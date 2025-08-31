const auth = require("../middleware/auth");
const { Clinic, validate } = require("../models/clinic");
const { ClinicDoctor } = require("../models/clinicDoctor");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");


// get Clinics - Returns clinics with doctors and branches in the specified format
router.get("/getClinics", auth, async (req, res) => {
    try {
        const totalCount = await Clinic.countDocuments();

        const clinicsResponse = await Clinic.aggregate([
            // Stage 1: Lookup clinic doctors
            {
                $lookup: {
                    from: "clinicdoctors",
                    localField: "_id",
                    foreignField: "clinic",
                    as: "clinicDoctors"
                }
            },
            // Stage 2: Unwind clinic doctors to process each one individually
            {
                $unwind: {
                    path: "$clinicDoctors",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Stage 3: Lookup doctor details (only name and _id needed)
            {
                $lookup: {
                    from: "doctors",
                    localField: "clinicDoctors.doctor",
                    foreignField: "_id",
                    as: "doctorInfo",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1
                            }
                        }
                    ]
                }
            },
            // Stage 4: Lookup branch details (only name and _id needed)
            {
                $lookup: {
                    from: "branches",
                    localField: "clinicDoctors.branches",
                    foreignField: "_id",
                    as: "branchInfo",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1
                            }
                        }
                    ]
                }
            },
            // Stage 5: Create doctor structure with proper field names
            {
                $addFields: {
                    "doctorData": {
                        $cond: [
                            { $ne: [{ $arrayElemAt: ["$doctorInfo", 0] }, null] },
                            {
                                _id: "$clinicDoctors._id",
                                name: { $arrayElemAt: ["$doctorInfo.name", 0] },
                                doctorId: "$clinicDoctors.doctor",
                                price: "$clinicDoctors.price",
                                acceptInsurance: "$clinicDoctors.acceptInsurance",
                                freeVisitFollowup: "$clinicDoctors.freeVisitFollowup",
                                ageFrom: "$clinicDoctors.ageFrom",
                                ageFromUnit: "$clinicDoctors.ageFromUnit",
                                ageTo: "$clinicDoctors.ageTo",
                                ageToUnit: "$clinicDoctors.ageToUnit",
                                notes: "$clinicDoctors.notes",
                                branches: {
                                    $map: {
                                        input: "$branchInfo",
                                        as: "branch",
                                        in: {
                                            _id: "$$branch._id",
                                            branchName: "$$branch.name"
                                        }
                                    }
                                }
                            },
                            null
                        ]
                    }
                }
            },
            // Stage 6: Group back by clinic
            {
                $group: {
                    _id: "$_id",
                    clinicName: { $first: "$name" },
                    doctors: {
                        $push: {
                            $cond: [
                                { $ne: ["$doctorData", null] },
                                "$doctorData",
                                "$$REMOVE"
                            ]
                        }
                    }
                }
            },
            // Stage 7: Final projection with exact field names as requested
            {
                $project: {
                    clinicName: 1,
                    _id: 1,
                    doctors: {
                        $filter: {
                            input: "$doctors",
                            as: "doctor",
                            cond: { $ne: ["$$doctor", "$$REMOVE"] }
                        }
                    }
                }
            },
            // Stage 8: Sort by clinic name
            {
                $sort: { clinicName: 1 }
            }
        ]);

        res.send(createBaseResponse(clinicsResponse, true, 200, totalCount));
    } catch (error) {
        console.error("Error in getClinics:", error);
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء جلب العيادات"));
    }
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
router.post("/editClinic/:id", [auth, admin, validateObjectId()], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

        // Check if clinic exists
        let clinic = await Clinic.findOne({ _id: req.params.id });
        if (!clinic)
            return res.status(404).send(createBaseResponse(null, false, 404, 0, null, "العيادة غير موجودة"));

        // Update the clinic and return the updated document
        const updatedClinic = await Clinic.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true, runValidators: true }
        );

        console.log("Updated clinic:", updatedClinic);
        res.send(createBaseResponse(updatedClinic, true, 200, 0, null, "تم تحديث العيادة بنجاح"));
    } catch (error) {
        console.error("Error updating clinic:", error);
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء تحديث العيادة"));
    }
});

//delete Clinic
router.delete("/deleteClinic/:id", [auth, admin, validateObjectId()], async (req, res) => {
    try {
        // First check if the clinic exists
        let clinic = await Clinic.findOne({ _id: req.params.id });
        if (!clinic)
            return res.status(404).send(createBaseResponse(null, false, 404, 0, null, "العيادة غير موجودة"));

        // Delete all associated clinic doctors first
        await ClinicDoctor.deleteMany({ clinic: clinic._id });
        console.log("Deleted associated clinic doctors for clinic:", clinic._id);

        // Delete the clinic
        const deletedClinic = await Clinic.findByIdAndDelete(req.params.id);
        console.log("Deleted clinic:", deletedClinic);

        res.send(createBaseResponse(deletedClinic, true, 200, 0, null, "تم حذف العيادة بنجاح"));
    } catch (error) {
        console.error("Error deleting clinic:", error);
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء حذف العيادة"));
    }
});


module.exports = router;
