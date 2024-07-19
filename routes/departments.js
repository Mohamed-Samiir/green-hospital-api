const auth = require("../middleware/auth");
const { Department, validate } = require("../models/department");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");


//get Departments
router.get("/getDepartments", auth, async (req, res) => {
    const totalCount = await Department.countDocuments()
    const departments = await Department.find()
        .sort("name")

    res.send(createBaseResponse(departments, true, 200, totalCount));
})

//add Department
router.post("/addDepartment", [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let department = await Department.findOne({ name: req.body.name });
    if (department)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "القسم مضاف بالفعل"));

    department = new Department(req.body);
    await department.save();

    res.send(createBaseResponse(department, true, 200));
});

//edit department
router.post("/editDepartment/:id", [auth, admin, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let department = await Department.findOne({ _id: req.params.id });
    if (!department)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "القسم غير موجود"));

    department = await Department.findByIdAndUpdate(req.params.id, req.body);

    res.send(createBaseResponse(department, true, 200));
});

//delete Department
router.delete("/deleteDepartment/:id", [auth, admin, validateObjectId], async (req, res) => {
    let department = await Department.findOne({ _id: req.params.id });
    if (!department)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "القسم غير موجود"));

    department = await Department.findByIdAndDelete(req.params.id);

    res.send(createBaseResponse(department, true, 200));
});

module.exports = router;
