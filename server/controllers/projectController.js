const Project = require("../models/Project");
const Notification = require("../models/Notification");
const createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            status,
            priority,
            startDate,
            dueDate,
        } = req.body;

        // Required field
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name is required",
            });
        }

        // Create project
        const project = await Project.create({
            name: name.trim(),
            description: description?.trim() || "",
            status: status || "planning",
            priority: priority || "medium",
            startDate: startDate || null,
            dueDate: dueDate || null,
            owner: req.userId,
        });

        await Notification.create({
            user: req.userId,
            title: "Project created",
            message: `"${project.name}" was created successfully.`,
            type: "project",
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Create project error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the project",
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.userId,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error("Get projects error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching projects",
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            status,
            priority,
            startDate,
            dueDate,
        } = req.body;

        const project = await Project.findOne({
            _id: id,
            owner: req.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Project name is required",
                });
            }

            project.name = name.trim();
        }

        if (description !== undefined) {
            project.description = description.trim();
        }

        if (status !== undefined) {
            project.status = status;
        }

        if (priority !== undefined) {
            project.priority = priority;
        }

        if (startDate !== undefined) {
            project.startDate = startDate || null;
        }

        if (dueDate !== undefined) {
            project.dueDate = dueDate || null;
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Update project error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the project",
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findOneAndDelete({
            _id: id,
            owner: req.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the project",
        });
    }
};
module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
};