const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema({
    label: {
        type: String,
    },
    value: {}
})

const shortcutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    route: {
        type: String,
        required: true,
        minlength: 5
    },
    filters: [filterSchema]
});

const Shortcut = mongoose.model("Shortcut", shortcutSchema);

function validateShortcut(Shortcut) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required(),
        route: Joi.string()
            .min(5)
            .required(),
        filters: Joi.array()
            .required()
    });

    return schema.validate(Shortcut)
}

exports.Shortcut = Shortcut;
exports.validate = validateShortcut;
