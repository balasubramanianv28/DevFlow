import {
    CalendarDays,
    Building2,
    Mail,
    FileText,
    Printer,
    X,
} from "lucide-react";

import type { Invoice } from "../../services/invoiceService";

interface ViewInvoiceModalProps {
    open: boolean;
    onClose: () => void;
    invoice: Invoice;
}

const statusConfig: Record<
    Invoice["status"],
    {
        label: string;
        className: string;
    }
> = {
    draft: {
        label: "Draft",
        className:
            "bg-white/10 text-white/80 border-white/10",
    },

    sent: {
        label: "Sent",
        className:
            "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },

    paid: {
        label: "Paid",
        className:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },

    overdue: {
        label: "Overdue",
        className:
            "bg-red-500/10 text-red-400 border-red-500/20",
    },

    cancelled: {
        label: "Cancelled",
        className:
            "bg-gray-500/10 text-gray-400 border-gray-500/20",
    },
};

const formatDate = (date: string) => {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
};

function ViewInvoiceModal({
    open,
    onClose,
    invoice,
}: ViewInvoiceModalProps) {
    if (!open) {
        return null;
    }

    const status = statusConfig[invoice.status];

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* =====================================================
                PRINT STYLES
            ===================================================== */}

            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden !important;
                        }

                        .invoice-print-area {
                            display: block !important;
                            visibility: visible !important;
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            min-height: 100vh !important;
                            margin: 0 !important;
                            padding: 40px !important;
                            background: white !important;
                            color: #111 !important;
                            border: none !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            overflow: visible !important;
                        }

                        .invoice-print-area * {
                            visibility: visible !important;
                        }

                        .invoice-print-area .print-hidden {
                            display: none !important;
                        }

                        .invoice-print-text {
                            color: #111 !important;
                        }

                        .invoice-print-muted {
                            color: #666 !important;
                        }

                        .invoice-print-border {
                            border-color: #ddd !important;
                        }

                        .invoice-print-status {
                            border: 1px solid #ddd !important;
                            background: #f5f5f5 !important;
                            color: #333 !important;
                        }

                        .invoice-print-amount {
                            color: #111 !important;
                        }

                        @page {
                            size: A4;
                            margin: 0;
                        }
                    }
                `}
            </style>

            {/* =====================================================
                SCREEN MODAL
            ===================================================== */}

            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">

                <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/50">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d0d0d]/95 px-6 py-5 backdrop-blur-xl">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-orange-400">
                                Invoice Details
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-white">
                                {invoice.invoiceNumber}
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="space-y-6 p-6">

                        {/* SUMMARY */}

                        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <p className="text-sm text-white/40">
                                        Invoice Number
                                    </p>

                                    <p className="mt-1 text-lg font-semibold text-white">
                                        {invoice.invoiceNumber}
                                    </p>
                                </div>

                                <div className="sm:text-right">

                                    <p className="text-sm text-white/40">
                                        Total Amount
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-orange-400">
                                        {formatAmount(
                                            invoice.amount
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 border-t border-white/10 pt-4">

                                <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                                >
                                    {status.label}
                                </span>
                            </div>
                        </div>

                        {/* CLIENT */}

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <Building2
                                    size={17}
                                    className="text-orange-400"
                                />

                                <h3 className="text-sm font-semibold text-white">
                                    Client Information
                                </h3>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">

                                <p className="text-base font-semibold text-white">
                                    {invoice.client.name}
                                </p>

                                {invoice.client.company && (
                                    <p className="mt-1 text-sm text-white/45">
                                        {invoice.client.company}
                                    </p>
                                )}

                                <div className="mt-4 flex items-center gap-2 text-sm text-white/60">

                                    <Mail
                                        size={15}
                                        className="text-white/35"
                                    />

                                    <span>
                                        {invoice.client.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* DATES */}

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <CalendarDays
                                    size={17}
                                    className="text-orange-400"
                                />

                                <h3 className="text-sm font-semibold text-white">
                                    Invoice Dates
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">

                                    <p className="text-xs text-white/40">
                                        Issue Date
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-white">
                                        {formatDate(
                                            invoice.issueDate
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">

                                    <p className="text-xs text-white/40">
                                        Due Date
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-white">
                                        {formatDate(
                                            invoice.dueDate
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* NOTES */}

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <FileText
                                    size={17}
                                    className="text-orange-400"
                                />

                                <h3 className="text-sm font-semibold text-white">
                                    Notes
                                </h3>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">

                                {invoice.notes ? (
                                    <p className="whitespace-pre-wrap text-sm leading-6 text-white/65">
                                        {invoice.notes}
                                    </p>
                                ) : (
                                    <p className="text-sm text-white/30">
                                        No notes added.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* CREATED */}

                        <div className="border-t border-white/10 pt-4">

                            <p className="text-xs text-white/30">
                                Created on{" "}
                                <span className="text-white/50">
                                    {formatDate(
                                        invoice.createdAt
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="sticky bottom-0 flex flex-col gap-2 border-t border-white/10 bg-[#0d0d0d]/95 px-6 py-4 backdrop-blur-xl sm:flex-row">

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-500/25 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/15"
                        >
                            <Printer size={16} />
                            Print Invoice
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* =====================================================
                PRINTABLE INVOICE
            ===================================================== */}

            <div className="invoice-print-area hidden min-h-screen bg-white p-10 text-black">

                {/* =================================================
                    PRINT HEADER
                ================================================= */}

                <div className="flex items-start justify-between border-b-2 border-black/10 pb-8">

                    <div>

                        <p className="text-3xl font-bold tracking-tight invoice-print-text">
                            DEVFLOW
                        </p>

                        <p className="mt-2 text-sm invoice-print-muted">
                            Professional Invoice
                        </p>
                    </div>

                    <div className="text-right">

                        <p className="text-sm font-medium uppercase tracking-wider invoice-print-muted">
                            Invoice
                        </p>

                        <p className="mt-1 text-2xl font-bold invoice-print-text">
                            {invoice.invoiceNumber}
                        </p>
                    </div>
                </div>

                {/* =================================================
                    BILL TO + DATES
                ================================================= */}

                <div className="mt-10 grid grid-cols-2 gap-10">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-wider invoice-print-muted">
                            Bill To
                        </p>

                        <p className="mt-3 text-lg font-semibold invoice-print-text">
                            {invoice.client.name}
                        </p>

                        {invoice.client.company && (
                            <p className="mt-1 text-sm invoice-print-muted">
                                {invoice.client.company}
                            </p>
                        )}

                        <p className="mt-3 text-sm invoice-print-muted">
                            {invoice.client.email}
                        </p>
                    </div>

                    <div className="text-right">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wider invoice-print-muted">
                                Issue Date
                            </p>

                            <p className="mt-2 text-sm invoice-print-text">
                                {formatDate(
                                    invoice.issueDate
                                )}
                            </p>
                        </div>

                        <div className="mt-5">

                            <p className="text-xs font-semibold uppercase tracking-wider invoice-print-muted">
                                Due Date
                            </p>

                            <p className="mt-2 text-sm invoice-print-text">
                                {formatDate(
                                    invoice.dueDate
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    AMOUNT TABLE
                ================================================= */}

                <div className="mt-12 overflow-hidden rounded-xl border invoice-print-border">

                    <div className="grid grid-cols-[1fr_180px] border-b bg-gray-50 px-5 py-4">

                        <p className="text-xs font-semibold uppercase tracking-wider invoice-print-muted">
                            Description
                        </p>

                        <p className="text-right text-xs font-semibold uppercase tracking-wider invoice-print-muted">
                            Amount
                        </p>
                    </div>

                    <div className="grid grid-cols-[1fr_180px] px-5 py-6">

                        <div>

                            <p className="font-medium invoice-print-text">
                                {invoice.invoiceNumber}
                            </p>

                            <p className="mt-1 text-sm invoice-print-muted">
                                Invoice payment
                            </p>
                        </div>

                        <p className="text-right text-lg font-semibold invoice-print-amount">
                            {formatAmount(
                                invoice.amount
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t invoice-print-border px-5 py-5">

                        <p className="text-sm font-semibold invoice-print-text">
                            Total
                        </p>

                        <p className="text-2xl font-bold invoice-print-amount">
                            {formatAmount(
                                invoice.amount
                            )}
                        </p>
                    </div>
                </div>

                {/* =================================================
                    STATUS
                ================================================= */}

                <div className="mt-8">

                    <span className="invoice-print-status inline-flex rounded-full px-4 py-2 text-sm font-medium">
                        Status: {status.label}
                    </span>
                </div>

                {/* =================================================
                    NOTES
                ================================================= */}

                {invoice.notes && (
                    <div className="mt-10 border-t invoice-print-border pt-6">

                        <p className="text-xs font-semibold uppercase tracking-wider invoice-print-muted">
                            Notes
                        </p>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 invoice-print-text">
                            {invoice.notes}
                        </p>
                    </div>
                )}

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="mt-16 border-t invoice-print-border pt-6 text-center">

                    <p className="text-sm font-medium invoice-print-text">
                        Thank you for your business.
                    </p>

                    <p className="mt-2 text-xs invoice-print-muted">
                        Generated by DEVFLOW
                    </p>
                </div>
            </div>
        </>
    );
}

export default ViewInvoiceModal;