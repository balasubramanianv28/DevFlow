import {
    AlertCircle,
    BarChart3,
    CheckCircle2,
    CircleDollarSign,
    FolderKanban,
    Plus,
    Users,
} from "lucide-react";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";

import CreateProjectModal from "../../components/projects/CreateProjectModal";

import { getAnalytics } from "../../services/analyticsService";

const API_BASE_URL =
    import.meta.env.VITE_API_URL;

/* =========================================================
   PROJECT TYPE
========================================================= */

interface Project {
    _id: string;
    name: string;
    description: string;
    status:
    | "planning"
    | "active"
    | "completed"
    | "archived";
    priority:
    | "low"
    | "medium"
    | "high";
    startDate: string | null;
    dueDate: string | null;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

/* =========================================================
   NOTIFICATION TYPE
========================================================= */

interface DashboardNotification {
    _id: string;
    title: string;
    message: string;
    type:
    | "project"
    | "task"
    | "client"
    | "invoice"
    | "system";
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {
    const { user } = useAuth();

    const navigate = useNavigate();

    /* =====================================================
       PROJECT STATE
    ===================================================== */

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [projectsLoading, setProjectsLoading] =
        useState(true);

    /* =====================================================
       ANALYTICS STATE
    ===================================================== */

    const [analytics, setAnalytics] =
        useState<Awaited<
            ReturnType<typeof getAnalytics>
        > | null>(null);

    const [analyticsLoading, setAnalyticsLoading] =
        useState(true);

    /* =====================================================
       NOTIFICATION STATE
    ===================================================== */

    const [
        notifications,
        setNotifications,
    ] = useState<DashboardNotification[]>([]);

    const [
        notificationsLoading,
        setNotificationsLoading,
    ] = useState(true);

    /* =====================================================
       MODAL STATE
    ===================================================== */

    const [createProjectOpen, setCreateProjectOpen] =
        useState(false);

    /* =====================================================
       USER
    ===================================================== */

    const userName =
        user?.name || "User";

    const firstName =
        userName.split(" ")[0];

    /* =====================================================
       FETCH PROJECTS
    ===================================================== */

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token =
                    localStorage.getItem(
                        "devflow_token"
                    );

                const response =
                    await axios.get(
                        `${API_BASE_URL}/api/projects`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                setProjects(
                    response.data.projects
                );
            } catch (error) {
                console.error(
                    "Failed to fetch projects:",
                    error
                );
            } finally {
                setProjectsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    /* =====================================================
       FETCH ANALYTICS
    ===================================================== */

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setAnalyticsLoading(true);

                const data =
                    await getAnalytics();

                setAnalytics(data);
            } catch (error) {
                console.error(
                    "Failed to fetch analytics:",
                    error
                );
            } finally {
                setAnalyticsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    /* =====================================================
       FETCH NOTIFICATIONS
    ===================================================== */

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setNotificationsLoading(true);

                const token =
                    localStorage.getItem(
                        "devflow_token"
                    );

                const response =
                    await axios.get(
                        `${API_BASE_URL}/api/notifications`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                const notificationData =
                    response.data.notifications ||
                    [];

                setNotifications(
                    notificationData.slice(0, 5)
                );
            } catch (error) {
                console.error(
                    "Failed to fetch notifications:",
                    error
                );
            } finally {
                setNotificationsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    /* =====================================================
       HELPERS
    ===================================================== */

    const formatCurrency = (
        amount: number
    ) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(amount);
    };

    const formatRelativeTime = (
        dateString: string
    ) => {
        const date =
            new Date(dateString);

        const now =
            new Date();

        const difference =
            now.getTime() -
            date.getTime();

        const seconds =
            Math.floor(
                difference / 1000
            );

        if (seconds < 60) {
            return "Just now";
        }

        const minutes =
            Math.floor(
                seconds / 60
            );

        if (minutes < 60) {
            return `${minutes}m ago`;
        }

        const hours =
            Math.floor(
                minutes / 60
            );

        if (hours < 24) {
            return `${hours}h ago`;
        }

        const days =
            Math.floor(
                hours / 24
            );

        if (days < 7) {
            return `${days}d ago`;
        }

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
            }
        );
    };

    const getNotificationIcon =
        (
            type: DashboardNotification["type"]
        ) => {
            switch (type) {
                case "project":
                    return (
                        <FolderKanban
                            size={15}
                            className="text-orange-400"
                        />
                    );

                case "task":
                    return (
                        <CheckCircle2
                            size={15}
                            className="text-emerald-400"
                        />
                    );

                case "client":
                    return (
                        <Users
                            size={15}
                            className="text-blue-400"
                        />
                    );

                case "invoice":
                    return (
                        <CircleDollarSign
                            size={15}
                            className="text-amber-400"
                        />
                    );

                default:
                    return (
                        <AlertCircle
                            size={15}
                            className="text-white/50"
                        />
                    );
            }
        };

    /* =====================================================
       DASHBOARD VALUES
    ===================================================== */

    const activeTasks =
        analytics?.tasks
            ? analytics.tasks.todo +
            analytics.tasks.inProgress
            : 0;

    const totalClients =
        analytics?.clients.total || 0;

    const totalRevenue =
        analytics?.invoices.totalAmount || 0;

    const invoiceTotal =
        analytics?.invoices.total || 0;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-screen">

            <main className="relative overflow-hidden">

                {/* BACKGROUND GLOW */}

                <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/[0.045] blur-[150px]" />

                {/* CONTENT */}

                <div className="relative mx-auto max-w-[1600px] px-5 py-8 sm:px-7 lg:px-9 lg:py-10">

                    {/* WELCOME */}

                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                        <div>

                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                                Dashboard
                            </p>

                            <h1 className="text-3xl font-bold tracking-[-0.035em] text-white lg:text-4xl">

                                Good to see you,{" "}

                                <span className="text-orange-500">
                                    {firstName}.
                                </span>

                            </h1>

                            <p className="mt-2 text-sm text-white/35">
                                Here's what's happening across your
                                workspace.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setCreateProjectOpen(
                                    true
                                )
                            }
                            className="flex h-11 w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-black transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/15"
                        >

                            <Plus size={17} />

                            New project

                        </button>

                    </div>

                    {/* STATS */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {/* PROJECTS */}

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5 transition-all hover:border-white/[0.13]">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm text-white/35">
                                        Total projects
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-white">

                                        {projectsLoading
                                            ? "—"
                                            : projects.length}

                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">

                                    <FolderKanban
                                        size={19}
                                        className="text-orange-500"
                                    />

                                </div>

                            </div>

                            <p className="mt-4 text-xs text-white/25">

                                {projectsLoading
                                    ? "Loading projects..."
                                    : projects.length ===
                                        0
                                        ? "No projects yet"
                                        : `${projects.length} project${projects.length >
                                            1
                                            ? "s"
                                            : ""
                                        } available`}

                            </p>

                        </div>

                        {/* TASKS */}

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5 transition-all hover:border-white/[0.13]">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm text-white/35">
                                        Active tasks
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-white">

                                        {analyticsLoading
                                            ? "—"
                                            : activeTasks}

                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">

                                    <CheckCircle2
                                        size={19}
                                        className="text-orange-500"
                                    />

                                </div>

                            </div>

                            <p className="mt-4 text-xs text-white/25">

                                {analyticsLoading
                                    ? "Loading tasks..."
                                    : activeTasks ===
                                        0
                                        ? "Nothing pending"
                                        : `${activeTasks} task${activeTasks >
                                            1
                                            ? "s"
                                            : ""
                                        } in progress`}

                            </p>

                        </div>

                        {/* CLIENTS */}

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5 transition-all hover:border-white/[0.13]">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm text-white/35">
                                        Clients
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-white">

                                        {analyticsLoading
                                            ? "—"
                                            : totalClients}

                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">

                                    <Users
                                        size={19}
                                        className="text-orange-500"
                                    />

                                </div>

                            </div>

                            <p className="mt-4 text-xs text-white/25">

                                {analyticsLoading
                                    ? "Loading clients..."
                                    : totalClients ===
                                        0
                                        ? "Add your first client"
                                        : `${totalClients} client${totalClients >
                                            1
                                            ? "s"
                                            : ""
                                        } in workspace`}

                            </p>

                        </div>

                        {/* REVENUE */}

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-5 transition-all hover:border-white/[0.13]">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm text-white/35">
                                        Revenue
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-white">

                                        {analyticsLoading
                                            ? "—"
                                            : formatCurrency(
                                                totalRevenue
                                            )}

                                    </p>

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">

                                    <CircleDollarSign
                                        size={19}
                                        className="text-orange-500"
                                    />

                                </div>

                            </div>

                            <p className="mt-4 text-xs text-white/25">

                                {analyticsLoading
                                    ? "Loading revenue..."
                                    : invoiceTotal ===
                                        0
                                        ? "No invoices yet"
                                        : `${invoiceTotal} invoice${invoiceTotal >
                                            1
                                            ? "s"
                                            : ""
                                        } recorded`}

                            </p>

                        </div>

                    </div>

                    {/* PROJECTS + ACTIVITY */}

                    <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">

                        {/* RECENT PROJECTS */}

                        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0d] xl:col-span-2">

                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

                                <div>

                                    <h2 className="font-semibold text-white">
                                        Recent projects
                                    </h2>

                                    <p className="mt-1 text-xs text-white/25">
                                        Your latest project activity
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/projects"
                                        )
                                    }
                                    className="text-xs text-orange-500 transition-colors hover:text-orange-400"
                                >
                                    View all
                                </button>

                            </div>

                            {projectsLoading ? (

                                <div className="flex min-h-[280px] items-center justify-center">

                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500/20 border-t-orange-500" />

                                </div>

                            ) : projects.length ===
                                0 ? (

                                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">

                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/10">

                                        <FolderKanban
                                            size={24}
                                            className="text-orange-500"
                                        />

                                    </div>

                                    <h3 className="font-medium text-white">
                                        No projects yet
                                    </h3>

                                    <p className="mt-2 max-w-[320px] text-sm text-white/30">
                                        Create your first project and start
                                        turning ideas into progress.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCreateProjectOpen(
                                                true
                                            )
                                        }
                                        className="mt-5 h-10 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 text-sm font-medium text-orange-500 transition-all hover:bg-orange-500/15"
                                    >

                                        <span className="flex items-center gap-2">

                                            <Plus size={16} />

                                            Create project

                                        </span>

                                    </button>

                                </div>

                            ) : (

                                <div className="space-y-3 p-6">

                                    {projects
                                        .slice(0, 5)
                                        .map(
                                            (
                                                project
                                            ) => (

                                                <div
                                                    key={
                                                        project._id
                                                    }
                                                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-orange-500/20"
                                                >

                                                    <div className="flex items-center justify-between gap-4">

                                                        <div className="min-w-0">

                                                            <p className="truncate font-medium text-white">
                                                                {
                                                                    project.name
                                                                }
                                                            </p>

                                                            {project.description && (
                                                                <p className="mt-1 line-clamp-1 text-xs text-white/30">
                                                                    {
                                                                        project.description
                                                                    }
                                                                </p>
                                                            )}

                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-2">

                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-medium capitalize ${project.status ===
                                                                    "active"
                                                                    ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                                                                    : project.status ===
                                                                        "completed"
                                                                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                                                        : project.status ===
                                                                            "archived"
                                                                            ? "border-white/[0.08] bg-white/[0.04] text-white/40"
                                                                            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                                                    }`}
                                                            >

                                                                <span
                                                                    className={`h-1.5 w-1.5 rounded-full ${project.status ===
                                                                        "active"
                                                                        ? "bg-orange-400"
                                                                        : project.status ===
                                                                            "completed"
                                                                            ? "bg-emerald-400"
                                                                            : project.status ===
                                                                                "archived"
                                                                                ? "bg-white/30"
                                                                                : "bg-yellow-400"
                                                                        }`}
                                                                />

                                                                {
                                                                    project.status
                                                                }

                                                            </span>

                                                            <span
                                                                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-medium capitalize ${project.priority ===
                                                                    "high"
                                                                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                                                                    : project.priority ===
                                                                        "medium"
                                                                        ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                                                                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                                                    }`}
                                                            >
                                                                {
                                                                    project.priority
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                    {(project.startDate ||
                                                        project.dueDate) && (

                                                            <div className="mt-4 flex items-center gap-5 border-t border-white/[0.05] pt-3">

                                                                {project.startDate && (

                                                                    <div>

                                                                        <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                                                                            Start date
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-white/45">
                                                                            {new Date(
                                                                                project.startDate
                                                                            ).toLocaleDateString(
                                                                                "en-GB"
                                                                            )}
                                                                        </p>

                                                                    </div>

                                                                )}

                                                                {project.dueDate && (

                                                                    <div>

                                                                        <p className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                                                                            Due date
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-white/45">
                                                                            {new Date(
                                                                                project.dueDate
                                                                            ).toLocaleDateString(
                                                                                "en-GB"
                                                                            )}
                                                                        </p>

                                                                    </div>

                                                                )}

                                                            </div>

                                                        )}

                                                </div>

                                            )
                                        )}

                                </div>

                            )}

                        </div>

                        {/* RECENT ACTIVITY */}

                        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0d]">

                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

                                <div>

                                    <h2 className="font-semibold text-white">
                                        Recent activity
                                    </h2>

                                    <p className="mt-1 text-xs text-white/25">
                                        Latest workspace updates
                                    </p>

                                </div>

                                {notifications.length >
                                    0 && (
                                        <span className="rounded-full border border-orange-500/15 bg-orange-500/10 px-2 py-1 text-[9px] font-medium text-orange-400">
                                            {
                                                notifications.length
                                            }
                                        </span>
                                    )}

                            </div>

                            {notificationsLoading ? (

                                <div className="flex min-h-[280px] items-center justify-center">

                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500/20 border-t-orange-500" />

                                </div>

                            ) : notifications.length ===
                                0 ? (

                                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">

                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03]">

                                        <BarChart3
                                            size={21}
                                            className="text-white/25"
                                        />

                                    </div>

                                    <p className="text-sm text-white/35">
                                        No activity yet
                                    </p>

                                    <p className="mt-1 text-xs text-white/20">
                                        Activity will appear here
                                    </p>

                                </div>

                            ) : (

                                <div className="divide-y divide-white/[0.05]">

                                    {notifications.map(
                                        (
                                            notification
                                        ) => (

                                            <div
                                                key={
                                                    notification._id
                                                }
                                                className={`flex gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] ${!notification.isRead
                                                    ? "bg-orange-500/[0.025]"
                                                    : ""
                                                    }`}
                                            >

                                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">

                                                    {
                                                        getNotificationIcon(
                                                            notification.type
                                                        )
                                                    }

                                                </div>

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex items-start justify-between gap-2">

                                                        <p className="line-clamp-1 text-xs font-medium text-white/75">
                                                            {
                                                                notification.title
                                                            }
                                                        </p>

                                                        {!notification.isRead && (
                                                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                                                        )}

                                                    </div>

                                                    <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/30">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    <p className="mt-2 text-[9px] text-white/20">
                                                        {formatRelativeTime(
                                                            notification.createdAt
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                    {/* QUICK ACTIONS */}

                    <div className="mt-6">

                        <div className="mb-4">

                            <h2 className="font-semibold text-white">
                                Quick actions
                            </h2>

                            <p className="mt-1 text-xs text-white/25">
                                Jump straight into your workspace
                            </p>

                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                            {/* NEW PROJECT */}

                            <button
                                type="button"
                                onClick={() =>
                                    setCreateProjectOpen(
                                        true
                                    )
                                }
                                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-4 text-left transition-all hover:border-orange-500/25 hover:bg-orange-500/[0.03]"
                            >

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-105">

                                    <Plus size={20} />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-white">
                                        New Project
                                    </p>

                                    <p className="mt-1 text-[11px] text-white/25">
                                        Start a new project
                                    </p>

                                </div>

                            </button>

                            {/* NEW TASK */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/tasks"
                                    )
                                }
                                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-4 text-left transition-all hover:border-orange-500/25 hover:bg-orange-500/[0.03]"
                            >

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-105">

                                    <CheckCircle2
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-white">
                                        New Task
                                    </p>

                                    <p className="mt-1 text-[11px] text-white/25">
                                        Manage your tasks
                                    </p>

                                </div>

                            </button>

                            {/* NEW CLIENT */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/clients"
                                    )
                                }
                                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-4 text-left transition-all hover:border-orange-500/25 hover:bg-orange-500/[0.03]"
                            >

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-105">

                                    <Users size={20} />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-white">
                                        New Client
                                    </p>

                                    <p className="mt-1 text-[11px] text-white/25">
                                        Add a new client
                                    </p>

                                </div>

                            </button>

                            {/* NEW INVOICE */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/invoices"
                                    )
                                }
                                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-4 text-left transition-all hover:border-orange-500/25 hover:bg-orange-500/[0.03]"
                            >

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-105">

                                    <CircleDollarSign
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-white">
                                        New Invoice
                                    </p>

                                    <p className="mt-1 text-[11px] text-white/25">
                                        Create an invoice
                                    </p>

                                </div>

                            </button>

                        </div>

                    </div>

                </div>

                {/* CREATE PROJECT MODAL */}

                <CreateProjectModal
                    open={
                        createProjectOpen
                    }
                    onClose={() =>
                        setCreateProjectOpen(
                            false
                        )
                    }
                    onCreated={(
                        project
                    ) => {
                        setProjects(
                            (prev) => [
                                project,
                                ...prev,
                            ]
                        );
                    }}
                />

            </main>

        </div>
    );
};

export default Dashboard;