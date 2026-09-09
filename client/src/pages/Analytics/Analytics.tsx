import { useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    BarChart3,
    CheckCircle2,
    ChevronDown,
    Clock3,
    DollarSign,
    FileText,
    FolderKanban,
    Users,
} from "lucide-react";

import { getAnalytics } from "../../services/analyticsService";

import type {
    Analytics as AnalyticsData,
} from "../../services/analyticsService";

/* =========================================================
   CONSTANTS
========================================================= */

const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

/* =========================================================
   COMPONENT
========================================================= */

function AnalyticsPage() {
    const currentYear =
        new Date().getFullYear();

    const [analytics, setAnalytics] =
        useState<AnalyticsData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedYear, setSelectedYear] =
        useState(currentYear);

    const [yearDropdownOpen, setYearDropdownOpen] =
        useState(false);

    /* =========================================================
       LOAD ANALYTICS
    ========================================================= */

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getAnalytics(
                        selectedYear
                    );

                setAnalytics(data);
            } catch (err) {
                console.error(err);

                setError(
                    "Failed to load analytics"
                );
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, [selectedYear]);

    /* =========================================================
       HELPERS
    ========================================================= */

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

    const formatCompactCurrency = (
        amount: number
    ) => {
        if (amount >= 10000000) {
            return `₹${(
                amount / 10000000
            ).toFixed(1)}Cr`;
        }

        if (amount >= 100000) {
            return `₹${(
                amount / 100000
            ).toFixed(1)}L`;
        }

        if (amount >= 1000) {
            return `₹${(
                amount / 1000
            ).toFixed(0)}K`;
        }

        return `₹${amount}`;
    };

    /* =========================================================
       REVENUE CHART DATA
    ========================================================= */

    const chartData = useMemo(() => {
        if (!analytics) {
            return [];
        }

        return analytics.monthlyRevenue.map(
            (item) => ({
                ...item,

                label:
                    MONTH_NAMES[
                    item.month - 1
                    ],
            })
        );
    }, [analytics]);

    /* =========================================================
       MAX REVENUE
    ========================================================= */

    const maxRevenue = useMemo(() => {
        if (chartData.length === 0) {
            return 0;
        }

        return Math.max(
            ...chartData.map(
                (item) => item.revenue
            )
        );
    }, [chartData]);

    /* =========================================================
       CHART MAX
    ========================================================= */

    const chartMax = useMemo(() => {
        if (maxRevenue <= 0) {
            return 1000;
        }

        const magnitude =
            Math.pow(
                10,
                Math.floor(
                    Math.log10(maxRevenue)
                )
            );

        const normalized =
            maxRevenue / magnitude;

        let roundedMax: number;

        if (normalized <= 1) {
            roundedMax = 1;
        } else if (normalized <= 2) {
            roundedMax = 2;
        } else if (normalized <= 5) {
            roundedMax = 5;
        } else {
            roundedMax = 10;
        }

        return roundedMax * magnitude;
    }, [maxRevenue]);

    /* =========================================================
       CHART STEPS
    ========================================================= */

    const chartSteps = useMemo(() => {
        return Array.from(
            { length: 5 },
            (_, index) =>
                chartMax -
                (chartMax / 4) * index
        );
    }, [chartMax]);

    /* =========================================================
       AVAILABLE YEARS
    ========================================================= */

    const availableYears = [
        currentYear,
        currentYear - 1,
        currentYear - 2,
        currentYear - 3,
    ];

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <div className="mx-auto flex min-h-[70vh] w-full max-w-[1600px] items-center justify-center px-6">

                <div className="flex flex-col items-center gap-4">

                    <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-orange-500" />

                    <p className="text-sm text-white/35">
                        Loading analytics...
                    </p>

                </div>

            </div>
        );
    }

    /* =========================================================
       ERROR
    ========================================================= */

    if (error || !analytics) {
        return (
            <div className="mx-auto flex min-h-[70vh] w-full max-w-[1600px] items-center justify-center px-6">

                <div className="w-full max-w-md rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-8 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">

                        <AlertCircle size={22} />

                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-white">
                        Unable to load analytics
                    </h2>

                    <p className="mt-2 text-sm text-white/40">
                        {error ||
                            "Something went wrong while loading your analytics."}
                    </p>

                </div>

            </div>
        );
    }

    /* =========================================================
       SUMMARY VALUES
    ========================================================= */

    const taskCompletion =
        analytics.tasks.completionRate;

    const projectTotal =
        analytics.projects.total;

    const clientTotal =
        analytics.clients.total;

    const invoiceTotal =
        analytics.invoices.total;

    return (
        <div className="mx-auto w-full max-w-[1600px] px-6 pt-6 pb-10 lg:px-8 xl:px-10">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="mb-8">

                <div className="mb-2 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">

                        <BarChart3
                            size={20}
                            className="text-orange-500"
                        />

                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Analytics
                    </h1>

                </div>

                <p className="text-sm text-white/40">
                    Get a clear overview of your business performance.
                </p>

            </div>

            {/* =====================================================
                REVENUE CARDS
            ===================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* TOTAL REVENUE */}

                <div className="rounded-2xl border border-orange-500/20 bg-[#111111] p-5 transition-all hover:border-orange-500/35">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Total Revenue
                            </p>

                            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                                {formatCurrency(
                                    analytics
                                        .invoices
                                        .totalAmount
                                )}
                            </p>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">

                            <DollarSign
                                size={19}
                            />

                        </div>

                    </div>

                </div>

                {/* PAID REVENUE */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-emerald-500/20">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Paid Revenue
                            </p>

                            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                                {formatCurrency(
                                    analytics
                                        .invoices
                                        .paidAmount
                                )}
                            </p>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">

                            <CheckCircle2
                                size={19}
                            />

                        </div>

                    </div>

                </div>

                {/* PENDING REVENUE */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-amber-500/20">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Pending Revenue
                            </p>

                            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                                {formatCurrency(
                                    analytics
                                        .invoices
                                        .pendingAmount
                                )}
                            </p>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">

                            <Clock3 size={19} />

                        </div>

                    </div>

                </div>

                {/* TOTAL INVOICES */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-white/[0.12]">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Total Invoices
                            </p>

                            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                                {invoiceTotal}
                            </p>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/60">

                            <FileText size={19} />

                        </div>

                    </div>

                </div>

            </div>

            {/* =====================================================
                REVENUE + PROJECTS
            ===================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">

                {/* =================================================
                    REVENUE CHART
                ================================================= */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">

                    <div className="mb-7 flex items-start justify-between">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Revenue Overview
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-white">
                                Monthly Revenue
                            </h2>

                        </div>

                        {/* =================================================
                            YEAR DROPDOWN
                        ================================================= */}

                        <div className="relative">

                            <button
                                type="button"
                                onClick={() =>
                                    setYearDropdownOpen(
                                        (current) =>
                                            !current
                                    )
                                }
                                className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-medium text-orange-400 transition hover:border-orange-500/35 hover:bg-orange-500/15"
                            >

                                <span>
                                    {selectedYear}
                                </span>

                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${yearDropdownOpen
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                />

                            </button>

                            {yearDropdownOpen && (
                                <div className="absolute right-0 top-full z-50 mt-2 w-28 overflow-hidden rounded-xl border border-white/10 bg-[#181818] p-1 shadow-2xl">

                                    {availableYears.map(
                                        (year) => (
                                            <button
                                                key={
                                                    year
                                                }
                                                type="button"
                                                onClick={() => {
                                                    setSelectedYear(
                                                        year
                                                    );

                                                    setYearDropdownOpen(
                                                        false
                                                    );
                                                }}
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${selectedYear ===
                                                    year
                                                    ? "bg-orange-500/10 text-orange-400"
                                                    : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                                                    }`}
                                            >

                                                <span>
                                                    {year}
                                                </span>

                                                {selectedYear ===
                                                    year && (
                                                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                                    )}

                                            </button>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        CHART
                    ================================================= */}

                    <div className="relative h-[310px]">

                        {/* Y AXIS */}

                        <div className="absolute bottom-9 left-0 top-0 flex w-12 flex-col justify-between">

                            {chartSteps.map(
                                (value, index) => (
                                    <span
                                        key={
                                            index
                                        }
                                        className="text-[9px] text-white/25"
                                    >
                                        {formatCompactCurrency(
                                            value
                                        )}
                                    </span>
                                )
                            )}

                        </div>

                        {/* CHART AREA */}

                        <div className="absolute bottom-9 left-14 right-0 top-0">

                            {/* GRID */}

                            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">

                                {chartSteps.map(
                                    (_, index) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="border-t border-white/[0.055]"
                                        />
                                    )
                                )}

                            </div>

                            {/* BARS */}

                            <div className="relative flex h-full items-end gap-1.5 sm:gap-3">
                                {maxRevenue === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                                                <BarChart3
                                                    size={18}
                                                    className="text-white/25"
                                                />
                                            </div>

                                            <p className="text-sm font-medium text-white/45">
                                                No revenue yet
                                            </p>

                                            <p className="mt-1 text-xs text-white/25">
                                                No paid invoices found for {selectedYear}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {chartData.map(
                                    (item) => {

                                        const barHeight =
                                            chartMax >
                                                0
                                                ? (item.revenue /
                                                    chartMax) *
                                                100
                                                : 0;

                                        return (
                                            <div
                                                key={
                                                    item.month
                                                }
                                                className="group relative flex h-full flex-1 items-end justify-center"
                                            >

                                                {/* TOOLTIP */}

                                                <div
                                                    className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#1b1b1b] px-3 py-2 text-xs opacity-0 shadow-2xl transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100"
                                                    style={{
                                                        bottom: `calc(${Math.max(
                                                            barHeight,
                                                            3
                                                        )}% + 12px)`,
                                                    }}
                                                >

                                                    <p className="font-medium text-white">
                                                        {
                                                            item.label
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 text-orange-400">
                                                        {formatCurrency(
                                                            item.revenue
                                                        )}
                                                    </p>

                                                </div>

                                                {/* BAR */}

                                                <div
                                                    className={`relative w-full max-w-[38px] overflow-hidden rounded-t-lg transition-all duration-300 ${item.revenue >
                                                        0
                                                        ? "bg-orange-500/85 group-hover:bg-orange-400"
                                                        : "bg-white/[0.07]"
                                                        }`}
                                                    style={{
                                                        height:
                                                            item.revenue >
                                                                0
                                                                ? `${Math.max(
                                                                    barHeight,
                                                                    3
                                                                )}%`
                                                                : "3%",
                                                    }}
                                                >

                                                    {item.revenue >
                                                        0 && (
                                                            <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-orange-300/70" />
                                                        )}

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>

                        {/* X AXIS */}

                        <div className="absolute bottom-0 left-14 right-0 flex gap-1.5 sm:gap-3">

                            {chartData.map(
                                (item) => (
                                    <div
                                        key={
                                            item.month
                                        }
                                        className="flex-1 text-center"
                                    >

                                        <span className="text-[9px] text-white/30">
                                            {
                                                item.label
                                            }
                                        </span>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    {/* CHART SUMMARY */}

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.06] pt-4">

                        <div className="flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-orange-500" />

                            <span className="text-xs text-white/35">
                                Paid revenue
                            </span>

                        </div>

                        <div className="text-xs text-white/25">

                            Highest month:{" "}

                            <span className="text-white/50">

                                {maxRevenue > 0
                                    ? formatCurrency(
                                        maxRevenue
                                    )
                                    : "₹0"}

                            </span>

                        </div>

                        <div className="text-xs text-white/25">

                            Year total:{" "}

                            <span className="text-white/50">
                                {formatCurrency(
                                    analytics
                                        .yearlyRevenue
                                )}
                            </span>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    PROJECT OVERVIEW
                ================================================= */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">

                    <div className="mb-7">

                        <div className="flex items-center gap-2">

                            <FolderKanban
                                size={17}
                                className="text-orange-500"
                            />

                            <h2 className="text-lg font-semibold text-white">
                                Project Overview
                            </h2>

                        </div>

                        <p className="mt-1 text-xs text-white/30">
                            {projectTotal} total projects
                        </p>

                    </div>

                    <div className="space-y-5">

                        {[
                            {
                                label: "Active",
                                value:
                                    analytics
                                        .projects
                                        .active,
                            },
                            {
                                label: "Planning",
                                value:
                                    analytics
                                        .projects
                                        .planning,
                            },
                            {
                                label: "Completed",
                                value:
                                    analytics
                                        .projects
                                        .completed,
                            },
                            {
                                label: "Archived",
                                value:
                                    analytics
                                        .projects
                                        .archived,
                            },
                        ].map((item) => {

                            const percentage =
                                projectTotal > 0
                                    ? (item.value /
                                        projectTotal) *
                                    100
                                    : 0;

                            return (
                                <div
                                    key={
                                        item.label
                                    }
                                >

                                    <div className="mb-2 flex items-center justify-between">

                                        <span className="text-sm text-white/55">
                                            {
                                                item.label
                                            }
                                        </span>

                                        <span className="text-sm font-medium text-white">
                                            {
                                                item.value
                                            }
                                        </span>

                                        <span className="text-[10px] text-white/25">
                                            {Math.round(percentage)}%
                                        </span>

                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

                                        <div
                                            className="h-full rounded-full bg-orange-500 transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>

            {/* =====================================================
                TASKS + CLIENTS + INVOICES
            ===================================================== */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* TASKS */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">

                    <div className="mb-6 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <CheckCircle2
                                size={17}
                                className="text-orange-500"
                            />

                            <h2 className="text-lg font-semibold text-white">
                                Task Progress
                            </h2>

                        </div>

                        <span className="text-sm font-semibold text-orange-400">
                            {taskCompletion}%
                        </span>

                    </div>

                    <div
                        className="mx-auto mb-7 flex h-36 w-36 items-center justify-center rounded-full"
                        style={{
                            background: `conic-gradient(
            rgb(249 115 22) ${taskCompletion}%,
            rgba(249, 115, 22, 0.12) ${taskCompletion}%
        )`,
                        }}
                    >
                        <div className="flex h-[108px] w-[108px] items-center justify-center rounded-full bg-[#111111]">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">
                                    {analytics.tasks.completed}
                                </p>

                                <p className="text-[10px] uppercase tracking-wider text-white/30">
                                    Completed
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">

                        <p className="text-2xl font-bold text-white">
                            {
                                analytics
                                    .tasks
                                    .completed
                            }
                        </p>

                        <p className="text-[10px] uppercase tracking-wider text-white/30">
                            Completed
                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-3 gap-2 text-center">

                    <div className="rounded-xl bg-white/[0.03] p-3">

                        <p className="text-lg font-semibold text-white">
                            {
                                analytics
                                    .tasks
                                    .todo
                            }
                        </p>

                        <p className="mt-1 text-[10px] text-white/30">
                            To Do
                        </p>

                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3">

                        <p className="text-lg font-semibold text-white">
                            {
                                analytics
                                    .tasks
                                    .inProgress
                            }
                        </p>

                        <p className="mt-1 text-[10px] text-white/30">
                            In Progress
                        </p>

                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3">

                        <p className="text-lg font-semibold text-white">
                            {
                                analytics
                                    .tasks
                                    .completed
                            }
                        </p>

                        <p className="mt-1 text-[10px] text-white/30">
                            Done
                        </p>

                    </div>

                </div>

            </div>

            {/* CLIENTS */}

            <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">

                <div className="mb-6 flex items-center gap-2">

                    <Users
                        size={17}
                        className="text-orange-500"
                    />

                    <h2 className="text-lg font-semibold text-white">
                        Client Overview
                    </h2>

                </div>

                <div className="mb-6 flex items-end justify-between">

                    <div>

                        <p className="text-xs uppercase tracking-[0.12em] text-white/30">
                            Total Clients
                        </p>

                        <p className="mt-2 text-4xl font-semibold text-white">
                            {clientTotal}
                        </p>

                    </div>

                    <Users
                        size={34}
                        className="text-white/10"
                    />

                </div>

                <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-white/30">
                            Active client rate
                        </span>

                        <span className="text-xs font-medium text-orange-400">
                            {clientTotal > 0
                                ? Math.round(
                                    (analytics.clients.active /
                                        clientTotal) *
                                    100
                                )
                                : 0}
                            %
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                            className="h-full rounded-full bg-orange-500 transition-all duration-500"
                            style={{
                                width: `${clientTotal > 0
                                    ? (analytics.clients.active /
                                        clientTotal) *
                                    100
                                    : 0
                                    }%`,
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-4">

                    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">

                        <div>

                            <p className="text-sm text-white/55">
                                Active Clients
                            </p>

                            <p className="mt-1 text-xl font-semibold text-emerald-400">
                                {
                                    analytics
                                        .clients
                                        .active
                                }
                            </p>

                        </div>

                        <div className="h-2 w-2 rounded-full bg-emerald-400" />

                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">

                        <div>

                            <p className="text-sm text-white/55">
                                Inactive Clients
                            </p>

                            <p className="mt-1 text-xl font-semibold text-white/50">
                                {
                                    analytics
                                        .clients
                                        .inactive
                                }
                            </p>

                        </div>

                        <div className="h-2 w-2 rounded-full bg-white/30" />

                    </div>

                </div>

            </div>

            {/* INVOICES */}

            <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">

                <div className="mb-6 flex items-center gap-2">

                    <FileText
                        size={17}
                        className="text-orange-500"
                    />

                    <h2 className="text-lg font-semibold text-white">
                        Invoice Status
                    </h2>

                </div>

                <div className="space-y-4">

                    {[
                        {
                            label: "Paid",
                            value:
                                analytics
                                    .invoices
                                    .paid,
                            className:
                                "text-emerald-400",
                            dot:
                                "bg-emerald-400",
                        },
                        {
                            label: "Sent",
                            value:
                                analytics
                                    .invoices
                                    .sent,
                            className:
                                "text-orange-400",
                            dot:
                                "bg-orange-400",
                        },
                        {
                            label: "Overdue",
                            value:
                                analytics
                                    .invoices
                                    .overdue,
                            className:
                                "text-red-400",
                            dot:
                                "bg-red-400",
                        },
                        {
                            label: "Draft",
                            value:
                                analytics
                                    .invoices
                                    .draft,
                            className:
                                "text-white/50",
                            dot:
                                "bg-white/30",
                        },
                        {
                            label: "Cancelled",
                            value:
                                analytics
                                    .invoices
                                    .cancelled,
                            className:
                                "text-white/30",
                            dot:
                                "bg-white/20",
                        },
                    ].map((item) => (

                        <div
                            key={item.label}
                            className="flex items-center justify-between"
                        >

                            <div className="flex items-center gap-3">

                                <span
                                    className={`h-2 w-2 rounded-full ${item.dot}`}
                                />

                                <span className="text-sm text-white/55">
                                    {
                                        item.label
                                    }
                                </span>

                            </div>

                            <span
                                className={`text-sm font-semibold ${item.className}`}
                            >
                                {item.value}
                            </span>

                        </div>

                    ))}

                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-5">

                    <div className="flex items-center justify-between">

                        <span className="text-xs text-white/30">
                            Overdue Amount
                        </span>

                        <span className="text-sm font-semibold text-red-400">
                            {formatCurrency(
                                analytics
                                    .invoices
                                    .overdueAmount
                            )}
                        </span>

                    </div>

                </div>

            </div>

        </div >

    );
}

export default AnalyticsPage;