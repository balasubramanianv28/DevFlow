import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, X } from "lucide-react";

import axios from "axios";

import { changePassword } from "../../services/profileService";

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

function ChangePasswordModal({
    open,
    onClose,
}: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    if (!open) {
        return null;
    }

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError(
                "All password fields are required"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "New passwords do not match"
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await changePassword(
                    currentPassword,
                    newPassword,
                    confirmPassword
                );

            setSuccess(
                response.message
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "Failed to change password"
                );
            } else {
                setError(
                    "Failed to change password"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111111] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                            <LockKeyhole size={18} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Change Password
                            </h2>

                            <p className="mt-1 text-xs text-zinc-500">
                                Update your account password
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >

                    {/* Current Password */}
                    <div>
                        <label
                            htmlFor="current-password"
                            className="mb-2 block text-xs font-medium text-zinc-400"
                        >
                            Current Password
                        </label>

                        <div className="relative">
                            <input
                                id="current-password"
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter current password"
                                disabled={loading}
                                className="w-full rounded-xl border border-zinc-800 bg-[#0b0b0b] px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (prev) => !prev
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label
                            htmlFor="new-password"
                            className="mb-2 block text-xs font-medium text-zinc-400"
                        >
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                id="new-password"
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                disabled={loading}
                                className="w-full rounded-xl border border-zinc-800 bg-[#0b0b0b] px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        (prev) => !prev
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                            >
                                {showNewPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>

                        <p className="mt-2 text-[11px] text-zinc-600">
                            8+ characters with uppercase,
                            lowercase, number and special
                            character.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="mb-2 block text-xs font-medium text-zinc-400"
                        >
                            Confirm New Password
                        </label>

                        <div className="relative">
                            <input
                                id="confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                disabled={loading}
                                className="w-full rounded-xl border border-zinc-800 bg-[#0b0b0b] px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (prev) => !prev
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                            <p className="text-xs text-emerald-400">
                                {success}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Changing..."
                                : "Change Password"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;