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
    phoneNumbers: {
        type: [String],
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
        phoneNumbers: Joi.array(),
        allowContact: Joi.boolean(),
        contactPeriods: Joi.string()
            .required()
            .max(255)
            .min(3)
    });

    return schema.validate(Department)
}

exports.Department = Department;
exports.validate = validateDepartment;
