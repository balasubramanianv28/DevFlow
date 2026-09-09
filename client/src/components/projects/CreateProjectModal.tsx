import { useState } from "react";
import axios from "axios";
import { ChevronDown, X } from "lucide-react";
import DatePicker from "../DatePicker";

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (project: Project) => void;
}

interface Project {
    _id: string;
    name: string;
    description: string;
    status: "planning" | "active" | "completed" | "archived";
    priority: "low" | "medium" | "high";
    startDate: string | null;
    dueDate: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

const CreateProjectModal = ({
    open,
    onClose,
    onCreated,
}: CreateProjectModalProps) => {
    const [projectForm, setProjectForm] = useState({
        name: "",
        description: "",
        status: "planning" as Project["status"],
        priority: "medium" as Project["priority"],
        startDate: "",
        dueDate: "",
    });

    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

    if (!open) return null;

    const handleCreateProject = async () => {
        setCreateError("");

        if (!projectForm.name.trim()) {
            setCreateError("Project name is required");
            return;
        }

        if (
            projectForm.startDate &&
            projectForm.dueDate &&
            projectForm.dueDate < projectForm.startDate
        ) {
            setCreateError(
                "Due date cannot be earlier than the start date"
            );
            return;
        }

        try {
            setIsCreating(true);

            const token = localStorage.getItem("devflow_token");

            const response = await axios.post(
                "http://localhost:5000/api/projects",
                {
                    name: projectForm.name.trim(),
                    description: projectForm.description.trim(),
                    status: projectForm.status,
                    priority: projectForm.priority,
                    startDate: projectForm.startDate || null,
                    dueDate: projectForm.dueDate || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onCreated(response.data.project);

            setProjectForm({
                name: "",
                description: "",
                status: "planning",
                priority: "medium",
                startDate: "",
                dueDate: "",
            });

            onClose();
        } catch (error) {
            console.error("Failed to create project:", error);
            setCreateError(
                "Failed to create project. Please try again."
            );
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#111111] shadow-2xl shadow-black/50">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Create project
                        </h2>

                        <p className="text-xs text-white/30 mt-1">
                            Add a new project to your workspace.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-2">
                            Project name
                        </label>

                        <input
                            type="text"
                            value={projectForm.name}
                            onChange={(e) =>
                                setProjectForm({
                                    ...projectForm,
                                    name: e.target.value,
                                })
                            }
                            placeholder="e.g. Client Portal"
                            className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-white/20 outline-none focus:border-orange-500/40 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-2">
                            Description
                        </label>

                        <textarea
                            value={projectForm.description}
                            onChange={(e) =>
                                setProjectForm({
                                    ...projectForm,
                                    description: e.target.value,
                                })
                            }
                            placeholder="What is this project about?"
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-white/20 outline-none resize-none focus:border-orange-500/40 transition-all"
                        />
                    </div>

                    {/* Status + Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Status
                            </label>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatusDropdownOpen(
                                            !statusDropdownOpen
                                        );
                                        setPriorityDropdownOpen(false);
                                    }}
                                    className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white flex items-center justify-between"
                                >
                                    <span className="capitalize">
                                        {projectForm.status}
                                    </span>

                                    <ChevronDown size={16} />
                                </button>

                                {statusDropdownOpen && (
                                    <div className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-50 rounded-xl border border-white/[0.08] bg-[#111111] p-1.5 shadow-2xl shadow-black/60">
                                        {[
                                            "planning",
                                            "active",
                                            "completed",
                                            "archived",
                                        ].map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => {
                                                    setProjectForm({
                                                        ...projectForm,
                                                        status:
                                                            status as Project["status"],
                                                    });
                                                    setStatusDropdownOpen(
                                                        false
                                                    );
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm capitalize text-white/55 hover:bg-white/[0.05] hover:text-white"
                                            >
                                                <span>{status}</span>

                                                {projectForm.status ===
                                                    status && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                    )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Priority
                            </label>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPriorityDropdownOpen(
                                            !priorityDropdownOpen
                                        );
                                        setStatusDropdownOpen(false);
                                    }}
                                    className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white flex items-center justify-between"
                                >
                                    <span className="capitalize">
                                        {projectForm.priority}
                                    </span>

                                    <ChevronDown size={16} />
                                </button>

                                {priorityDropdownOpen && (
                                    <div className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-50 rounded-xl border border-white/[0.08] bg-[#111111] p-1.5 shadow-2xl shadow-black/60">
                                        {["low", "medium", "high"].map(
                                            (priority) => (
                                                <button
                                                    key={priority}
                                                    type="button"
                                                    onClick={() => {
                                                        setProjectForm({
                                                            ...projectForm,
                                                            priority:
                                                                priority as Project["priority"],
                                                        });
                                                        setPriorityDropdownOpen(
                                                            false
                                                        );
                                                    }}
                                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm capitalize text-white/55 hover:bg-white/[0.05] hover:text-white"
                                                >
                                                    <span>{priority}</span>

                                                    {projectForm.priority ===
                                                        priority && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                        )}
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Start date
                            </label>

                            <DatePicker
                                value={projectForm.startDate}
                                onChange={(value) =>
                                    setProjectForm({
                                        ...projectForm,
                                        startDate: value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-2">
                                Due date
                            </label>

                            <DatePicker
                                value={projectForm.dueDate}
                                onChange={(value) =>
                                    setProjectForm({
                                        ...projectForm,
                                        dueDate: value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        {createError && (
                            <p className="text-xs text-red-400 mr-auto self-center">
                                {createError}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 px-5 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleCreateProject}
                            disabled={isCreating}
                            className="h-11 px-5 rounded-xl bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition-all disabled:opacity-50"
                        >
                            {isCreating
                                ? "Creating..."
                                : "Create project"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;