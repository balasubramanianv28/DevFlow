const Task = require("../models/Task");
const Project = require("../models/Project");

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate,
            project,
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        if (!project) {
            return res.status(400).json({
                success: false,
                message: "Project is required",
            });
        }

        const projectExists = await Project.findOne({
            _id: project,
            owner: req.userId,
        });

        if (!projectExists) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || "",
            status: status || "todo",
            priority: priority || "medium",
            dueDate: dueDate || null,
            project,
            owner: req.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        console.error("Create task error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the task",
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const { project } = req.query;

        const filter = {
            owner: req.userId,
        };

        if (project) {
            filter.project = project;
        }

        const tasks = await Task.find(filter)
            .populate("project", "name")
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        console.error("Get tasks error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching tasks",
        });
    }
};
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            status,
            priority,
            dueDate,
            project,
        } = req.body;

        const task = await Task.findOne({
            _id: id,
            owner: req.userId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (project !== undefined) {
            const projectExists = await Project.findOne({
                _id: project,
                owner: req.userId,
            });

            if (!projectExists) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found",
                });
            }

            task.project = project;
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Task title is required",
                });
            }

            task.title = title.trim();
        }

        if (description !== undefined) {
            task.description = description.trim();
        }

        if (status !== undefined) {
            task.status = status;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate || null;
        }

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate("project", "name");

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        console.error("Update task error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the task",
        });
    }
};
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({
            _id: id,
            owner: req.userId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Delete task error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the task",
        });
    }
};
module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};