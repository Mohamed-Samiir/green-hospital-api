const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const quistionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    answer: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
});

const Question = mongoose.model("Question", quistionSchema);

function validateQuestion(Question) {
    const schema = Joi.object({
        question: Joi.string()
            .min(3)
            .max(1000)
            .required(),
        answer: Joi.string()
            .min(3)
            .max(1000)
            .required()
    });

    return schema.validate(Question)
}

exports.Question = Question;
exports.validate = validateQuestion;
