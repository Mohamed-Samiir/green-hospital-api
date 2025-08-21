const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const broadcastMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000,
        trim: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    readers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Index for better query performance
broadcastMessageSchema.index({ createdAt: -1 });
broadcastMessageSchema.index({ sender: 1 });
broadcastMessageSchema.index({ "readers.userId": 1 });

const BroadcastMessage = mongoose.model("BroadcastMessage", broadcastMessageSchema);

function validateBroadcastMessage(broadcastMessage) {
    const schema = Joi.object({
        message: Joi.string()
            .min(1)
            .max(1000)
            .required()
            .messages({
                'string.empty': 'يجب إدخال نص الرسالة',
                'string.min': 'يجب أن تحتوي الرسالة على حرف واحد على الأقل',
                'string.max': 'يجب أن لا تتجاوز الرسالة 1000 حرف',
                'any.required': 'نص الرسالة مطلوب'
            })
    });

    return schema.validate(broadcastMessage);
}

function validateMarkAsRead(data) {
    const schema = Joi.object({
        messageId: Joi.string()
            .required()
            .messages({
                'any.required': 'معرف الرسالة مطلوب'
            })
    });

    return schema.validate(data);
}

exports.BroadcastMessage = BroadcastMessage;
exports.validate = validateBroadcastMessage;
exports.validateMarkAsRead = validateMarkAsRead;
exports.BroadcastMessageSchema = broadcastMessageSchema;
