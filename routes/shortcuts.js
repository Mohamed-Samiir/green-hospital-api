const auth = require("../middleware/auth");
const { Shortcut, validate } = require("../models/shortcut");
const createBaseResponse = require('../startup/baseResponse')
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");

//get shortcuts
router.get("/getUserShortcuts", auth, async (req, res) => {
    const shortcuts = await Shortcut.find({ user: req.user._id })

    res.send(createBaseResponse(shortcuts, true, 200, 0));
})

//add Shortcut
router.post("/addShortcut", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let shortcut = await Shortcut.findOne({ name: req.body.name });
    if (shortcut)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "هناك اختصار بنفس الاسم"));

    let shortcutObj = { ...req.body, user: req.user._id }

    shortcut = new Shortcut(shortcutObj);
    await shortcut.save();

    res.send(createBaseResponse(shortcut, true, 200));
});

//delete Shortcut
router.delete("/deleteShortcut/:id", [auth, validateObjectId], async (req, res) => {
    let shortcut = await Shortcut.findOne({ _id: req.params.id });
    if (!shortcut)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "الاختصار غير موجود"));

    shortcut = await Shortcut.findByIdAndDelete(req.params.id,);

    res.send(createBaseResponse(shortcut, true, 200));
});


module.exports = router;
