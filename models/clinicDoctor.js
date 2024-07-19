const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const clinicDoctorSchema = new mongoose.Schema({
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
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
    freeVisitFollowup: {
        type: Boolean,
        required: true,
    },
    ageFrom: {
        type: Number,
        required: true,
        min: 1
    },
    ageFromUnit: {
        type: Number,
        required: true,
    },
    ageTo: {
        type: Number,
        min: 1
    },
    ageToUnit: {
        type: Number,
        required: true,
    },
    notes: {
        type: String,
        maxlength: 255
    }
});

const ClinicDoctor = mongoose.model("ClinicDoctor", clinicDoctorSchema);

function validateClinicDoctor(ClinicDoctor) {
    const schema = Joi.object({
        clinic: Joi.string()
            .required(),
        doctor: Joi.string()
            .required(),
        price: Joi.number()
            .required(),
        acceptInsurance: Joi.boolean()
            .required(),
        freeVisitFollowup: Joi.boolean()
            .required(),
        ageFrom: Joi.number()
            .min(1)
            .required(),
        ageFromUnit: Joi.number()
            .required(),
        ageTo: Joi.number()
            .min(1),
        ageToUnit: Joi.number(),
        notes: Joi.string()
            .optional()
            .allow(null)
            .allow("")
    });

    return schema.validate(ClinicDoctor)
}

exports.ClinicDoctor = ClinicDoctor;
exports.validate = validateClinicDoctor;
exports.ClinicDoctorSchema = clinicDoctorSchema
