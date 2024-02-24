const auth = require("../middleware/auth");
const { PhoneNumber, validate } = require("../models/phoneNumbers");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//get phone numbers
router.get("/", async (req, res) => {
    const pageNumber = req.body.page ? req.body.page : 0
    const pageCount = req.body.count ? req.body.count : 10
    const totalCount = await PhoneNumber.countDocuments()
    const phoneNumbers = await PhoneNumber.find()
        .skip(pageNumber * pageCount)
        .limit(pageCount)
        .sort("name");

    res.send(createBaseResponse(phoneNumbers, true, 200, totalCount));
})

//add phone number
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, error.details[0].message));

    let phoneNumber = await PhoneNumber.findOne({ phoneNumber: req.body.phoneNumber });
    if (phoneNumber)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "User already registered."));

    phoneNumber = new PhoneNumber(_.pick(req.body, ["name", "phoneNumber"]));
    await phoneNumber.save();

    res.send(createBaseResponse(phoneNumber, true, 200));
});

module.exports = router;
