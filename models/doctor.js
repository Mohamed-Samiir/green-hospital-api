const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    degree: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    specialization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialization",
        required: true,
    },
    subSpecializations: {
        type: [String],
        validate: v => Array.isArray(v) && v.length > 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

function validateDoctor(Doctor) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required(),
        degree: Joi.string()
            .min(3)
            .max(100)
            .required(),
        specialization: Joi.string()
            .required(),
        subSpecializations: Joi.array()
            .required(),
        isActive: Joi.boolean()
    });

    return schema.validate(Doctor)
}

exports.Doctor = Doctor;
exports.validate = validateDoctor;
