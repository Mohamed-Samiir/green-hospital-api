const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { BroadcastMessage, validate, validateMarkAsRead } = require("../models/broadcastMessage");
const { User } = require("../models/user");
const createBaseResponse = require('../startup/baseResponse');
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");

// Send broadcast message (admin only)
router.post("/send", [auth, admin], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, error.details[0].message, "يوجد خطأ بالمدخلات"));

        // Get sender information
        const sender = await User.findById(req.user._id);
        if (!sender)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "المستخدم غير موجود"));

        const broadcastMessage = new BroadcastMessage({
            message: req.body.message.trim(),
            sender: req.user._id,
            senderName: sender.name,
            readers: []
        });

        await broadcastMessage.save();

        // Emit to all connected users via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.emit('newBroadcast', {
                _id: broadcastMessage._id,
                message: broadcastMessage.message,
                senderName: broadcastMessage.senderName,
                createdAt: broadcastMessage.createdAt,
                isRead: false
            });
        }

        res.send(createBaseResponse(broadcastMessage, true, 200, 0, null, "تم إرسال الرسالة بنجاح"));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء إرسال الرسالة"));
    }
});

// Get all broadcast messages for current user
router.get("/getMessages", auth, async (req, res) => {
    try {
        const messages = await BroadcastMessage.find({ isActive: true })
            .sort({ createdAt: -1 })
            .select('message senderName createdAt readers')
            .lean();

        // Mark which messages are read by current user
        const messagesWithReadStatus = messages.map(message => ({
            ...message,
            isRead: message.readers.some(reader => reader.userId.toString() === req.user._id),
            readersCount: message.readers.length
        }));

        res.send(createBaseResponse(messagesWithReadStatus, true, 200, messagesWithReadStatus.length));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء جلب الرسائل"));
    }
});

// Mark message as read by current user
router.post("/markAsRead/:messageId", [auth, validateObjectId('messageId')], async (req, res) => {
    try {
        const message = await BroadcastMessage.findById(req.params.messageId);
        if (!message)
            return res.status(404).send(createBaseResponse(null, false, 404, 0, null, "الرسالة غير موجودة"));

        // Check if user already marked as read
        const alreadyRead = message.readers.some(reader => reader.userId.toString() === req.user._id);
        if (alreadyRead)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "تم تحديد الرسالة كمقروءة مسبقاً"));

        // Get user information
        const user = await User.findById(req.user._id);
        if (!user)
            return res.status(400).send(createBaseResponse(null, false, 400, 0, null, "المستخدم غير موجود"));

        // Add user to readers array
        message.readers.push({
            userId: req.user._id,
            userEmail: user.email,
            readAt: new Date()
        });

        await message.save();

        // Emit to admin users that message was read
        const io = req.app.get('io');
        if (io) {
            io.emit('messageRead', {
                messageId: message._id,
                userEmail: user.email,
                userName: user.name,
                readAt: new Date()
            });
        }

        res.send(createBaseResponse(null, true, 200, 0, null, "تم تحديد الرسالة كمقروءة"));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء تحديد الرسالة كمقروءة"));
    }
});

// Get readers of a specific message (admin only)
router.get("/getReaders/:messageId", [auth, admin, validateObjectId('messageId')], async (req, res) => {
    try {
        const message = await BroadcastMessage.findById(req.params.messageId)
            .select('readers message senderName createdAt')
            .populate('readers.userId', 'name email');

        if (!message)
            return res.status(404).send(createBaseResponse(null, false, 404, 0, null, "الرسالة غير موجودة"));

        const readersInfo = message.readers.map(reader => ({
            userEmail: reader.userEmail,
            userName: reader.userId ? reader.userId.name : 'مستخدم محذوف',
            readAt: reader.readAt
        }));

        const responseData = {
            messageId: message._id,
            message: message.message,
            senderName: message.senderName,
            createdAt: message.createdAt,
            readers: readersInfo,
            readersCount: readersInfo.length
        };

        res.send(createBaseResponse(responseData, true, 200, readersInfo.length));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء جلب قائمة القراء"));
    }
});

// Clear all broadcast messages (admin only)
router.delete("/clearHistory", [auth, admin], async (req, res) => {
    try {
        const result = await BroadcastMessage.deleteMany({});

        // Emit to all users that history was cleared
        const io = req.app.get('io');
        if (io) {
            io.emit('historyCleared');
        }

        res.send(createBaseResponse(null, true, 200, result.deletedCount, null, `تم حذف ${result.deletedCount} رسالة بنجاح`));
    } catch (error) {
        res.status(500).send(createBaseResponse(null, false, 500, 0, error.message, "حدث خطأ أثناء حذف الرسائل"));
    }
});

module.exports = router;
