import { useEffect, useMemo, useState } from "react";
import {
    Building2,
    ChevronDown,
    Mail,
    Phone,
    Search,
    Users,
    UserCheck,
    UserX,
    Trash2,
    Pencil,
    Plus,
    X,
} from "lucide-react";

import {
    deleteClient,
    getClients,
} from "../../services/clientService";

import type { Client } from "../../services/clientService";

import CreateClientModal from "../../components/Clients/CreateClientModal";
import EditClientModal from "../../components/Clients/EditClientModal";

function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");

    const [statusFilter, setStatusFilter] = useState<
        "all" | "active" | "inactive"
    >("all");

    const [statusDropdownOpen, setStatusDropdownOpen] =
        useState(false);

    const [deleteTarget, setDeleteTarget] =
        useState<Client | null>(null);

    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");

    const [createModalOpen, setCreateModalOpen] =
        useState(false);

    const [editTarget, setEditTarget] =
        useState<Client | null>(null);

    useEffect(() => {
        const loadClients = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getClients();

                setClients(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load clients");
            } finally {
                setLoading(false);
            }
        };

        loadClients();
    }, []);

    const filteredClients = useMemo(() => {
        const search = searchQuery
            .toLowerCase()
            .trim();

        return clients.filter((client) => {
            const matchesSearch =
                !search ||
                client.name
                    .toLowerCase()
                    .includes(search) ||
                client.email
                    .toLowerCase()
                    .includes(search) ||
                client.company
                    .toLowerCase()
                    .includes(search) ||
                client.phone
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "all" ||
                client.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [clients, searchQuery, statusFilter]);

    const activeClients = clients.filter(
        (client) => client.status === "active"
    ).length;

    const inactiveClients = clients.filter(
        (client) => client.status === "inactive"
    ).length;

    const handleDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await deleteClient(deleteTarget._id);

            setClients((currentClients) =>
                currentClients.filter(
                    (client) =>
                        client._id !== deleteTarget._id
                )
            );

            setDeleteTarget(null);
        } catch (err) {
            console.error(err);
            setError("Failed to delete client");
        } finally {
            setDeleting(false);
        }
    };

    const statusLabel =
        statusFilter === "all"
            ? "All Status"
            : statusFilter === "active"
                ? "Active"
                : "Inactive";

    return (
        <div className="mx-auto w-full max-w-[1600px] px-6 pt-6 pb-10 lg:px-8 xl:px-10">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    <div className="mb-2 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                            <Users
                                size={20}
                                className="text-orange-500"
                            />
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Clients
                        </h1>
                    </div>

                    <p className="text-sm text-white/40">
                        Manage your clients and business relationships.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setCreateModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/10 transition-all hover:bg-orange-400 active:scale-[0.98]"
                >
                    <Plus size={17} />
                    Add Client
                </button>
            </div>

            {/* =========================
                ERROR
            ========================= */}

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

            {/* =========================
                STATS
            ========================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* Total */}

                <div className="group rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-white/[0.12]">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Total Clients
                            </p>

                            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                {clients.length}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/60">
                            <Users size={19} />
                        </div>
                    </div>
                </div>

                {/* Active */}

                <div className="group rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-orange-500/20">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Active Clients
                            </p>

                            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                {activeClients}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                            <UserCheck size={19} />
                        </div>
                    </div>
                </div>

                {/* Inactive */}

                <div className="group rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all hover:border-white/[0.12]">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                                Inactive Clients
                            </p>

                            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                {inactiveClients}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/50">
                            <UserX size={19} />
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================
                SEARCH + FILTER
            ========================= */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">

                {/* Search */}

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
                        placeholder="Search by name, email, company or phone..."
                        className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#111111] pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/5"
                    />
                </div>

                {/* Status */}

                <div className="relative w-full sm:w-[170px]">

                    <button
                        type="button"
                        onClick={() =>
                            setStatusDropdownOpen(
                                (current) => !current
                            )
                        }
                        className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 text-sm transition-all ${statusDropdownOpen
                            ? "border-orange-500/50 bg-[#151515] text-white"
                            : "border-white/[0.08] bg-[#111111] text-white/70 hover:border-white/[0.14]"
                            }`}
                    >
                        <span>{statusLabel}</span>

                        <ChevronDown
                            size={16}
                            className={`shrink-0 text-white/35 transition-transform duration-200 ${statusDropdownOpen
                                ? "rotate-180 text-orange-500"
                                : ""
                                }`}
                        />
                    </button>

                    {statusDropdownOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-full min-w-[170px] overflow-hidden rounded-xl border border-white/[0.09] bg-[#151515] p-1.5 shadow-2xl shadow-black/50">

                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter("all");
                                    setStatusDropdownOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${statusFilter === "all"
                                    ? "bg-orange-500/10 text-orange-500"
                                    : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                <span>All Status</span>

                                {statusFilter === "all" && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter("active");
                                    setStatusDropdownOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${statusFilter === "active"
                                    ? "bg-orange-500/10 text-orange-500"
                                    : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                <span>Active</span>

                                {statusFilter === "active" && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter("inactive");
                                    setStatusDropdownOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${statusFilter === "inactive"
                                    ? "bg-orange-500/10 text-orange-500"
                                    : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                <span>Inactive</span>

                                {statusFilter === "inactive" && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* =========================
                CLIENT CONTAINER
            ========================= */}

            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111111]">

                {/* Table Header */}

                {!loading &&
                    filteredClients.length > 0 && (
                        <div className="hidden grid-cols-[1.4fr_1.2fr_1.5fr_0.8fr_120px] gap-4 border-b border-white/[0.06] bg-white/[0.015] px-5 py-3.5 lg:grid">

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Client
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Company
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Contact
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Status
                            </span>

                            <span className="text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                                Actions
                            </span>
                        </div>
                    )}

                {/* Loading */}

                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center">

                        <div className="flex flex-col items-center gap-3">

                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-orange-500" />

                            <p className="text-sm text-white/35">
                                Loading clients...
                            </p>
                        </div>
                    </div>
                ) : filteredClients.length === 0 ? (

                    /* Empty */

                    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/[0.06]">
                            <Users
                                size={28}
                                className="text-orange-500/70"
                            />
                        </div>

                        <h3 className="text-base font-semibold text-white">
                            {searchQuery ||
                                statusFilter !== "all"
                                ? "No matching clients"
                                : "No clients yet"}
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                            {searchQuery ||
                                statusFilter !== "all"
                                ? "Try changing your search or status filter."
                                : "Add your first client to start managing your business relationships."}
                        </p>

                        {!searchQuery &&
                            statusFilter === "all" && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCreateModalOpen(true);
                                    }}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2.5 text-sm font-medium text-orange-500 transition-all hover:bg-orange-500/15"
                                >
                                    <Plus size={16} />
                                    Add your first client
                                </button>
                            )}
                    </div>

                ) : (

                    /* Client List */

                    <div>
                        {filteredClients.map(
                            (client, index) => (
                                <div
                                    key={client._id}
                                    className={`group px-5 py-5 transition-colors hover:bg-white/[0.02] ${index !==
                                        filteredClients.length - 1
                                        ? "border-b border-white/[0.055]"
                                        : ""
                                        }`}
                                >
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1.2fr_1.5fr_0.8fr_120px] lg:items-center">

                                        {/* Client */}

                                        <div className="flex min-w-0 items-center gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/10 bg-orange-500/10">
                                                <span className="text-sm font-semibold text-orange-500">
                                                    {client.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-medium text-white">
                                                    {client.name}
                                                </p>

                                                {client.phone && (
                                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-white/30">

                                                        <Phone size={11} />

                                                        {client.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Company */}

                                        <div className="flex items-center gap-2 text-sm text-white/55">

                                            <Building2
                                                size={15}
                                                className="shrink-0 text-white/25"
                                            />

                                            <span className="truncate">
                                                {client.company ||
                                                    "No company"}
                                            </span>
                                        </div>

                                        {/* Contact */}

                                        <div className="flex min-w-0 items-center gap-2">

                                            <Mail
                                                size={15}
                                                className="shrink-0 text-white/25"
                                            />

                                            <span className="truncate text-sm text-white/50">
                                                {client.email}
                                            </span>
                                        </div>

                                        {/* Status */}

                                        <div>
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${client.status ===
                                                    "active"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-white/[0.06] text-white/40"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${client.status ===
                                                        "active"
                                                        ? "bg-emerald-400"
                                                        : "bg-white/30"
                                                        }`}
                                                />

                                                {client.status}
                                            </span>
                                        </div>

                                        {/* Actions */}

                                        <div className="flex items-center justify-start gap-1 lg:justify-end">

                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditTarget(client);
                                                }}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-orange-500"
                                                title="Edit client"
                                            >
                                                <Pencil size={15} />
                                            </button>

                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeleteTarget(
                                                        client
                                                    )
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-red-500/10 hover:text-red-400"
                                                title="Delete client"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* =========================
                RESULT COUNT
            ========================= */}

            {!loading &&
                filteredClients.length > 0 && (
                    <div className="mt-4 px-1">

                        <p className="text-xs text-white/25">
                            Showing{" "}
                            <span className="text-white/45">
                                {filteredClients.length}
                            </span>{" "}
                            of{" "}
                            <span className="text-white/45">
                                {clients.length}
                            </span>{" "}
                            clients
                        </p>
                    </div>
                )}

            {/* =========================
                DELETE MODAL
            ========================= */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">

                    <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414] shadow-2xl">

                        <div className="p-6">

                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                <Trash2 size={19} />
                            </div>

                            <h2 className="text-lg font-semibold text-white">
                                Delete Client?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/40">
                                Are you sure you want to
                                delete{" "}
                                <span className="font-medium text-white/70">
                                    {deleteTarget.name}
                                </span>
                                ? This action cannot be
                                undone.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] bg-white/[0.015] px-6 py-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget(null)
                                }
                                disabled={deleting}
                                className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 size={15} />

                                {deleting
                                    ? "Deleting..."
                                    : "Delete Client"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================
                CREATE CLIENT MODAL
            ========================= */}

            <CreateClientModal
                open={createModalOpen}
                onClose={() => {
                    setCreateModalOpen(false);
                }}
                onCreated={(client) => {
                    setClients((currentClients) => [
                        client,
                        ...currentClients,
                    ]);

                    setCreateModalOpen(false);
                }}
            />

            {/* =========================
                EDIT CLIENT MODAL
            ========================= */}

            {editTarget && (
                <EditClientModal
                    open={Boolean(editTarget)}
                    onClose={() => {
                        setEditTarget(null);
                    }}
                    client={editTarget}
                    onUpdated={(updatedClient) => {
                        setClients((currentClients) =>
                            currentClients.map(
                                (currentClient) =>
                                    currentClient._id ===
                                        updatedClient._id
                                        ? updatedClient
                                        : currentClient
                            )
                        );

                        setEditTarget(null);
                    }}
                />
            )}
        </div>
    );
}

export default Clients;