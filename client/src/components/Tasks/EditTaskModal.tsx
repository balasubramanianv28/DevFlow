import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import DatePicker from "../../components/DatePicker";
import {
    updateTask,
    type Task,
} from "../../services/taskService";

interface Project {
    _id: string;
    name: string;
}

interface EditTaskModalProps {
    open: boolean;
    onClose: () => void;
    task: Task;
    projects: Project[];
    onUpdated: (task: Task) => void;
}

const EditTaskModal = ({
    open,
    onClose,
    task,
    projects,
    onUpdated,
}: EditTaskModalProps) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(
        task.description
    );
    const [project, setProject] = useState(task.project?._id || "");
    const [status, setStatus] = useState<
        "todo" | "in-progress" | "completed"
    >(task.status);
    const [priority, setPriority] = useState<
        "low" | "medium" | "high"
    >(task.priority);
    const [dueDate, setDueDate] = useState(
        task.dueDate
            ? task.dueDate.split("T")[0]
            : ""
    );

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [projectOpen, setProjectOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [priorityOpen, setPriorityOpen] = useState(false);

    if (!open) {
        return null;
    }

    const selectedProject = projects.find(
        (item) => item._id === project
    );

    const statusLabel = {
        todo: "To do",
        "in-progress": "In progress",
        completed: "Completed",
    };

    const priorityLabel = {
        low: "Low",
        medium: "Medium",
        high: "High",
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        if (!project) {
            setError("Please select a project");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const updatedTask = await updateTask(
                task._id,
                {
                    title: title.trim(),
                    description: description.trim(),
                    status,
                    priority,
                    dueDate: dueDate || null,
                    project,
                }
            );

            onUpdated(updatedTask);
            onClose();
        } catch (error) {
            console.error("Update task error:", error);

            setError(
                "Something went wrong while updating the task"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => {
                setProjectOpen(false);
                setStatusOpen(false);
                setPriorityOpen(false);
            }}
        >
            <div
                className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#111111] shadow-2xl shadow-black/50"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Edit task
                        </h2>

                        <p className="mt-1 text-xs text-white/35">
                            Update your task details.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.05] hover:text-white transition-all"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 px-6 py-6"
                >
                    {/* Title */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-white/60">
                            Task title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-orange-500/40 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-white/60">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows={3}
                            className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-orange-500/40 transition-all"
                        />
                    </div>

                    {/* Project */}
                    <div className="relative">
                        <label className="mb-2 block text-xs font-medium text-white/60">
                            Project
                        </label>

                        <button
                            type="button"
                            onClick={() => {
                                setProjectOpen(
                                    (prev) => !prev
                                );
                                setStatusOpen(false);
                                setPriorityOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-all ${projectOpen
                                ? "border-orange-500/40 bg-white/[0.03]"
                                : "border-white/[0.08] bg-white/[0.02]"
                                }`}
                        >
                            <span
                                className={
                                    selectedProject
                                        ? "text-white"
                                        : "text-white/25"
                                }
                            >
                                {selectedProject?.name ||
                                    "Select a project"}
                            </span>

                            <ChevronDown
                                size={16}
                                className={`text-white/30 transition-transform ${projectOpen
                                    ? "rotate-180"
                                    : ""
                                    }`}
                            />
                        </button>

                        {projectOpen && (
                            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#171717] p-1.5 shadow-2xl shadow-black/50">
                                {projects.length === 0 ? (
                                    <div className="px-3 py-3 text-xs text-white/30">
                                        No projects available
                                    </div>
                                ) : (
                                    projects.map((item) => (
                                        <button
                                            key={item._id}
                                            type="button"
                                            onClick={() => {
                                                setProject(
                                                    item._id
                                                );
                                                setProjectOpen(
                                                    false
                                                );
                                                setError("");
                                            }}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-all"
                                        >
                                            <span>
                                                {item.name}
                                            </span>

                                            {project ===
                                                item._id && (
                                                    <Check
                                                        size={15}
                                                        className="text-orange-500"
                                                    />
                                                )}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Status + Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div className="relative">
                            <label className="mb-2 block text-xs font-medium text-white/60">
                                Status
                            </label>

                            <button
                                type="button"
                                onClick={() => {
                                    setStatusOpen(
                                        (prev) => !prev
                                    );
                                    setProjectOpen(false);
                                    setPriorityOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-all ${statusOpen
                                    ? "border-orange-500/40 bg-white/[0.03]"
                                    : "border-white/[0.08] bg-white/[0.02]"
                                    }`}
                            >
                                <span className="text-white">
                                    {statusLabel[status]}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-white/30 transition-transform ${statusOpen
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                />
                            </button>

                            {statusOpen && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#171717] p-1.5 shadow-2xl shadow-black/50">
                                    {(
                                        [
                                            "todo",
                                            "in-progress",
                                            "completed",
                                        ] as const
                                    ).map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                setStatus(item);
                                                setStatusOpen(
                                                    false
                                                );
                                            }}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-all"
                                        >
                                            <span>
                                                {
                                                    statusLabel[
                                                    item
                                                    ]
                                                }
                                            </span>

                                            {status ===
                                                item && (
                                                    <Check
                                                        size={15}
                                                        className="text-orange-500"
                                                    />
                                                )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Priority */}
                        <div className="relative">
                            <label className="mb-2 block text-xs font-medium text-white/60">
                                Priority
                            </label>

                            <button
                                type="button"
                                onClick={() => {
                                    setPriorityOpen(
                                        (prev) => !prev
                                    );
                                    setProjectOpen(false);
                                    setStatusOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-all ${priorityOpen
                                    ? "border-orange-500/40 bg-white/[0.03]"
                                    : "border-white/[0.08] bg-white/[0.02]"
                                    }`}
                            >
                                <span className="text-white">
                                    {priorityLabel[priority]}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-white/30 transition-transform ${priorityOpen
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                />
                            </button>

                            {priorityOpen && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#171717] p-1.5 shadow-2xl shadow-black/50">
                                    {(
                                        [
                                            "low",
                                            "medium",
                                            "high",
                                        ] as const
                                    ).map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                setPriority(
                                                    item
                                                );
                                                setPriorityOpen(
                                                    false
                                                );
                                            }}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-all"
                                        >
                                            <span>
                                                {
                                                    priorityLabel[
                                                    item
                                                    ]
                                                }
                                            </span>

                                            {priority ===
                                                item && (
                                                    <Check
                                                        size={15}
                                                        className="text-orange-500"
                                                    />
                                                )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-white/60">
                            Due date
                        </label>

                        <DatePicker
                            value={dueDate}
                            onChange={(value) =>
                                setDueDate(value)
                            }
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-400">
                            {error}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-white/[0.08] px-4 py-2.5 text-sm text-white/50 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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

export default EditTaskModal;   