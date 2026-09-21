const Notification = require("../models/Notification");

// =========================
// GET MY NOTIFICATIONS
// =========================

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            Recipient: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.log("Get Notifications Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// MARK AS READ
// =========================

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        if (
            notification.Recipient.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only update your own notifications"
            });
        }

        notification.IsRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.log("Mark Notification Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getMyNotifications,
    markAsRead
};