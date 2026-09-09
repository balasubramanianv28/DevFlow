const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/", protect, createNotification);
router.patch("/:id/read", protect, markNotificationAsRead);
router.patch("/read-all", protect, markAllNotificationsAsRead);

module.exports = router;