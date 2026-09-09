import {
    CheckCircle2,
    ChevronDown,
    Circle,
    Clock3,
    Edit,
    Filter,
    ListTodo,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import CreateTaskModal from "../../components/Tasks/CreateTaskModal";
import EditTaskModal from "../../components/Tasks/EditTaskModal";

import {
    getProjects,
    type Project,
} from "../../services/projectService";

import {
    deleteTask,
    getTasks,
    updateTask,
    type Task,
} from "../../services/taskService";

type StatusFilter =
    | "all"
    | "todo"
    | "in-progress"
    | "completed";

type PriorityFilter =
    | "all"
    | "low"
    | "medium"
    | "high";

type SortOption =
    | "newest"
    | "oldest"
    | "due-date"
    | "priority"
    | "updated";

interface DropdownOption {
    value: string;
    label: string;
}

const Tasks = () => {
    /* =========================
       STATE
    ========================= */

    const [createTaskOpen, setCreateTaskOpen] =
        useState(false);

    const [editTask, setEditTask] =
        useState<Task | null>(null);

    const [deleteTaskTarget, setDeleteTaskTarget] =
        useState<Task | null>(null);

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [tasks, setTasks] =
        useState<Task[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [deleting, setDeleting] =
        useState(false);

    const [updatingStatus, setUpdatingStatus] =
        useState<string | null>(null);

    const [updatingPriority, setUpdatingPriority] =
        useState<string | null>(null);

    const [openDropdown, setOpenDropdown] =
        useState<string | null>(null);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const [priorityFilter, setPriorityFilter] =
        useState<PriorityFilter>("all");

    const [projectFilter, setProjectFilter] =
        useState("all");

    const [sortBy, setSortBy] =
        useState<SortOption>("newest");

    const [currentPage, setCurrentPage] =
        useState(1);

    const tasksPerPage = 10;

    /* =========================
       CLOSE DROPDOWNS
    ========================= */

    useEffect(() => {
        const handleClick = () => {
            setOpenDropdown(null);
        };

        document.addEventListener(
            "click",
            handleClick
        );

        return () => {
            document.removeEventListener(
                "click",
                handleClick
            );
        };
    }, []);

    /* =========================
       FETCH PROJECTS
    ========================= */

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error(
                    "Fetch projects error:",
                    error
                );
            }
        };

        fetchProjects();
    }, []);

    /* =========================
       FETCH TASKS
    ========================= */

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);

                const data = await getTasks();

                setTasks(data);
            } catch (error) {
                console.error(
                    "Fetch tasks error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    /* =========================
       FILTER TASKS
    ========================= */

    const filteredTasks = useMemo(() => {
        const query =
            searchQuery.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                !query ||
                task.title
                    .toLowerCase()
                    .includes(query) ||
                task.description
                    ?.toLowerCase()
                    .includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "all" ||
                task.priority === priorityFilter;

            const matchesProject =
                projectFilter === "all" ||
                task.project?._id === projectFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesProject
            );
        });
    }, [
        tasks,
        searchQuery,
        statusFilter,
        priorityFilter,
        projectFilter,
    ]);

    /* =========================
       SORT TASKS
    ========================= */

    const sortedTasks = useMemo(() => {
        const priorityOrder: Record<
            "low" | "medium" | "high",
            number
        > = {
            high: 1,
            medium: 2,
            low: 3,
        };

        return [...filteredTasks].sort(
            (a, b) => {
                switch (sortBy) {
                    case "oldest":
                        return (
                            new Date(
                                a.createdAt
                            ).getTime() -
                            new Date(
                                b.createdAt
                            ).getTime()
                        );

                    case "due-date": {
                        if (
                            !a.dueDate &&
                            !b.dueDate
                        ) {
                            return 0;
                        }

                        if (!a.dueDate) {
                            return 1;
                        }

                        if (!b.dueDate) {
                            return -1;
                        }

                        return (
                            new Date(
                                a.dueDate
                            ).getTime() -
                            new Date(
                                b.dueDate
                            ).getTime()
                        );
                    }

                    case "priority":
                        return (
                            priorityOrder[
                            a.priority
                            ] -
                            priorityOrder[
                            b.priority
                            ]
                        );

                    case "updated":
                        return (
                            new Date(
                                b.updatedAt
                            ).getTime() -
                            new Date(
                                a.updatedAt
                            ).getTime()
                        );

                    case "newest":
                    default:
                        return (
                            new Date(
                                b.createdAt
                            ).getTime() -
                            new Date(
                                a.createdAt
                            ).getTime()
                        );
                }
            }
        );
    }, [filteredTasks, sortBy]);

    /* =========================
       PAGINATION
    ========================= */

    const totalPages = Math.ceil(
        sortedTasks.length / tasksPerPage
    );

    const safeCurrentPage =
        totalPages > 0
            ? Math.min(
                currentPage,
                totalPages
            )
            : 1;

    const paginatedTasks = useMemo(() => {
        const startIndex =
            (safeCurrentPage - 1) *
            tasksPerPage;

        return sortedTasks.slice(
            startIndex,
            startIndex + tasksPerPage
        );
    }, [
        sortedTasks,
        safeCurrentPage,
    ]);

    const pageNumbers = useMemo(() => {
        const pages: number[] = [];

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {
            pages.push(page);
        }

        return pages;
    }, [totalPages]);

    /* =========================
       COUNTS
    ========================= */

    const counts = useMemo(
        () => ({
            total: tasks.length,

            todo: tasks.filter(
                (task) =>
                    task.status === "todo"
            ).length,

            inProgress: tasks.filter(
                (task) =>
                    task.status ===
                    "in-progress"
            ).length,

            completed: tasks.filter(
                (task) =>
                    task.status ===
                    "completed"
            ).length,
        }),
        [tasks]
    );

    /* =========================
       HELPERS
    ========================= */

    const hasFilters =
        searchQuery.trim() !== "" ||
        statusFilter !== "all" ||
        priorityFilter !== "all" ||
        projectFilter !== "all";

    const selectedProject =
        projects.find(
            (project) =>
                project._id === projectFilter
        );

    const resetPage = () => {
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setPriorityFilter("all");
        setProjectFilter("all");
        setCurrentPage(1);
        setOpenDropdown(null);
    };

    const getStatusLabel = (
        status: Task["status"]
    ) => {
        if (status === "todo") {
            return "To do";
        }

        if (status === "in-progress") {
            return "In progress";
        }

        return "Completed";
    };

    const getPriorityLabel = (
        priority: Task["priority"]
    ) => {
        if (priority === "low") {
            return "Low";
        }

        if (priority === "medium") {
            return "Medium";
        }

        return "High";
    };

    const getSortLabel = (
        sort: SortOption
    ) => {
        if (sort === "oldest") {
            return "Oldest first";
        }

        if (sort === "due-date") {
            return "Due date";
        }

        if (sort === "priority") {
            return "Priority";
        }

        if (sort === "updated") {
            return "Recently updated";
        }

        return "Newest first";
    };

    const getStatusStyle = (
        status: Task["status"]
    ) => {
        if (status === "todo") {
            return "border-white/[0.08] bg-white/[0.03] text-white/55";
        }

        if (status === "in-progress") {
            return "border-orange-500/20 bg-orange-500/10 text-orange-400";
        }

        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    };

    const getPriorityStyle = (
        priority: Task["priority"]
    ) => {
        if (priority === "low") {
            return "border-white/[0.08] bg-white/[0.03] text-white/45";
        }

        if (priority === "medium") {
            return "border-orange-500/20 bg-orange-500/10 text-orange-400";
        }

        return "border-red-500/20 bg-red-500/10 text-red-400";
    };

    const getDueDate = (task: Task) => {
        if (!task.dueDate) {
            return null;
        }

        const date = new Date(
            task.dueDate
        );

        const today = new Date();

        const dateOnly = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ).getTime();

        const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        ).getTime();

        const formatted =
            date.toLocaleDateString(
                undefined,
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        if (
            task.status !== "completed" &&
            dateOnly < todayOnly
        ) {
            return {
                label: "Overdue",
                style:
                    "border-red-500/20 bg-red-500/10 text-red-400",
            };
        }

        if (
            task.status !== "completed" &&
            dateOnly === todayOnly
        ) {
            return {
                label: "Due today",
                style:
                    "border-orange-500/20 bg-orange-500/10 text-orange-400",
            };
        }

        return {
            label: formatted,
            style:
                "border-white/[0.06] bg-white/[0.02] text-white/35",
        };
    };

    /* =========================
       STATUS UPDATE
    ========================= */

    const handleStatusChange = async (
        task: Task,
        status:
            | "todo"
            | "in-progress"
            | "completed"
    ) => {
        if (task.status === status) {
            setOpenDropdown(null);
            return;
        }

        try {
            setUpdatingStatus(task._id);
            setOpenDropdown(null);

            const updatedTask =
                await updateTask(
                    task._id,
                    {
                        status,
                    }
                );

            setTasks((prev) =>
                prev.map((item) =>
                    item._id ===
                        updatedTask._id
                        ? updatedTask
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Update status error:",
                error
            );

            window.alert(
                "Unable to update task status."
            );
        } finally {
            setUpdatingStatus(null);
        }
    };

    /* =========================
       PRIORITY UPDATE
    ========================= */

    const handlePriorityChange = async (
        task: Task,
        priority:
            | "low"
            | "medium"
            | "high"
    ) => {
        if (task.priority === priority) {
            setOpenDropdown(null);
            return;
        }

        try {
            setUpdatingPriority(task._id);
            setOpenDropdown(null);

            const updatedTask =
                await updateTask(
                    task._id,
                    {
                        priority,
                    }
                );

            setTasks((prev) =>
                prev.map((item) =>
                    item._id ===
                        updatedTask._id
                        ? updatedTask
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Update priority error:",
                error
            );

            window.alert(
                "Unable to update task priority."
            );
        } finally {
            setUpdatingPriority(null);
        }
    };

    /* =========================
       DELETE TASK
    ========================= */

    const handleDeleteTask = async () => {
        if (!deleteTaskTarget) {
            return;
        }

        try {
            setDeleting(true);

            await deleteTask(
                deleteTaskTarget._id
            );

            setTasks((prev) =>
                prev.filter(
                    (task) =>
                        task._id !==
                        deleteTaskTarget._id
                )
            );

            setDeleteTaskTarget(null);
            setCurrentPage(1);
        } catch (error) {
            console.error(
                "Delete task error:",
                error
            );

            window.alert(
                "Unable to delete this task."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="space-y-6 px-4 py-5 sm:px-6">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-white">
                                Tasks
                            </h1>

                            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/40">
                                {counts.total}
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-white/40">
                            Manage and track your
                            project tasks.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setCreateTaskOpen(true)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-black shadow-lg shadow-orange-500/10 transition hover:bg-orange-400"
                    >
                        <Plus size={16} />
                        New Task
                    </button>
                </div>

                {/* =========================
                    STATS
                ========================= */}

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard
                        label="Total Tasks"
                        value={counts.total}
                        icon={
                            <ListTodo size={17} />
                        }
                    />

                    <StatCard
                        label="To Do"
                        value={counts.todo}
                        icon={
                            <Circle size={17} />
                        }
                    />

                    <StatCard
                        label="In Progress"
                        value={counts.inProgress}
                        icon={
                            <Clock3 size={17} />
                        }
                        accent="orange"
                    />

                    <StatCard
                        label="Completed"
                        value={counts.completed}
                        icon={
                            <CheckCircle2
                                size={17}
                            />
                        }
                        accent="green"
                    />
                </div>

                {/* =========================
                    SEARCH + FILTERS
                ========================= */}

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">

                    <div className="flex flex-col gap-3 xl:flex-row">

                        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3">

                            <Search
                                size={16}
                                className="shrink-0 text-white/30"
                            />

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(
                                        event.target.value
                                    );
                                    resetPage();
                                }}
                                placeholder="Search tasks..."
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        resetPage();
                                    }}
                                    className="text-white/25 transition hover:text-white/60"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">

                            <FilterDropdown
                                id="status-filter"
                                label={
                                    statusFilter ===
                                        "all"
                                        ? "All Status"
                                        : getStatusLabel(
                                            statusFilter
                                        )
                                }
                                icon={
                                    <Filter size={14} />
                                }
                                openDropdown={
                                    openDropdown
                                }
                                setOpenDropdown={
                                    setOpenDropdown
                                }
                                options={[
                                    {
                                        value: "all",
                                        label: "All Status",
                                    },
                                    {
                                        value: "todo",
                                        label: "To do",
                                    },
                                    {
                                        value: "in-progress",
                                        label: "In progress",
                                    },
                                    {
                                        value: "completed",
                                        label: "Completed",
                                    },
                                ]}
                                selected={
                                    statusFilter
                                }
                                onSelect={(value) => {
                                    setStatusFilter(
                                        value as StatusFilter
                                    );
                                    resetPage();
                                }}
                                active={
                                    statusFilter !==
                                    "all"
                                }
                            />

                            <FilterDropdown
                                id="priority-filter"
                                label={
                                    priorityFilter ===
                                        "all"
                                        ? "All Priority"
                                        : getPriorityLabel(
                                            priorityFilter
                                        )
                                }
                                openDropdown={
                                    openDropdown
                                }
                                setOpenDropdown={
                                    setOpenDropdown
                                }
                                options={[
                                    {
                                        value: "all",
                                        label: "All Priority",
                                    },
                                    {
                                        value: "low",
                                        label: "Low",
                                    },
                                    {
                                        value: "medium",
                                        label: "Medium",
                                    },
                                    {
                                        value: "high",
                                        label: "High",
                                    },
                                ]}
                                selected={
                                    priorityFilter
                                }
                                onSelect={(value) => {
                                    setPriorityFilter(
                                        value as PriorityFilter
                                    );
                                    resetPage();
                                }}
                                active={
                                    priorityFilter !==
                                    "all"
                                }
                            />

                            <FilterDropdown
                                id="project-filter"
                                label={
                                    selectedProject
                                        ?.name ||
                                    "All Projects"
                                }
                                openDropdown={
                                    openDropdown
                                }
                                setOpenDropdown={
                                    setOpenDropdown
                                }
                                options={[
                                    {
                                        value: "all",
                                        label: "All Projects",
                                    },
                                    ...projects.map(
                                        (
                                            project
                                        ) => ({
                                            value:
                                                project._id,
                                            label:
                                                project.name,
                                        })
                                    ),
                                ]}
                                selected={
                                    projectFilter
                                }
                                onSelect={(value) => {
                                    setProjectFilter(
                                        value
                                    );
                                    resetPage();
                                }}
                                active={
                                    projectFilter !==
                                    "all"
                                }
                            />

                            <FilterDropdown
                                id="sort-filter"
                                label={getSortLabel(
                                    sortBy
                                )}
                                openDropdown={
                                    openDropdown
                                }
                                setOpenDropdown={
                                    setOpenDropdown
                                }
                                options={[
                                    {
                                        value:
                                            "newest",
                                        label:
                                            "Newest first",
                                    },
                                    {
                                        value:
                                            "oldest",
                                        label:
                                            "Oldest first",
                                    },
                                    {
                                        value:
                                            "due-date",
                                        label:
                                            "Due date",
                                    },
                                    {
                                        value:
                                            "priority",
                                        label:
                                            "Priority",
                                    },
                                    {
                                        value:
                                            "updated",
                                        label:
                                            "Recently updated",
                                    },
                                ]}
                                selected={sortBy}
                                onSelect={(value) => {
                                    setSortBy(
                                        value as SortOption
                                    );
                                    resetPage();
                                }}
                            />
                        </div>
                    </div>

                    {hasFilters && (
                        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">

                            <p className="text-xs text-white/30">
                                Showing{" "}
                                <span className="text-white/60">
                                    {
                                        sortedTasks.length
                                    }
                                </span>{" "}
                                of{" "}
                                <span className="text-white/60">
                                    {tasks.length}
                                </span>{" "}
                                tasks
                            </p>

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="text-xs text-orange-400 transition hover:text-orange-300"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* =========================
                    CONTENT
                ========================= */}

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
                                >
                                    <div className="h-4 w-48 rounded bg-white/[0.06]" />

                                    <div className="mt-3 h-3 w-72 max-w-full rounded bg-white/[0.04]" />

                                    <div className="mt-5 flex gap-2">
                                        <div className="h-7 w-24 rounded bg-white/[0.05]" />
                                        <div className="h-7 w-20 rounded bg-white/[0.05]" />
                                        <div className="h-7 w-28 rounded bg-white/[0.05]" />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : sortedTasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.015] px-6 py-16 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                            {hasFilters ? (
                                <Search
                                    size={20}
                                    className="text-white/30"
                                />
                            ) : (
                                <ListTodo
                                    size={20}
                                    className="text-white/30"
                                />
                            )}
                        </div>

                        <h2 className="mt-4 text-base font-medium text-white/70">
                            {hasFilters
                                ? "No matching tasks"
                                : "No tasks yet"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/30">
                            {hasFilters
                                ? "Try changing your search or filters."
                                : "Create your first task to get started."}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                hasFilters
                                    ? clearFilters()
                                    : setCreateTaskOpen(
                                        true
                                    )
                            }
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-medium text-black transition hover:bg-orange-400"
                        >
                            {hasFilters ? (
                                "Clear filters"
                            ) : (
                                <>
                                    <Plus size={14} />
                                    Create your first task
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">

                            {paginatedTasks.map(
                                (task) => {
                                    const dueDate =
                                        getDueDate(
                                            task
                                        );

                                    const statusId =
                                        `status-${task._id}`;

                                    const priorityId =
                                        `priority-${task._id}`;

                                    return (
                                        <div
                                            key={
                                                task._id
                                            }
                                            className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.025] sm:p-5"
                                        >

                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                                <div className="min-w-0">

                                                    <div className="flex items-start gap-3">

                                                        <span
                                                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${task.status ===
                                                                "completed"
                                                                ? "bg-emerald-400"
                                                                : task.status ===
                                                                    "in-progress"
                                                                    ? "bg-orange-400"
                                                                    : "bg-white/20"
                                                                }`}
                                                        />

                                                        <div className="min-w-0">

                                                            <h3
                                                                className={`truncate text-sm font-medium ${task.status ===
                                                                    "completed"
                                                                    ? "text-white/50 line-through"
                                                                    : "text-white"
                                                                    }`}
                                                            >
                                                                {
                                                                    task.title
                                                                }
                                                            </h3>

                                                            {task.description && (
                                                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/35">
                                                                    {
                                                                        task.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditTask(
                                                                task
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/50 transition hover:bg-white/[0.05] hover:text-white"
                                                    >
                                                        <Edit
                                                            size={13}
                                                        />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDeleteTaskTarget(
                                                                task
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 rounded-lg border border-red-500/15 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                                    >
                                                        <Trash2
                                                            size={13}
                                                        />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-2">

                                                <TaskDropdown
                                                    id={statusId}
                                                    label={
                                                        updatingStatus ===
                                                            task._id
                                                            ? "Updating..."
                                                            : getStatusLabel(
                                                                task.status
                                                            )
                                                    }
                                                    openDropdown={
                                                        openDropdown
                                                    }
                                                    setOpenDropdown={
                                                        setOpenDropdown
                                                    }
                                                    options={[
                                                        {
                                                            value:
                                                                "todo",
                                                            label:
                                                                "To do",
                                                        },
                                                        {
                                                            value:
                                                                "in-progress",
                                                            label:
                                                                "In progress",
                                                        },
                                                        {
                                                            value:
                                                                "completed",
                                                            label:
                                                                "Completed",
                                                        },
                                                    ]}
                                                    selected={
                                                        task.status
                                                    }
                                                    onSelect={(
                                                        value
                                                    ) =>
                                                        handleStatusChange(
                                                            task,
                                                            value as Task["status"]
                                                        )
                                                    }
                                                    className={getStatusStyle(
                                                        task.status
                                                    )}
                                                    disabled={
                                                        updatingStatus ===
                                                        task._id
                                                    }
                                                />

                                                <TaskDropdown
                                                    id={priorityId}
                                                    label={
                                                        updatingPriority ===
                                                            task._id
                                                            ? "Updating..."
                                                            : getPriorityLabel(
                                                                task.priority
                                                            )
                                                    }
                                                    openDropdown={
                                                        openDropdown
                                                    }
                                                    setOpenDropdown={
                                                        setOpenDropdown
                                                    }
                                                    options={[
                                                        {
                                                            value:
                                                                "low",
                                                            label:
                                                                "Low",
                                                        },
                                                        {
                                                            value:
                                                                "medium",
                                                            label:
                                                                "Medium",
                                                        },
                                                        {
                                                            value:
                                                                "high",
                                                            label:
                                                                "High",
                                                        },
                                                    ]}
                                                    selected={
                                                        task.priority
                                                    }
                                                    onSelect={(
                                                        value
                                                    ) =>
                                                        handlePriorityChange(
                                                            task,
                                                            value as Task["priority"]
                                                        )
                                                    }
                                                    className={getPriorityStyle(
                                                        task.priority
                                                    )}
                                                    disabled={
                                                        updatingPriority ===
                                                        task._id
                                                    }
                                                />

                                                {task.project && (
                                                    <span className="max-w-[220px] truncate rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-xs text-white/35">
                                                        {
                                                            task.project.name
                                                        }
                                                    </span>
                                                )}

                                                {dueDate && (
                                                    <span
                                                        className={`rounded-md border px-2.5 py-1.5 text-xs ${dueDate.style}`}
                                                    >
                                                        {
                                                            dueDate.label
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        {/* =========================
                            PAGINATION
                        ========================= */}

                        {totalPages > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-5 sm:flex-row">

                                <p className="text-xs text-white/30">
                                    Showing{" "}
                                    <span className="text-white/60">
                                        {(safeCurrentPage -
                                            1) *
                                            tasksPerPage +
                                            1}
                                    </span>
                                    {" - "}
                                    <span className="text-white/60">
                                        {Math.min(
                                            safeCurrentPage *
                                            tasksPerPage,
                                            sortedTasks.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="text-white/60">
                                        {
                                            sortedTasks.length
                                        }
                                    </span>
                                </p>

                                <div className="flex items-center gap-1.5">

                                    <button
                                        type="button"
                                        disabled={
                                            safeCurrentPage ===
                                            1
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    Math.max(
                                                        1,
                                                        page -
                                                        1
                                                    )
                                            )
                                        }
                                        className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">

                                        {pageNumbers.map(
                                            (page) => (
                                                <button
                                                    key={
                                                        page
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            page
                                                        )
                                                    }
                                                    className={`h-8 min-w-8 rounded-lg px-2 text-xs transition ${safeCurrentPage ===
                                                        page
                                                        ? "bg-orange-500 text-black"
                                                        : "border border-white/[0.08] text-white/40 hover:bg-white/[0.04] hover:text-white"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            safeCurrentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    Math.min(
                                                        totalPages,
                                                        page +
                                                        1
                                                    )
                                            )
                                        }
                                        className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* =========================
                    CREATE MODAL
                ========================= */}

                <CreateTaskModal
                    open={createTaskOpen}
                    onClose={() =>
                        setCreateTaskOpen(false)
                    }
                    projects={projects}
                    onCreated={(task) => {
                        setTasks((prev) => [
                            task,
                            ...prev,
                        ]);

                        setCurrentPage(1);
                    }}
                />

                {/* =========================
                    EDIT MODAL
                ========================= */}

                {editTask && (
                    <EditTaskModal
                        open={!!editTask}
                        onClose={() =>
                            setEditTask(null)
                        }
                        task={editTask}
                        projects={projects}
                        onUpdated={(updatedTask) => {
                            setTasks((prev) =>
                                prev.map((item) =>
                                    item._id ===
                                        updatedTask._id
                                        ? updatedTask
                                        : item
                                )
                            );

                            setEditTask(null);
                        }}
                    />
                )}
            </div>

            {/* =========================
                DELETE MODAL
            ========================= */}

            {deleteTaskTarget && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
                    onMouseDown={() => {
                        if (!deleting) {
                            setDeleteTaskTarget(
                                null
                            );
                        }
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-white/[0.10] bg-[#111111] p-5 shadow-2xl shadow-black/60"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                                <Trash2
                                    size={19}
                                    className="text-red-400"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Delete task?
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-white/40">
                                    Are you sure you
                                    want to delete{" "}
                                    <span className="text-white/70">
                                        "
                                        {
                                            deleteTaskTarget.title
                                        }
                                        "
                                    </span>
                                    ? This action
                                    cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() =>
                                    setDeleteTaskTarget(
                                        null
                                    )
                                }
                                className="rounded-lg border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-40"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={
                                    handleDeleteTask
                                }
                                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-red-400 disabled:opacity-50"
                            >
                                <Trash2 size={13} />

                                {deleting
                                    ? "Deleting..."
                                    : "Delete task"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* =====================================================
   FILTER DROPDOWN
===================================================== */

interface FilterDropdownProps {
    id: string;
    label: string;
    icon?: ReactNode;
    openDropdown: string | null;
    setOpenDropdown: (
        value: string | null
    ) => void;
    options: DropdownOption[];
    selected: string;
    onSelect: (value: string) => void;
    active?: boolean;
}

const FilterDropdown = ({
    id,
    label,
    icon,
    openDropdown,
    setOpenDropdown,
    options,
    selected,
    onSelect,
    active = false,
}: FilterDropdownProps) => {
    const isOpen =
        openDropdown === id;

    return (
        <div
            className="relative"
            onClick={(event) =>
                event.stopPropagation()
            }
        >
            <button
                type="button"
                onClick={() =>
                    setOpenDropdown(
                        isOpen ? null : id
                    )
                }
                className={`flex min-w-[145px] items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm transition ${active
                    ? "border-orange-500/25 bg-orange-500/[0.05] text-orange-400"
                    : "border-white/[0.08] bg-black/20 text-white/60 hover:border-white/[0.14] hover:bg-white/[0.03]"
                    }`}
            >
                <span className="flex min-w-0 items-center gap-2">
                    {icon && (
                        <span className="shrink-0 text-white/30">
                            {icon}
                        </span>
                    )}

                    <span className="truncate">
                        {label}
                    </span>
                </span>

                <ChevronDown
                    size={14}
                    className={`shrink-0 transition-transform ${isOpen
                        ? "rotate-180"
                        : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-[150] mt-2 w-full min-w-[170px] overflow-hidden rounded-xl border border-white/[0.10] bg-[#111111] p-1.5 shadow-2xl shadow-black/60">

                    {options.map(
                        (option) => (
                            <button
                                key={
                                    option.value
                                }
                                type="button"
                                onClick={() => {
                                    onSelect(
                                        option.value
                                    );

                                    setOpenDropdown(
                                        null
                                    );
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${selected ===
                                    option.value
                                    ? "bg-orange-500/10 text-orange-400"
                                    : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                <span>
                                    {
                                        option.label
                                    }
                                </span>

                                {selected ===
                                    option.value && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                    )}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

/* =====================================================
   TASK DROPDOWN
===================================================== */

interface TaskDropdownProps {
    id: string;
    label: string;
    openDropdown: string | null;
    setOpenDropdown: (
        value: string | null
    ) => void;
    options: DropdownOption[];
    selected: string;
    onSelect: (value: string) => void;
    className: string;
    disabled?: boolean;
}

const TaskDropdown = ({
    id,
    label,
    openDropdown,
    setOpenDropdown,
    options,
    selected,
    onSelect,
    className,
    disabled = false,
}: TaskDropdownProps) => {
    const isOpen =
        openDropdown === id;

    return (
        <div
            className="relative"
            onClick={(event) =>
                event.stopPropagation()
            }
        >
            <button
                type="button"
                disabled={disabled}
                onClick={() =>
                    setOpenDropdown(
                        isOpen ? null : id
                    )
                }
                className={`flex min-w-[105px] items-center justify-between gap-3 rounded-md border px-3 py-1.5 text-xs transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            >
                <span>
                    {label}
                </span>

                <ChevronDown
                    size={13}
                    className={`transition-transform ${isOpen
                        ? "rotate-180"
                        : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-[120] mt-2 w-40 overflow-hidden rounded-xl border border-white/[0.10] bg-[#111111] p-1.5 shadow-2xl shadow-black/60">

                    {options.map(
                        (option) => (
                            <button
                                key={
                                    option.value
                                }
                                type="button"
                                onClick={() => {
                                    onSelect(
                                        option.value
                                    );

                                    setOpenDropdown(
                                        null
                                    );
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${selected ===
                                    option.value
                                    ? "bg-orange-500/10 text-orange-400"
                                    : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                <span>
                                    {
                                        option.label
                                    }
                                </span>

                                {selected ===
                                    option.value && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                    )}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

/* =====================================================
   STAT CARD
===================================================== */

interface StatCardProps {
    label: string;
    value: number;
    icon: ReactNode;
    accent?: "orange" | "green";
}

const StatCard = ({
    label,
    value,
    icon,
    accent,
}: StatCardProps) => {
    const wrapper =
        accent === "orange"
            ? "border-orange-500/10 bg-orange-500/[0.02]"
            : accent === "green"
                ? "border-emerald-500/10 bg-emerald-500/[0.02]"
                : "border-white/[0.08] bg-white/[0.02]";

    const iconWrapper =
        accent === "orange"
            ? "border-orange-500/10 bg-orange-500/[0.06] text-orange-400"
            : accent === "green"
                ? "border-emerald-500/10 bg-emerald-500/[0.06] text-emerald-400"
                : "border-white/[0.08] bg-white/[0.04] text-white/40";

    return (
        <div
            className={`rounded-xl border p-4 ${wrapper}`}
        >
            <div className="flex items-center justify-between">

                <div>
                    <p className="text-xs text-white/35">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-white">
                        {value}
                    </p>
                </div>

                <div
                    className={`rounded-lg border p-2 ${iconWrapper}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default Tasks;