const auth = require("../middleware/auth");
const { Clinic, validate } = require("../models/clinic");
const { ClinicDoctor } = require("../models/clinicDoctor");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");


// get Clinics
router.get("/getClinics", auth, async (req, res) => {
    const totalCount = await Clinic.countDocuments()
    // const clinics = await Clinic.find()
    //     .sort("name")

    // let clinicsResponse = []
    // if (clinics.length) {
    //     for (let i = 0; i < clinics.length; i++) {
    //         let clinicDoctors = await ClinicDoctor.find({ clinic: clinics[i]._id }).populate('doctor')
    //         clinicsResponse.push({
    //             name: clinics[i].name,
    //             _id: clinics[i]._id,
    //             doctors: clinicDoctors
    //         })
    //     }
    // }

    const clinicsResponse = await Clinic.aggregate([
        {
            $lookup: {
                from: "clinicdoctors", // The name of the clinicDoctors collection
                localField: "_id",     // The field from the clinics collection
                foreignField: "clinic", // The field from the clinicDoctors collection
                as: "clinicDoctors"     // The output array field
            }
        },
        {
            $lookup: {
                from: "doctors",            // The name of the doctors collection
                localField: "clinicDoctors.doctor", // The field from clinicDoctors
                foreignField: "_id",        // The field from the doctors collection
                as: "doctorDetails"         // The output array field
            }
        },
        {
            $addFields: { // Add doctor names to each clinicDoctor
                "clinicDoctors": {
                    $map: {
                        input: "$clinicDoctors",
                        as: "clinicDoctor",
                        in: {
                            $mergeObjects: [
                                "$$clinicDoctor", // Keep all properties of clinicDoctor
                                {
                                    doctorName: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$doctorDetails",
                                                    as: "doctor",
                                                    cond: { $eq: ["$$doctor._id", "$$clinicDoctor.doctor"] } // Match doctor ID
                                                }
                                            },
                                            0 // Get the first matching doctor
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project: {                     // Project the final output
                _id: 1,
                name: 1,
                clinicDoctors: {
                    $filter: {
                        input: "$clinicDoctors",
                        as: "clinicDoctor",
                        cond: { $ne: ["$$clinicDoctor.doctorName", null] } // Filter out clinicDoctors without doctor names
                    }
                }
            }
        }
    ]);


    res.send(createBaseResponse(clinicsResponse, true, 200, totalCount));
})

// router.get("/getClinics", auth, async (req, res) => {
//     try {
//         const totalCount = await Clinic.countDocuments();

//         const clinicsResponse = await Clinic.aggregate([
//             {
//                 $lookup: {
//                     from: 'clinicDoctors',               // Lookup into clinicDoctors collection
//                     localField: '_id',                   // Match clinic _id
//                     foreignField: 'clinic',              // with clinic field in clinicDoctors
//                     as: 'clinicDoctors'
//                 }
//             },
//             {
//                 $unwind: {                              // Unwind clinicDoctors to process each clinic-doctor relation
//                     path: "$clinicDoctors",
//                     preserveNullAndEmptyArrays: true    // Preserve clinics even if no doctors are linked
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'doctors',                    // Lookup into doctors collection
//                     localField: 'clinicDoctors.doctor',  // Match doctor id from clinicDoctors
//                     foreignField: '_id',                // with _id in doctors collection
//                     as: 'doctorDetails'                 // Output array with matching doctor documents
//                 }
//             },
//             {
//                 $unwind: {                              // Unwind doctorDetails array to get individual doctor data
//                     path: "$doctorDetails",
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $group: {                               // Group by clinic
//                     _id: "$_id",
//                     name: { $first: "$name" },          // Keep clinic name
//                     doctors: { $push: "$doctorDetails" } // Collect doctor details into an array
//                 }
//             },
//             {
//                 $sort: { name: 1 }                      // Sort clinics by name
//             }
//         ]);

//         res.send(createBaseResponse(clinicsResponse, true, 200, totalCount));
//     } catch (error) {
//         res.status(500).send({ error: "Something went wrong." });
//     }
// });


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
