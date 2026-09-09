const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
    try {
        const { title, message, type } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required",
            });
        }

        const notification = await Notification.create({
            user: req.userId,
            title: title.trim(),
            message: message.trim(),
            type: type || "system",
        });

        return res.status(201).json({
            success: true,
            message: "Notification created successfully",
            notification,
        });
    } catch (error) {
        console.error("Create notification error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating notification",
        });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.userId,
            isRead: false,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching notifications",
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            {
                _id: id,
                user: req.userId,
            },
            {
                isRead: true,
            },
            {
                new: true,
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        console.error("Mark notification as read error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating notification",
        });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                user: req.userId,
                isRead: false,
            },
            {
                isRead: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error(
            "Mark all notifications as read error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating notifications",
        });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};