const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Branch = mongoose.model("Branch", branchSchema);

function validateBranch(branch) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .required(),
        address: Joi.string()
            .min(5)
            .max(200)
            .required()
    });

    return schema.validate(branch);
}

exports.Branch = Branch;
exports.validate = validateBranch;
