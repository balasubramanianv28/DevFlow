import { useState } from "react";
import type { FormEvent } from "react";
import {
    Building2,
    Check,
    ChevronDown,
    Mail,
    MapPin,
    Phone,
    User,
    X,
} from "lucide-react";

import {
    createClient,
} from "../../services/clientService";

import type { Client } from "../../services/clientService";

interface CreateClientModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (client: Client) => void;
}

function CreateClientModal({
    open,
    onClose,
    onCreated,
}: CreateClientModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");

    const [status, setStatus] = useState<
        "active" | "inactive"
    >("active");

    const [statusDropdownOpen, setStatusDropdownOpen] =
        useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    if (!open) {
        return null;
    }

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setAddress("");
        setStatus("active");
        setStatusDropdownOpen(false);
        setError("");
    };

    const handleClose = () => {
        if (saving) {
            return;
        }

        resetForm();
        onClose();
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            setError("Client name is required.");
            return;
        }

        if (!trimmedEmail) {
            setError("Email address is required.");
            return;
        }

        try {
            setSaving(true);

            const client = await createClient({
                name: trimmedName,
                email: trimmedEmail,
                phone: phone.trim(),
                company: company.trim(),
                address: address.trim(),
                status,
            });

            onCreated(client);

            resetForm();
            onClose();
        } catch (err) {
            console.error(err);

            setError(
                "Failed to create client. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose();
                }
            }}
        >
            <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.09] bg-[#141414] shadow-2xl shadow-black/60">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                            <User
                                size={19}
                                className="text-orange-500"
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Add Client
                            </h2>

                            <p className="mt-0.5 text-xs text-white/35">
                                Add a new client to your workspace.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={saving}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/35 transition-all hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* =========================
                    FORM
                ========================= */}

                <form
                    onSubmit={handleSubmit}
                    className="px-6 py-6"
                >

                    {/* Error */}

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* =========================
                        CLIENT NAME
                    ========================= */}

                    <div className="mb-5">
                        <label className="mb-2 block text-xs font-medium text-white/55">
                            Client Name
                            <span className="ml-1 text-orange-500">
                                *
                            </span>
                        </label>

                        <div className="relative">
                            <User
                                size={16}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                            />

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter client name"
                                autoFocus
                                disabled={saving}
                                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#101010] pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* =========================
                        EMAIL + PHONE
                    ========================= */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                        {/* Email */}

                        <div>
                            <label className="mb-2 block text-xs font-medium text-white/55">
                                Email
                                <span className="ml-1 text-orange-500">
                                    *
                                </span>
                            </label>

                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(
                                        event
                                    ) =>
                                        setEmail(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="client@email.com"
                                    disabled={saving}
                                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#101010] pl-10 pr-3 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Phone */}

                        <div>
                            <label className="mb-2 block text-xs font-medium text-white/55">
                                Phone
                            </label>

                            <div className="relative">
                                <Phone
                                    size={16}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                                />

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(
                                        event
                                    ) =>
                                        setPhone(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="+91 98765 43210"
                                    disabled={saving}
                                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#101010] pl-10 pr-3 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5 disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        COMPANY
                    ========================= */}

                    <div className="mb-5">
                        <label className="mb-2 block text-xs font-medium text-white/55">
                            Company
                        </label>

                        <div className="relative">
                            <Building2
                                size={16}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                            />

                            <input
                                type="text"
                                value={company}
                                onChange={(event) =>
                                    setCompany(
                                        event.target.value
                                    )
                                }
                                placeholder="Company name"
                                disabled={saving}
                                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#101010] pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* =========================
                        ADDRESS
                    ========================= */}

                    <div className="mb-5">
                        <label className="mb-2 block text-xs font-medium text-white/55">
                            Address
                        </label>

                        <div className="relative">
                            <MapPin
                                size={16}
                                className="pointer-events-none absolute left-3.5 top-3.5 text-white/25"
                            />

                            <textarea
                                value={address}
                                onChange={(event) =>
                                    setAddress(
                                        event.target.value
                                    )
                                }
                                placeholder="Client address"
                                rows={3}
                                disabled={saving}
                                className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#101010] py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* =========================
                        STATUS
                    ========================= */}

                    <div className="mb-7">
                        <label className="mb-2 block text-xs font-medium text-white/55">
                            Status
                        </label>

                        <div className="relative">

                            <button
                                type="button"
                                onClick={() =>
                                    setStatusDropdownOpen(
                                        (current) =>
                                            !current
                                    )
                                }
                                disabled={saving}
                                className={`flex h-11 w-full items-center justify-between rounded-xl border px-4 text-sm transition-all ${statusDropdownOpen
                                    ? "border-orange-500/40 bg-[#151515] text-white"
                                    : "border-white/[0.08] bg-[#101010] text-white/65 hover:border-white/[0.14]"
                                    }`}
                            >
                                <span className="flex items-center gap-2">

                                    <span
                                        className={`h-2 w-2 rounded-full ${status ===
                                            "active"
                                            ? "bg-emerald-400"
                                            : "bg-white/30"
                                            }`}
                                    />

                                    {status ===
                                        "active"
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-white/30 transition-transform ${statusDropdownOpen
                                        ? "rotate-180 text-orange-500"
                                        : ""
                                        }`}
                                />
                            </button>

                            {statusDropdownOpen && (
                                <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-50 overflow-hidden rounded-xl border border-white/[0.09] bg-[#171717] p-1.5 shadow-2xl shadow-black/50">

                                    {/* Active */}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStatus(
                                                "active"
                                            );

                                            setStatusDropdownOpen(
                                                false
                                            );
                                        }}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${status ===
                                            "active"
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                            Active
                                        </span>

                                        {status ===
                                            "active" && (
                                                <Check
                                                    size={
                                                        15
                                                    }
                                                />
                                            )}
                                    </button>

                                    {/* Inactive */}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStatus(
                                                "inactive"
                                            );

                                            setStatusDropdownOpen(
                                                false
                                            );
                                        }}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all ${status ===
                                            "inactive"
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-white/30" />
                                            Inactive
                                        </span>

                                        {status ===
                                            "inactive" && (
                                                <Check
                                                    size={
                                                        15
                                                    }
                                                />
                                            )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =========================
                        FOOTER ACTIONS
                    ========================= */}

                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 border-t border-white/[0.06] pt-5">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={saving}
                            className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 text-sm font-medium text-white/55 transition-all hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-black shadow-lg shadow-orange-500/10 transition-all hover:bg-orange-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <PlusIcon />
                                    Create Client
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PlusIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    );
}

export default CreateClientModal;