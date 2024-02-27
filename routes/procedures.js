const auth = require("../middleware/auth");
const { Procedure, validate } = require("../models/procedure");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//get Procedures
router.get("/", async (req, res) => {
    const pageNumber = req.body.page ? req.body.page : 0
    const pageCount = req.body.count ? req.body.count : 10
    const totalCount = await Procedure.countDocuments()
    const procedures = await Procedure.find()
        .populate('doctor', "name -_id")
        .skip(pageNumber * pageCount)
        .limit(pageCount)
        .sort("name")

    res.send(createBaseResponse(procedures, true, 200, totalCount));
})

//add procedure
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, error.details[0].message));

    let procedure = await Procedure.findOne({ name: req.body.name });
    if (procedure)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "Procedure already exists."));

    procedure = new Procedure(req.body);
    await procedure.save();

    res.send(createBaseResponse(procedure, true, 200));
});

module.exports = router;
