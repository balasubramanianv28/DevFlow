const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", protect, getProjects);

router.post("/", protect, createProject);

router.patch("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);
module.exports = router;