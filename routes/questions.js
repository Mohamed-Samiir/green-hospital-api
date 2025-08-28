const auth = require("../middleware/auth");
const { Question, validate } = require("../models/question");
const createBaseResponse = require('../startup/baseResponse')
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");


//get Questions
router.get("/getQuestions", auth, async (req, res) => {
    const totalCount = await Question.countDocuments()
    const questions = await Question.find()

    res.send(createBaseResponse(questions, true, 200, totalCount));
})

//add Question
router.post("/addQuestion", [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let question = await Question.findOne({ question: req.body.question });
    if (question)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "السؤال مضاف بالفعل"));

    question = new Question(req.body);
    await question.save();

    res.send(createBaseResponse(question, true, 200));
});


//edit Question
router.post("/editQuestion/:id", [auth, admin, validateObjectId()], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, error, "يوجد خطأ بالمدخلات"));

    let question = await Question.findOne({ _id: req.params.id });
    if (!question)
        return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "السؤال غير موجود"));

    question = await Question.findByIdAndUpdate(req.params.id, { ...req.body });

    res.send(createBaseResponse(question, true, 200));
});

//delete Question
router.delete("/deleteQuestion/:id", [auth, admin, validateObjectId()], async (req, res) => {
    try {
        // First check if the question exists
        let question = await Question.findOne({ _id: req.params.id });
        if (!question)
            return res.status(404).send(createBaseResponse(null, false, 404, 0, null, "السؤال غير موجود"));

        // Delete the question
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        console.log("Deleted question:", deletedQuestion);

        res.send(createBaseResponse(deletedQuestion, true, 200, 0, null, "تم حذف السؤال بنجاح"));
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء حذف السؤال"));
    }
});

module.exports = router;
