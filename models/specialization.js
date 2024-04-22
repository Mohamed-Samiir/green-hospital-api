const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const subSpecializationsSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        minlength: 3,
        maxlength: 100
    }
})

const specializationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    subSpecializations: {
        type: [subSpecializationsSchema],
        validate: v => Array.isArray(v) && v.length > 0
    }
});

const Specialization = mongoose.model("Specialization", specializationSchema);

function validateSpecialization(specialization) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required(),
        subSpecializations: Joi.array()
            .required()
    });

    return schema.validate(specialization)
}

exports.Specialization = Specialization;
exports.validate = validateSpecialization;
