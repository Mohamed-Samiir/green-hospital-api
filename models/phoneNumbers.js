const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const phoneNumberSchema = new mongoose.Schema({
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
});

const PhoneNumber = mongoose.model("PhoneNumber", phoneNumberSchema);

function validatePhoneNumber(PhoneNumber) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required(),
        phoneNumber: Joi.string()
            .required()
    });

    return schema.validate(PhoneNumber)
}

exports.PhoneNumber = PhoneNumber;
exports.validate = validatePhoneNumber;
