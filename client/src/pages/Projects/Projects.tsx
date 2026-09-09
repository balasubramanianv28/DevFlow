import { ChevronDown, Edit3, Plus, Search, Trash2, } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateProjectModal from "../../components/projects/CreateProjectModal";
import EditProjectModal from "../../components/projects/EditProjectModal";
import { deleteProject } from "../../services/projectService";

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
const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<
        "all" | Project["status"]
    >("all");
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [createProjectOpen, setCreateProjectOpen] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const handleDeleteProject = async () => {
        if (!deleteProjectId) {
            return;
        }

        setDeleting(true);

        try {
            await deleteProject(deleteProjectId);

            setProjects((prev) =>
                prev.filter(
                    (project) =>
                        project._id !== deleteProjectId
                )
            );

            setDeleteProjectId(null);
        } catch (error) {
            console.error("Delete project error:", error);
        } finally {
            setDeleting(false);
        }
    };
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("devflow_token");

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/projects`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProjects(response.data.projects);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setProjectsLoading(false);
            }
        };

        fetchProjects();
    }, []);
    useEffect(() => {
        const handleClickOutside = () => {
            setStatusDropdownOpen(false);
        };

        if (statusDropdownOpen) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [statusDropdownOpen]);
    const filteredProjects = projects.filter((project) => {
        const query = searchQuery.toLowerCase().trim();

        const matchesSearch =
            !query ||
            project.name.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query);

        const matchesStatus =
            filterStatus === "all" ||
            project.status === filterStatus;

        return matchesSearch && matchesStatus;
    });
    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <main className="px-5 sm:px-7 lg:px-10 py-8 lg:py-10 max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                    <div>
                        <p className="text-orange-500 text-xs font-semibold uppercase tracking-[0.18em]">
                            Workspace
                        </p>

                        <h1 className="text-3xl lg:text-4xl font-bold tracking-[-0.035em] mt-3">
                            Projects
                        </h1>

                        <p className="text-sm text-white/35 mt-2">
                            Manage all your projects in one place.
                        </p>
                    </div>

                    <button
                        onClick={() => setCreateProjectOpen(true)}
                        className="w-fit h-11 px-4 rounded-xl bg-orange-500 text-black text-sm font-semibold flex items-center gap-2 hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/15 transition-all"
                    >
                        <Plus size={17} />
                        New project
                    </button>
                </div>

                {/* Toolbar */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                        />

                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-white/20 outline-none focus:border-orange-500/40 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setStatusDropdownOpen((prev) => !prev);
                            }}
                            className="h-11 min-w-[130px] px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/60 flex items-center justify-between gap-3 hover:border-white/[0.14] transition-all"
                        >
                            <span>
                                {filterStatus === "all"
                                    ? "All projects"
                                    : filterStatus.charAt(0).toUpperCase() +
                                    filterStatus.slice(1)}
                            </span>

                            <ChevronDown
                                size={16}
                                className={`text-white/30 transition-transform ${statusDropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {statusDropdownOpen && (
                            <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-full min-w-[150px] rounded-xl border border-white/[0.08] bg-[#111111] p-1.5 shadow-2xl shadow-black/50">
                                {[
                                    { value: "all", label: "All projects" },
                                    { value: "planning", label: "Planning" },
                                    { value: "active", label: "Active" },
                                    { value: "completed", label: "Completed" },
                                    { value: "archived", label: "Archived" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setFilterStatus(
                                                option.value as
                                                | "all"
                                                | Project["status"]
                                            );
                                            setStatusDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${filterStatus === option.value
                                            ? "bg-orange-500/10 text-orange-400"
                                            : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                                            }`}
                                    >
                                        <span>{option.label}</span>

                                        {filterStatus === option.value && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Projects List */}
                <div className="mt-5">
                    {projectsLoading ? (
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] min-h-[360px] flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] min-h-[360px] flex flex-col items-center justify-center text-center px-6">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/10 flex items-center justify-center">
                                <Plus size={24} className="text-orange-500" />
                            </div>

                            <h2 className="mt-5 font-semibold">
                                {projects.length === 0
                                    ? "No projects yet"
                                    : "No matching projects"}
                            </h2>

                            <p className="text-sm text-white/30 mt-2 max-w-[320px]">
                                {projects.length === 0
                                    ? "Create your first project and start turning ideas into progress."
                                    : "Try changing your search or status filter."}
                            </p>

                            <button
                                type="button"
                                onClick={() => setCreateProjectOpen(true)}
                                className="mt-5 h-10 px-4 rounded-xl bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition-all"
                            >
                                Create project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project._id}
                                    className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5 hover:border-orange-500/20 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h2 className="font-semibold truncate">
                                                {project.name}
                                            </h2>

                                            {project.description && (
                                                <p className="text-sm text-white/30 mt-2 line-clamp-2">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditProject(project);
                                            }}
                                            className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-orange-500 hover:border-orange-500/20 transition-all"
                                            title="Edit project"
                                        >
                                            <Edit3 size={14} />
                                        </button>

                                        <button
                                            type="button"
                                            className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-red-500 hover:border-red-500/20 transition-all"
                                            onClick={() => {
                                                setDeleteProjectId(project._id);
                                            }}
                                            title="Delete project"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <span
                                            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-medium capitalize ${project.status === "active"
                                                ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                                                : project.status === "completed"
                                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                    : project.status === "archived"
                                                        ? "text-white/40 bg-white/[0.04] border-white/[0.08]"
                                                        : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                                                }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${project.status === "active"
                                                    ? "bg-orange-400"
                                                    : project.status === "completed"
                                                        ? "bg-emerald-400"
                                                        : project.status === "archived"
                                                            ? "bg-white/30"
                                                            : "bg-yellow-400"
                                                    }`}
                                            />

                                            {project.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-5">
                                        <span
                                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-medium capitalize ${project.priority === "high"
                                                ? "text-red-400 bg-red-500/10 border-red-500/20"
                                                : project.priority === "medium"
                                                    ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                                                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                }`}
                                        >
                                            {project.priority} priority
                                        </span>
                                    </div>

                                    {(project.startDate || project.dueDate) && (
                                        <div className="flex items-center gap-8 mt-5 pt-4 border-t border-white/[0.05]">
                                            {project.startDate && (
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                                                        Start date
                                                    </p>

                                                    <p className="text-xs text-white/50 mt-1">
                                                        {new Date(
                                                            project.startDate
                                                        ).toLocaleDateString("en-GB")}
                                                    </p>
                                                </div>
                                            )}

                                            {project.dueDate && (
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                                                        Due date
                                                    </p>

                                                    <p className="text-xs text-white/50 mt-1">
                                                        {new Date(
                                                            project.dueDate
                                                        ).toLocaleDateString("en-GB")}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <CreateProjectModal
                    open={createProjectOpen}
                    onClose={() => setCreateProjectOpen(false)}
                    onCreated={(project) => {
                        setProjects((prev) => [project, ...prev]);
                    }}
                />
                <EditProjectModal
                    key={editProject?._id ?? "edit"}
                    open={editProject !== null}
                    project={editProject}
                    onClose={() => setEditProject(null)}
                    onUpdated={(updatedProject) => {
                        setProjects((prev) =>
                            prev.map((project) =>
                                project._id === updatedProject._id
                                    ? updatedProject
                                    : project
                            )
                        );
                    }}
                />
                {deleteProjectId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111111] p-6 shadow-2xl">
                            <h2 className="text-lg font-semibold text-white">
                                Delete project?
                            </h2>

                            <p className="mt-2 text-sm text-white/50">
                                Are you sure you want to delete this project?
                                This action cannot be undone.
                            </p>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteProjectId(null)}
                                    disabled={deleting}
                                    className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteProject}
                                    disabled={deleting}
                                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main >
        </div >
    );
};

export default Projects;