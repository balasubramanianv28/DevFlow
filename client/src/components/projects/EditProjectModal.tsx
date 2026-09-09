import { useState } from "react";
import { X } from "lucide-react";
import { updateProject } from "../../services/projectService";

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

interface EditProjectModalProps {
    open: boolean;
    project: Project | null;
    onClose: () => void;
    onUpdated: (project: Project) => void;
}

const EditProjectModal = ({
    open,
    project,
    onClose,
    onUpdated,
}: EditProjectModalProps) => {
    const [name, setName] = useState(project?.name || "");
    const [description, setDescription] = useState(
        project?.description || ""
    );
    const [status, setStatus] = useState<Project["status"]>(
        project?.status || "planning"
    );
    const [priority, setPriority] = useState<Project["priority"]>(
        project?.priority || "medium"
    );
    const [startDate, setStartDate] = useState(
        project?.startDate
            ? project.startDate.split("T")[0]
            : ""
    );
    const [dueDate, setDueDate] = useState(
        project?.dueDate
            ? project.dueDate.split("T")[0]
            : ""
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    if (!open || !project) {
        return null;
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!name.trim()) {
            setError("Project name is required");
            return;
        }

        if (
            startDate &&
            dueDate &&
            new Date(dueDate) < new Date(startDate)
        ) {
            setError("Due date cannot be before start date");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const updatedProject = await updateProject(
                project._id,
                {
                    name: name.trim(),
                    description: description.trim(),
                    status,
                    priority,
                    startDate: startDate || null,
                    dueDate: dueDate || null,
                }
            );

            onUpdated(updatedProject);
            onClose();
        } catch (error) {
            console.error(
                "Update project error:",
                error
            );

            setError(
                "Something went wrong while updating the project"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#111111] shadow-2xl shadow-black/60">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Edit project
                        </h2>

                        <p className="text-xs text-white/30 mt-1">
                            Update your project details.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
                    >
                        <X size={17} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                >
                    <div>
                        <label className="block text-xs text-white/50 mb-2">
                            Project name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-white/20 outline-none focus:border-orange-500/40 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-white/50 mb-2">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-white/20 outline-none focus:border-orange-500/40 transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-white/50 mb-2">
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value as Project["status"]
                                    )
                                }
                                className="w-full h-11 px-3 rounded-xl border border-white/[0.08] bg-[#151515] text-sm text-white/70 outline-none focus:border-orange-500/40"
                            >
                                <option value="planning">
                                    Planning
                                </option>
                                <option value="active">
                                    Active
                                </option>
                                <option value="completed">
                                    Completed
                                </option>
                                <option value="archived">
                                    Archived
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-white/50 mb-2">
                                Priority
                            </label>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value as Project["priority"]
                                    )
                                }
                                className="w-full h-11 px-3 rounded-xl border border-white/[0.08] bg-[#151515] text-sm text-white/70 outline-none focus:border-orange-500/40"
                            >
                                <option value="low">
                                    Low
                                </option>
                                <option value="medium">
                                    Medium
                                </option>
                                <option value="high">
                                    High
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-white/50 mb-2">
                                Start date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(e.target.value)
                                }
                                className="w-full h-11 px-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/70 outline-none focus:border-orange-500/40"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-white/50 mb-2">
                                Due date
                            </label>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) =>
                                    setDueDate(e.target.value)
                                }
                                className="w-full h-11 px-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/70 outline-none focus:border-orange-500/40"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-400">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-4 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="h-10 px-5 rounded-xl bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 disabled:opacity-50 transition-all"
                        >
                            {saving
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;