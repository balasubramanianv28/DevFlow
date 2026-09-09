import { useState } from "react";
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
    updateClient,
} from "../../services/clientService";

import type { Client } from "../../services/clientService";

interface EditClientModalProps {
    open: boolean;
    onClose: () => void;
    client: Client;
    onUpdated: (client: Client) => void;
}

function EditClientModal({
    open,
    onClose,
    client,
    onUpdated,
}: EditClientModalProps) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [name, setName] = useState(client.name);
    const [email, setEmail] = useState(client.email);
    const [phone, setPhone] = useState(client.phone || "");
    const [company, setCompany] = useState(
        client.company || ""
    );
    const [address, setAddress] = useState(
        client.address || ""
    );

    const [status, setStatus] = useState<
        "active" | "inactive"
    >(client.status);

    const [statusDropdownOpen, setStatusDropdownOpen] =
        useState(false);

    if (!open) {
        return null;
    }

    const handleClose = () => {
        if (saving) {
            return;
        }

        setError("");
        setStatusDropdownOpen(false);
        onClose();
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
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

            const updatedClient =
                await updateClient(
                    client._id,
                    {
                        name: trimmedName,
                        email: trimmedEmail,
                        phone: phone.trim(),
                        company: company.trim(),
                        address: address.trim(),
                        status,
                    }
                );

            onUpdated(updatedClient);
            onClose();
        } catch (err) {
            console.error(err);

            setError(
                "Failed to update client. Please try again."
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

                {/* HEADER */}

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
                                Edit Client
                            </h2>

                            <p className="mt-0.5 text-xs text-white/35">
                                Update client information.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={saving}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/35 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="px-6 py-6"
                >
                    {error && (
                        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* NAME */}

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
                                disabled={saving}
                                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#101010] pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* EMAIL + PHONE */}

                    <div className="grid grid-cols-1 gap-4 mb-5 sm:grid-cols-2">

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
                                    onChange={(event) =>
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
                                    onChange={(event) =>
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

                    {/* COMPANY */}

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

                    {/* ADDRESS */}

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

                    {/* STATUS */}

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

                    {/* FOOTER */}

                    <div className="flex flex-col-reverse gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-end">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={saving}
                            className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 text-sm font-medium text-white/55 transition-all hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
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
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditClientModal;