import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

import {
    updateInvoice,
} from "../../services/invoiceService";

import type {
    Invoice,
} from "../../services/invoiceService";

import {
    getClients,
} from "../../services/clientService";

import type {
    Client,
} from "../../services/clientService";

interface EditInvoiceModalProps {
    open: boolean;
    onClose: () => void;
    invoice: Invoice;
    onUpdated: (invoice: Invoice) => void;
}

/* =========================================================
   DATE HELPERS
========================================================= */

const padNumber = (value: number) =>
    String(value).padStart(2, "0");

const formatDateValue = (date: Date) => {
    return `${date.getFullYear()}-${padNumber(
        date.getMonth() + 1
    )}-${padNumber(date.getDate())}`;
};

const parseDateValue = (value: string) => {
    if (!value) {
        return new Date();
    }

    const [year, month, day] =
        value.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
};

const formatDisplayDate = (value: string) => {
    if (!value) {
        return "Select date";
    }

    return parseDateValue(value).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

/* =========================================================
   PREMIUM DATE PICKER
========================================================= */

interface PremiumDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    minDate?: string;
}

function PremiumDatePicker({
    value,
    onChange,
    minDate,
}: PremiumDatePickerProps) {
    const [open, setOpen] =
        useState(false);

    const [calendarDate, setCalendarDate] =
        useState(() =>
            value
                ? parseDateValue(value)
                : new Date()
        );

    const wrapperRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (
            event: MouseEvent
        ) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    const currentYear =
        calendarDate.getFullYear();

    const currentMonth =
        calendarDate.getMonth();

    const monthName =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
            }
        );

    const firstDay = new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();

    const daysInMonth = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

    const previousMonthDays = new Date(
        currentYear,
        currentMonth,
        0
    ).getDate();

    const calendarDays: {
        day: number;
        date: Date;
        currentMonth: boolean;
    }[] = [];

    for (
        let index = firstDay - 1;
        index >= 0;
        index--
    ) {
        const day =
            previousMonthDays - index;

        calendarDays.push({
            day,
            date: new Date(
                currentYear,
                currentMonth - 1,
                day
            ),
            currentMonth: false,
        });
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        calendarDays.push({
            day,
            date: new Date(
                currentYear,
                currentMonth,
                day
            ),
            currentMonth: true,
        });
    }

    let nextDay = 1;

    while (calendarDays.length < 42) {
        calendarDays.push({
            day: nextDay,
            date: new Date(
                currentYear,
                currentMonth + 1,
                nextDay
            ),
            currentMonth: false,
        });

        nextDay++;
    }

    const selectedDate =
        value
            ? parseDateValue(value)
            : null;

    const minimumDate =
        minDate
            ? parseDateValue(minDate)
            : null;

    const today = new Date();

    const isSameDate = (
        first: Date | null,
        second: Date | null
    ) => {
        if (!first || !second) {
            return false;
        }

        return (
            first.getFullYear() ===
            second.getFullYear() &&
            first.getMonth() ===
            second.getMonth() &&
            first.getDate() ===
            second.getDate()
        );
    };

    const isDisabled = (date: Date) => {
        if (!minimumDate) {
            return false;
        }

        const cleanDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        const cleanMinimum = new Date(
            minimumDate.getFullYear(),
            minimumDate.getMonth(),
            minimumDate.getDate()
        );

        return cleanDate < cleanMinimum;
    };

    const selectDate = (date: Date) => {
        if (isDisabled(date)) {
            return;
        }

        onChange(
            formatDateValue(date)
        );

        setCalendarDate(
            new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            )
        );

        setOpen(false);
    };

    const selectToday = () => {
        if (isDisabled(today)) {
            return;
        }

        onChange(
            formatDateValue(today)
        );

        setCalendarDate(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )
        );

        setOpen(false);
    };

    return (
        <div
            ref={wrapperRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() => {
                    setOpen(
                        (current) => !current
                    );

                    if (!open) {
                        setCalendarDate(
                            value
                                ? parseDateValue(
                                    value
                                )
                                : new Date()
                        );
                    }
                }}
                className={`flex h-11 w-full items-center justify-between rounded-xl border px-4 text-left transition-all ${open
                    ? "border-orange-500/50 bg-[#181818] ring-2 ring-orange-500/5"
                    : "border-white/[0.08] bg-[#101010] hover:border-white/[0.14]"
                    }`}
            >
                <div className="flex min-w-0 items-center gap-3">
                    <CalendarDays
                        size={16}
                        className={
                            value
                                ? "shrink-0 text-orange-500"
                                : "shrink-0 text-white/25"
                        }
                    />

                    <span
                        className={
                            value
                                ? "text-sm text-white"
                                : "text-sm text-white/25"
                        }
                    >
                        {formatDisplayDate(
                            value
                        )}
                    </span>
                </div>

                <ChevronDown
                    size={15}
                    className={`shrink-0 text-white/30 transition-transform ${open
                        ? "rotate-180 text-orange-500"
                        : ""
                        }`}
                />
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-[100] w-[300px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#151515] p-4 shadow-2xl shadow-black/60">

                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {monthName}
                            </p>

                            <p className="mt-0.5 text-[11px] text-white/30">
                                {currentYear}
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() =>
                                    setCalendarDate(
                                        new Date(
                                            currentYear,
                                            currentMonth -
                                            1,
                                            1
                                        )
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/40 transition-all hover:border-orange-500/20 hover:bg-orange-500/10 hover:text-orange-500"
                                aria-label="Previous month"
                            >
                                <ChevronLeft
                                    size={15}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setCalendarDate(
                                        new Date(
                                            currentYear,
                                            currentMonth +
                                            1,
                                            1
                                        )
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/40 transition-all hover:border-orange-500/20 hover:bg-orange-500/10 hover:text-orange-500"
                                aria-label="Next month"
                            >
                                <ChevronRight
                                    size={15}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="mb-2 grid grid-cols-7 gap-1">
                        {[
                            "S",
                            "M",
                            "T",
                            "W",
                            "T",
                            "F",
                            "S",
                        ].map(
                            (
                                day,
                                index
                            ) => (
                                <div
                                    key={`${day}-${index}`}
                                    className="flex h-8 items-center justify-center text-[10px] font-semibold text-white/25"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map(
                            (
                                calendarDay,
                                index
                            ) => {
                                const selected =
                                    isSameDate(
                                        calendarDay.date,
                                        selectedDate
                                    );

                                const todayDate =
                                    isSameDate(
                                        calendarDay.date,
                                        today
                                    );

                                const disabled =
                                    isDisabled(
                                        calendarDay.date
                                    );

                                return (
                                    <button
                                        key={`${formatDateValue(
                                            calendarDay.date
                                        )}-${index}`}
                                        type="button"
                                        disabled={
                                            disabled
                                        }
                                        onClick={() =>
                                            selectDate(
                                                calendarDay.date
                                            )
                                        }
                                        className={`relative flex h-8 items-center justify-center rounded-lg text-xs transition-all ${disabled
                                            ? "cursor-not-allowed text-white/10"
                                            : selected
                                                ? "bg-orange-500 font-semibold text-black shadow-lg shadow-orange-500/20"
                                                : calendarDay.currentMonth
                                                    ? "text-white/65 hover:bg-orange-500/10 hover:text-orange-500"
                                                    : "text-white/15 hover:bg-white/[0.04] hover:text-white/40"
                                            }`}
                                    >
                                        {calendarDay.day}

                                        {todayDate &&
                                            !selected && (
                                                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-orange-500" />
                                            )}
                                    </button>
                                );
                            }
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                        <span className="text-[10px] text-white/20">
                            {value
                                ? formatDisplayDate(
                                    value
                                )
                                : "No date selected"}
                        </span>

                        <button
                            type="button"
                            onClick={
                                selectToday
                            }
                            disabled={isDisabled(
                                today
                            )}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-orange-500 transition-all hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-20"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   EDIT INVOICE MODAL
========================================================= */

function EditInvoiceModal({
    open,
    onClose,
    invoice,
    onUpdated,
}: EditInvoiceModalProps) {
    const [invoiceNumber, setInvoiceNumber] =
        useState(invoice.invoiceNumber);

    const [clients, setClients] =
        useState<Client[]>([]);

    const [client, setClient] =
        useState(invoice.client._id);

    const [amount, setAmount] =
        useState(
            String(invoice.amount)
        );

    const [status, setStatus] =
        useState<Invoice["status"]>(
            invoice.status
        );

    const [issueDate, setIssueDate] =
        useState(
            formatDateValue(
                parseDateValue(
                    invoice.issueDate.slice(
                        0,
                        10
                    )
                )
            )
        );

    const [dueDate, setDueDate] =
        useState(
            formatDateValue(
                parseDateValue(
                    invoice.dueDate.slice(
                        0,
                        10
                    )
                )
            )
        );

    const [notes, setNotes] =
        useState(invoice.notes || "");

    const [clientDropdownOpen, setClientDropdownOpen] =
        useState(false);

    const [statusDropdownOpen, setStatusDropdownOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const clientsLoadedRef =
        useRef(false);

    useEffect(() => {
        if (!open || clientsLoadedRef.current) {
            return;
        }

        const loadClients = async () => {
            try {
                const data =
                    await getClients();

                setClients(data);

                clientsLoadedRef.current =
                    true;
            } catch (err) {
                console.error(err);

                setError(
                    "Failed to load clients"
                );
            }
        };

        loadClients();
    }, [open]);

    if (!open) {
        return null;
    }

    const selectedClient =
        clients.find(
            (item) =>
                item._id === client
        );

    const handleSubmit = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setError("");

        if (!invoiceNumber.trim()) {
            setError(
                "Invoice number is required"
            );
            return;
        }

        if (!client) {
            setError(
                "Please select a client"
            );
            return;
        }

        if (
            !amount ||
            Number(amount) < 0
        ) {
            setError(
                "Please enter a valid amount"
            );
            return;
        }

        if (!issueDate) {
            setError(
                "Issue date is required"
            );
            return;
        }

        if (!dueDate) {
            setError(
                "Due date is required"
            );
            return;
        }

        if (
            parseDateValue(dueDate) <
            parseDateValue(issueDate)
        ) {
            setError(
                "Due date cannot be before issue date"
            );
            return;
        }

        try {
            setLoading(true);

            const updatedInvoice =
                await updateInvoice(
                    invoice._id,
                    {
                        invoiceNumber:
                            invoiceNumber.trim(),

                        client,

                        amount: Number(
                            amount
                        ),

                        status,

                        issueDate,

                        dueDate,

                        notes:
                            notes.trim(),
                    }
                );

            onUpdated(
                updatedInvoice
            );

            setError("");
        } catch (err) {
            console.error(err);

            setError(
                "Failed to update invoice"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        setClientDropdownOpen(false);
        setStatusDropdownOpen(false);
        setError("");

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md">

            <div className="flex max-h-[92vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#141414] shadow-2xl shadow-black/70">

                {/* HEADER */}

                <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-5">

                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Edit Invoice
                        </h2>

                        <p className="mt-1 text-xs text-white/30">
                            Update your invoice details.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="overflow-y-auto px-6 py-6"
                >
                    <div className="space-y-5">

                        {/* ERROR */}

                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5">
                                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />

                                <p className="text-sm leading-5 text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* INVOICE NUMBER */}

                        <div>
                            <label className="mb-2 block text-xs font-medium text-white/55">
                                Invoice Number
                            </label>

                            <input
                                type="text"
                                value={
                                    invoiceNumber
                                }
                                onChange={(
                                    event
                                ) =>
                                    setInvoiceNumber(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                autoComplete="off"
                                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#101010] px-4 text-sm text-white outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5"
                            />
                        </div>

                        {/* CLIENT */}

                        <div className="relative">
                            <label className="mb-2 block text-xs font-medium text-white/55">
                                Client
                            </label>

                            <button
                                type="button"
                                onClick={() => {
                                    setClientDropdownOpen(
                                        (
                                            current
                                        ) =>
                                            !current
                                    );

                                    setStatusDropdownOpen(
                                        false
                                    );
                                }}
                                className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-4 text-left transition-all ${clientDropdownOpen
                                    ? "border-orange-500/50 bg-[#181818] ring-2 ring-orange-500/5"
                                    : "border-white/[0.08] bg-[#101010] hover:border-white/[0.14]"
                                    }`}
                            >
                                <div className="min-w-0">
                                    {selectedClient ? (
                                        <>
                                            <p className="truncate text-sm text-white">
                                                {
                                                    selectedClient.name
                                                }
                                            </p>

                                            {selectedClient.company && (
                                                <p className="mt-0.5 truncate text-[10px] text-white/25">
                                                    {
                                                        selectedClient.company
                                                    }
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-sm text-white/25">
                                            Select a client
                                        </span>
                                    )}
                                </div>

                                <ChevronDown
                                    size={16}
                                    className={`shrink-0 text-white/30 transition-transform ${clientDropdownOpen
                                        ? "rotate-180 text-orange-500"
                                        : ""
                                        }`}
                                />
                            </button>

                            {clientDropdownOpen && (
                                <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[110] max-h-52 overflow-y-auto rounded-xl border border-white/[0.09] bg-[#181818] p-1.5 shadow-2xl shadow-black/70">

                                    {clients.length ===
                                        0 ? (
                                        <div className="px-3 py-4 text-center">
                                            <p className="text-sm text-white/35">
                                                No clients found
                                            </p>
                                        </div>
                                    ) : (
                                        clients.map(
                                            (
                                                item
                                            ) => (
                                                <button
                                                    key={
                                                        item._id
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        setClient(
                                                            item._id
                                                        );

                                                        setClientDropdownOpen(
                                                            false
                                                        );
                                                    }}
                                                    className={`w-full rounded-lg px-3 py-2.5 text-left transition-all ${client ===
                                                        item._id
                                                        ? "bg-orange-500/10 text-orange-500"
                                                        : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                                                        }`}
                                                >
                                                    <p className="truncate text-sm">
                                                        {
                                                            item.name
                                                        }
                                                    </p>

                                                    {item.company && (
                                                        <p className="mt-0.5 truncate text-[11px] text-white/25">
                                                            {
                                                                item.company
                                                            }
                                                        </p>
                                                    )}
                                                </button>
                                            )
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* AMOUNT + STATUS */}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-xs font-medium text-white/55">
                                    Amount
                                </label>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            amount
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAmount(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#101010] pl-9 pr-4 text-sm text-white outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="mb-2 block text-xs font-medium text-white/55">
                                    Status
                                </label>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatusDropdownOpen(
                                            (
                                                current
                                            ) =>
                                                !current
                                        );

                                        setClientDropdownOpen(
                                            false
                                        );
                                    }}
                                    className={`flex h-11 w-full items-center justify-between rounded-xl border px-4 text-left text-sm transition-all ${statusDropdownOpen
                                        ? "border-orange-500/50 bg-[#181818] ring-2 ring-orange-500/5"
                                        : "border-white/[0.08] bg-[#101010] hover:border-white/[0.14]"
                                        }`}
                                >
                                    <span className="text-white">
                                        {status
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase() +
                                            status.slice(
                                                1
                                            )}
                                    </span>

                                    <ChevronDown
                                        size={
                                            16
                                        }
                                        className={`text-white/30 transition-transform ${statusDropdownOpen
                                            ? "rotate-180 text-orange-500"
                                            : ""
                                            }`}
                                    />
                                </button>

                                {statusDropdownOpen && (
                                    <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[110] rounded-xl border border-white/[0.09] bg-[#181818] p-1.5 shadow-2xl shadow-black/70">

                                        {(
                                            [
                                                "draft",
                                                "sent",
                                                "paid",
                                                "overdue",
                                                "cancelled",
                                            ] as const
                                        ).map(
                                            (
                                                item
                                            ) => (
                                                <button
                                                    key={
                                                        item
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        setStatus(
                                                            item
                                                        );

                                                        setStatusDropdownOpen(
                                                            false
                                                        );
                                                    }}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${status ===
                                                        item
                                                        ? "bg-orange-500/10 text-orange-500"
                                                        : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                                                        }`}
                                                >
                                                    <span>
                                                        {item
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase() +
                                                            item.slice(
                                                                1
                                                            )}
                                                    </span>

                                                    {status ===
                                                        item && (
                                                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                                        )}
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DATES */}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-xs font-medium text-white/55">
                                    Issue Date
                                </label>

                                <PremiumDatePicker
                                    value={
                                        issueDate
                                    }
                                    onChange={
                                        setIssueDate
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-white/55">
                                    Due Date
                                </label>

                                <PremiumDatePicker
                                    value={
                                        dueDate
                                    }
                                    onChange={
                                        setDueDate
                                    }
                                    minDate={
                                        issueDate
                                    }
                                />
                            </div>
                        </div>

                        {/* NOTES */}

                        <div>
                            <label className="mb-2 block text-xs font-medium text-white/55">
                                Notes
                            </label>

                            <textarea
                                value={notes}
                                onChange={(
                                    event
                                ) =>
                                    setNotes(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Additional notes..."
                                rows={4}
                                className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#101010] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5"
                            />
                        </div>
                    </div>

                    {/* FOOTER */}

                    <div className="mt-7 flex items-center justify-end gap-3 border-t border-white/[0.06] pt-5">

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={loading}
                            className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/45 transition-all hover:bg-white/[0.05] hover:text-white disabled:opacity-30"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-orange-500/10 transition-all hover:bg-orange-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditInvoiceModal;