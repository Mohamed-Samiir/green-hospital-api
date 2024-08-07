const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const procedureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    doctors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Doctor",
        validate: v => Array.isArray(v) && v.length > 0
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
    },
    notes: {
        type: String,
        maxlength: 255
    }
});

const Procedure = mongoose.model("Procedure", procedureSchema);

function validateProcedure(Procedure) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required(),
        doctors: Joi.array()
            .required(),
        price: Joi.number()
            .required(),
        acceptInsurance: Joi.boolean()
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
    });

    return schema.validate(Procedure)
}

exports.Procedure = Procedure;
exports.validate = validateProcedure;
