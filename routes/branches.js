const auth = require("../middleware/auth");
const { Branch, validate } = require("../models/branch");
const createBaseResponse = require('../startup/baseResponse');
const _ = require("lodash");
const express = require("express");
const admin = require("../middleware/admin");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");

// Get Branches
router.get("/getBranches", auth, async (req, res) => {
    try {
        const totalCount = await Branch.countDocuments();
        const branches = await Branch.find()
            .sort("name");

        res.send(createBaseResponse(branches, true, 200, totalCount));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء جلب الفروع"));
    }
});

// Add Branch
router.post("/addBranch", [auth, admin], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, error.details[0].message, "يوجد خطأ بالمدخلات"));

        let branch = await Branch.findOne({ name: req.body.name });
        if (branch)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الفرع مضاف بالفعل"));

        branch = new Branch({
            name: req.body.name,
            address: req.body.address,
            isActive: true
        });
        
        await branch.save();

        res.send(createBaseResponse(branch, true, 200, 0, null, "تم إضافة الفرع بنجاح"));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء إضافة الفرع"));
    }
});

// Edit Branch
router.post("/editBranch/:id", [auth, admin, validateObjectId], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, error.details[0].message, "يوجد خطأ بالمدخلات"));

        let branch = await Branch.findOne({ _id: req.params.id });
        if (!branch)
            return res.status(404).send(createBaseResponse(null, false, 404, 0, null, "الفرع غير موجود"));

        // Check if another branch with the same name exists (excluding current branch)
        let existingBranch = await Branch.findOne({ 
            name: req.body.name, 
            _id: { $ne: req.params.id } 
        });
        if (existingBranch)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "يوجد فرع آخر بنفس الاسم"));

        branch = await Branch.findByIdAndUpdate(
            req.params.id, 
            { 
                name: req.body.name,
                address: req.body.address
            },
            { new: true }
        );

        res.send(createBaseResponse(branch, true, 200, 0, null, "تم تعديل الفرع بنجاح"));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء تعديل الفرع"));
    }
});

// Delete Branch
router.delete("/deleteBranch/:id", [auth, admin, validateObjectId], async (req, res) => {
    try {
        let branch = await Branch.findOne({ _id: req.params.id });
        if (!branch)
            return res.status(404).send(createBaseResponse(null, false, 404, 0, null, "الفرع غير موجود"));

        branch = await Branch.findByIdAndDelete(req.params.id);
        
        res.send(createBaseResponse(branch, true, 200, 0, null, "تم حذف الفرع بنجاح"));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء حذف الفرع"));
    }
});

module.exports = router;
