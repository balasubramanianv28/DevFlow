import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    ChevronDown,
    CircleDollarSign,
    Clock3,
    Eye,
    FileText,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

import {
    deleteInvoice,
    getInvoices,
} from "../../services/invoiceService";

import type { Invoice } from "../../services/invoiceService";

import CreateInvoiceModal from "../../components/Invoices/CreateInvoiceModal";
import EditInvoiceModal from "../../components/Invoices/EditInvoiceModal";
import ViewInvoiceModal from "../../components/Invoices/ViewInvoiceModal";

function Invoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] = useState<
        "all" | Invoice["status"]
    >("all");

    const [statusDropdownOpen, setStatusDropdownOpen] =
        useState(false);

    const [deleteTarget, setDeleteTarget] =
        useState<Invoice | null>(null);

    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");

    const [createModalOpen, setCreateModalOpen] =
        useState(false);

    const [editTarget, setEditTarget] =
        useState<Invoice | null>(null);

    const [viewTarget, setViewTarget] =
        useState<Invoice | null>(null);

    /* =========================================================
       LOAD INVOICES
    ========================================================= */

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getInvoices();

                setInvoices(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load invoices");
            } finally {
                setLoading(false);
            }
        };

        loadInvoices();
    }, []);

    /* =========================================================
       FILTER
    ========================================================= */

    const filteredInvoices = useMemo(() => {
        const search = searchQuery
            .toLowerCase()
            .trim();

        return invoices.filter((invoice) => {
            const matchesSearch =
                !search ||
                invoice.invoiceNumber
                    .toLowerCase()
                    .includes(search) ||
                invoice.client.name
                    .toLowerCase()
                    .includes(search) ||
                invoice.client.email
                    .toLowerCase()
                    .includes(search) ||
                invoice.client.company
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "all" ||
                invoice.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        invoices,
        searchQuery,
        statusFilter,
    ]);

    /* =========================================================
       STATS
    ========================================================= */

    const paidAmount = invoices
        .filter(
            (invoice) =>
                invoice.status === "paid"
        )
        .reduce(
            (total, invoice) =>
                total +
                Number(invoice.amount || 0),
            0
        );

    const pendingAmount = invoices
        .filter(
            (invoice) =>
                invoice.status === "sent" ||
                invoice.status === "overdue"
        )
        .reduce(
            (total, invoice) =>
                total +
                Number(invoice.amount || 0),
            0
        );

    /* =========================================================
       HELPERS
    ========================================================= */

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getStatusLabel = (
        status: Invoice["status"]
    ) => {
        switch (status) {
            case "draft":
                return "Draft";

            case "sent":
                return "Sent";

            case "paid":
                return "Paid";

            case "overdue":
                return "Overdue";

            case "cancelled":
                return "Cancelled";

            default:
                return status;
        }
    };

    const getStatusClasses = (
        status: Invoice["status"]
    ) => {
        switch (status) {
            case "paid":
                return {
                    wrapper:
                        "bg-emerald-500/10 text-emerald-400",
                    dot: "bg-emerald-400",
                };

            case "overdue":
                return {
                    wrapper:
                        "bg-red-500/10 text-red-400",
                    dot: "bg-red-400",
                };

            case "sent":
                return {
                    wrapper:
                        "bg-orange-500/10 text-orange-400",
                    dot: "bg-orange-400",
                };

            case "draft":
                return {
                    wrapper:
                        "bg-white/[0.06] text-white/45",
                    dot: "bg-white/30",
                };

            case "cancelled":
                return {
                    wrapper:
                        "bg-white/[0.04] text-white/30",
                    dot: "bg-white/20",
                };

            default:
                return {
                    wrapper:
                        "bg-white/[0.06] text-white/45",
                    dot: "bg-white/30",
                };
        }
    };

    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await deleteInvoice(
                deleteTarget._id
            );

            setInvoices((currentInvoices) =>
                currentInvoices.filter(
                    (invoice) =>
                        invoice._id !==
                        deleteTarget._id
                )
            );

            setDeleteTarget(null);
        } catch (err) {
            console.error(err);

            setError(
                "Failed to delete invoice"
            );
        } finally {
            setDeleting(false);
        }
    };

    const statusLabel =
        statusFilter === "all"
            ? "All Status"
            : getStatusLabel(statusFilter);

    return (
        <div className="mx-auto w-full max-w-[1600px] px-6 pt-6 pb-10 lg:px-8 xl:px-10">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    <div className="mb-2 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                            <CircleDollarSign
                                size={20}
                                className="text-orange-500"
                            />
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Invoices
                        </h1>
                    </div>

                    <p className="text-sm text-white/40">
                        Create, manage and track your invoices.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setCreateModalOpen(true)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/10 transition-all hover:bg-orange-400 active:scale-[0.98]"
                >
                    <Plus size={17} />
                    Create Invoice
                </button>
            </div>

            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (
                <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 text-sm text-red-400">

                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => setError("")}
                        className="text-red-400/60 transition-colors hover:text-red-400"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* =====================================================
                STATS
            ===================================================== */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* TOTAL */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-white/[0.12]">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Total Invoices
                            </p>

                            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                {invoices.length}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/60">
                            <FileText size={19} />
                        </div>
                    </div>
                </div>

                {/* PAID */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-emerald-500/20">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Paid Amount
                            </p>

                            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                                {formatCurrency(
                                    paidAmount
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

                {/* PENDING */}

                <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-orange-500/20">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Pending Amount
                            </p>

                            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                                {formatCurrency(
                                    pendingAmount
                                )}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                            <Clock3 size={19} />
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                SEARCH + FILTER
            ===================================================== */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                    <Search
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(
                                event.target.value
                            )
                        }
                        placeholder="Search invoice number, client or company..."
                        className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#111111] pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5"
                    />
                </div>

                {/* STATUS */}

                <div className="relative w-full sm:w-[175px]">

                    <button
                        type="button"
                        onClick={() =>
                            setStatusDropdownOpen(
                                (current) =>
                                    !current
                            )
                        }
                        className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 text-sm transition-all ${statusDropdownOpen
                            ? "border-orange-500/50 bg-[#151515] text-white"
                            : "border-white/[0.08] bg-[#111111] text-white/70 hover:border-white/[0.14]"
                            }`}
                    >
                        <span>
                            {statusLabel}
                        </span>

                        <ChevronDown
                            size={16}
                            className={`text-white/35 transition-transform duration-200 ${statusDropdownOpen
                                ? "rotate-180 text-orange-500"
                                : ""
                                }`}
                        />
                    </button>

                    {statusDropdownOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-white/[0.09] bg-[#151515] p-1.5 shadow-2xl shadow-black/50">

                            {(
                                [
                                    ["all", "All Status"],
                                    ["draft", "Draft"],
                                    ["sent", "Sent"],
                                    ["paid", "Paid"],
                                    ["overdue", "Overdue"],
                                    ["cancelled", "Cancelled"],
                                ] as const
                            ).map(
                                ([
                                    value,
                                    label,
                                ]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setStatusFilter(
                                                value
                                            );

                                            setStatusDropdownOpen(
                                                false
                                            );
                                        }}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${statusFilter ===
                                            value
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                                            }`}
                                    >
                                        <span>
                                            {label}
                                        </span>

                                        {statusFilter ===
                                            value && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                            )}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* =====================================================
                INVOICES TABLE
            ===================================================== */}

            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111111]">

                {!loading &&
                    filteredInvoices.length > 0 && (
                        <div className="hidden grid-cols-[1fr_1.5fr_1fr_0.9fr_1fr_140px] gap-4 border-b border-white/[0.06] bg-white/[0.015] px-5 py-3.5 lg:grid">

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Invoice
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Client
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Amount
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Status
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Due Date
                            </span>

                            <span className="text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Actions
                            </span>
                        </div>
                    )}

                {/* LOADING */}

                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center">

                        <div className="flex flex-col items-center gap-3">

                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-orange-500" />

                            <p className="text-sm text-white/35">
                                Loading invoices...
                            </p>
                        </div>
                    </div>
                ) : filteredInvoices.length === 0 ? (

                    /* EMPTY */

                    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/[0.06]">

                            <FileText
                                size={28}
                                className="text-orange-500/70"
                            />
                        </div>

                        <h3 className="text-base font-semibold text-white">
                            {searchQuery ||
                                statusFilter !==
                                "all"
                                ? "No matching invoices"
                                : "No invoices yet"}
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                            {searchQuery ||
                                statusFilter !==
                                "all"
                                ? "Try changing your search or status filter."
                                : "Create your first invoice to start tracking payments."}
                        </p>

                        {!searchQuery &&
                            statusFilter ===
                            "all" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCreateModalOpen(
                                            true
                                        )
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2.5 text-sm font-medium text-orange-500 transition-all hover:bg-orange-500/15"
                                >
                                    <Plus size={16} />
                                    Create your first invoice
                                </button>
                            )}
                    </div>
                ) : (

                    /* LIST */

                    <div>
                        {filteredInvoices.map(
                            (
                                invoice,
                                index
                            ) => {
                                const statusStyles =
                                    getStatusClasses(
                                        invoice.status
                                    );

                                return (
                                    <div
                                        key={
                                            invoice._id
                                        }
                                        className={`group px-5 py-5 transition-colors hover:bg-white/[0.02] ${index !==
                                            filteredInvoices.length -
                                            1
                                            ? "border-b border-white/[0.055]"
                                            : ""
                                            }`}
                                    >
                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.5fr_1fr_0.9fr_1fr_140px] lg:items-center">

                                            {/* INVOICE */}

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-white/50">
                                                    <FileText
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-medium text-white">
                                                        {
                                                            invoice.invoiceNumber
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-white/30">
                                                        Issued{" "}
                                                        {formatDate(
                                                            invoice.issueDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* CLIENT */}

                                            <div className="min-w-0">

                                                <p className="truncate text-sm text-white/65">
                                                    {
                                                        invoice
                                                            .client
                                                            .name
                                                    }
                                                </p>

                                                <p className="mt-1 truncate text-xs text-white/30">
                                                    {
                                                        invoice
                                                            .client
                                                            .company
                                                    }
                                                </p>
                                            </div>

                                            {/* AMOUNT */}

                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    {formatCurrency(
                                                        Number(
                                                            invoice.amount
                                                        )
                                                    )}
                                                </p>
                                            </div>

                                            {/* STATUS */}

                                            <div>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles.wrapper}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`}
                                                    />

                                                    {getStatusLabel(
                                                        invoice.status
                                                    )}
                                                </span>
                                            </div>

                                            {/* DUE DATE */}

                                            <div>
                                                <p
                                                    className={`text-sm ${invoice.status ===
                                                        "overdue"
                                                        ? "text-red-400"
                                                        : "text-white/55"
                                                        }`}
                                                >
                                                    {formatDate(
                                                        invoice.dueDate
                                                    )}
                                                </p>
                                            </div>

                                            {/* ACTIONS */}

                                            <div className="flex items-center justify-start gap-1 lg:justify-end">

                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setViewTarget(
                                                            invoice
                                                        );
                                                    }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-orange-500"
                                                    title="View invoice"
                                                >
                                                    <Eye
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>

                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditTarget(
                                                            invoice
                                                        )
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-orange-500"
                                                    title="Edit invoice"
                                                >
                                                    <Pencil
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>

                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            invoice
                                                        )
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-red-500/10 hover:text-red-400"
                                                    title="Delete invoice"
                                                >
                                                    <Trash2
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>

            {/* =====================================================
                RESULT COUNT
            ===================================================== */}

            {!loading &&
                filteredInvoices.length > 0 && (
                    <div className="mt-4 px-1">
                        <p className="text-xs text-white/25">
                            Showing{" "}
                            <span className="text-white/45">
                                {
                                    filteredInvoices.length
                                }
                            </span>{" "}
                            of{" "}
                            <span className="text-white/45">
                                {invoices.length}
                            </span>{" "}
                            invoices
                        </p>
                    </div>
                )}

            {/* =====================================================
                CREATE INVOICE MODAL
            ===================================================== */}

            <CreateInvoiceModal
                open={createModalOpen}
                onClose={() =>
                    setCreateModalOpen(false)
                }
                onCreated={(invoice) => {
                    setInvoices(
                        (currentInvoices) => [
                            invoice,
                            ...currentInvoices,
                        ]
                    );

                    setCreateModalOpen(false);
                }}
            />

            {/* =====================================================
                VIEW INVOICE MODAL
            ===================================================== */}

            {viewTarget && (
                <ViewInvoiceModal
                    open={Boolean(viewTarget)}
                    onClose={() => {
                        setViewTarget(null);
                    }}
                    invoice={viewTarget}
                />
            )}

            {/* =====================================================
                EDIT INVOICE MODAL
            ===================================================== */}

            {editTarget && (
                <EditInvoiceModal
                    open={true}
                    onClose={() => {
                        setEditTarget(null);
                    }}
                    invoice={editTarget}
                    onUpdated={(updatedInvoice) => {
                        setInvoices(
                            (currentInvoices) =>
                                currentInvoices.map(
                                    (
                                        currentInvoice
                                    ) =>
                                        currentInvoice._id ===
                                            updatedInvoice._id
                                            ? updatedInvoice
                                            : currentInvoice
                                )
                        );

                        setEditTarget(null);
                    }}
                />
            )}

            {/* =====================================================
                DELETE MODAL
            ===================================================== */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">

                    <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414] shadow-2xl">

                        <div className="p-6">

                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                <Trash2 size={19} />
                            </div>

                            <h2 className="text-lg font-semibold text-white">
                                Delete Invoice?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/40">
                                Are you sure you want to
                                delete{" "}
                                <span className="font-medium text-white/70">
                                    {
                                        deleteTarget.invoiceNumber
                                    }
                                </span>
                                ? This action cannot be
                                undone.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] bg-white/[0.015] px-6 py-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                disabled={deleting}
                                className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={deleting}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 size={15} />

                                {deleting
                                    ? "Deleting..."
                                    : "Delete Invoice"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Invoices;