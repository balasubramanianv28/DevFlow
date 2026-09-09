const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", protect, getTasks);

router.post("/", protect, createTask);

router.patch("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

module.exports = router;