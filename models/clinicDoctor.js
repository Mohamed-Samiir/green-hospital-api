const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const clinicDoctorSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        require: true
    },
    price: {
        type: Number,
        required: true,
        max: 2000,
        min: 50
    },
    acceptInsurance: {
        type: Boolean,
        required: true,
    },
    freeOperationFollowup: {
        type: Boolean,
        required: true,
    },
    ageFrom: {
        type: Number,
        required: true,
        min: 1
    },
    ageFromUnit: {
        type: String,
        required: true,
    },
    ageTo: {
        type: Number,
        min: 1
    },
    ageToUnit: {
        type: String,
    },
    notes: {
        type: String,
        maxlength: 255
    }
});

const ClinicDoctor = mongoose.model("ClinicDoctor", clinicDoctorSchema);

function validateClinicDoctor(ClinicDoctor) {
    const schema = Joi.object({
        name: Joi.string()
            .minLength(3)
            .max(100)
            .required(),
        price: Joi.number()
            .required(),
        acceptInsurance: Joi.boolean()
            .required(),
        freeOperationFollowup: Joi.boolean()
            .required(),
        ageFrom: Joi.number()
            .min(1)
            .required(),
        ageFromUnit: Joi.string()
            .required(),
        ageTo: Joi.number()
            .min(1),
        ageToUnit: Joi.string()
    });

    return schema.validate(ClinicDoctor)
}

exports.ClinicDoctor = ClinicDoctor;
exports.validate = validateClinicDoctor;
