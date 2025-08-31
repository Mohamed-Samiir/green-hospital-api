const auth = require("../middleware/auth");
const { Procedure, validate } = require("../models/procedure");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

//get Procedures
router.get("/getProcedures", auth, async (req, res) => {
    try {
        const totalCount = await Procedure.countDocuments()
        const procedures = await Procedure.find()
            .populate('doctors', "name _id")
            .populate('branchId', 'name _id')
            .sort("name")

        res.send(createBaseResponse(procedures, true, 200, totalCount));
    } catch (error) {
        console.error("Error in getProcedures:", error);
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء جلب الإجراءات"));
    }
})

//add procedure
router.post("/addProcedure", [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let procedure = await Procedure.findOne({ name: req.body.name, branchId: req.body.branchId });
    if (procedure)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الإجراء مضاف بالفعل"));

    procedure = new Procedure(req.body);
    await procedure.save();

    res.send(createBaseResponse(procedure, true, 200));
});

//edit procedure
router.post("/editProcedure/:id", [auth, admin, validateObjectId()], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let procedure = await Procedure.findOne({ _id: req.params.id });
    if (!procedure)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الإجراء غير موجود"));

    procedure = await Procedure.findByIdAndUpdate(req.params.id, req.body);

    res.send(createBaseResponse(procedure, true, 200));
});

//delete Procedure
router.delete("/deleteProcedure/:id", [auth, admin, validateObjectId()], async (req, res) => {
    let procedure = await Procedure.findOne({ _id: req.params.id });
    if (!procedure)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الإجراء غير موجود"));

    procedure = await Procedure.findByIdAndDelete(req.params.id);

    res.send(createBaseResponse(procedure, true, 200));
});

module.exports = router;
