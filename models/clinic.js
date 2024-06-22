const config = require("config");
const Joi = require("joi");
const { ClinicDoctorSchema } = require('./clinicDoctor');
const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    }
});

const Clinic = mongoose.model("Clinic", clinicSchema);

function validateClinic(Clinic) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required()
    });

    return schema.validate(Clinic)
}

exports.Clinic = Clinic;
exports.validate = validateClinic;
