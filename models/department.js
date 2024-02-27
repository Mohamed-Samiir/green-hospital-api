const config = require("config");
const Joi = require("joi");
const { join } = require("lodash");
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    allowContact: {
        type: Boolean,
        default: true
    },
    contactPeriods: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
});

const Department = mongoose.model("Department", departmentSchema);

function validateDepartment(Department) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required(),
        phoneNumber: Joi.string()
            .required(),
        allowContact: Joi.boolean(),
        contactPeriods: Joi.string()
            .require()
            .maxlength(255)
            .minlength(3)
    });

    return schema.validate(Department)
}

exports.Department = Department;
exports.validate = validateDepartment;
