import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { updateProfile } from "../../services/profileService";

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    name: string;
    email: string;
    onUpdated: (name: string, email: string) => void;
}

function EditProfileModal({
    open,
    onClose,
    name,
    email,
    onUpdated,
}: EditProfileModalProps) {
    const [formName, setFormName] = useState(name);
    const [formEmail, setFormEmail] = useState(email);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) {
        return null;
    }

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");

        const trimmedName = formName.trim();
        const trimmedEmail =
            formEmail.trim().toLowerCase();

        if (!trimmedName || !trimmedEmail) {
            setError(
                "Name and email are required"
            );
            return;
        }

        try {
            setLoading(true);

            const updatedUser =
                await updateProfile(
                    trimmedName,
                    trimmedEmail
                );

            onUpdated(
                updatedUser.name,
                updatedUser.email
            );

            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "Failed to update profile"
                );
            } else {
                setError("Failed to update profile");
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111111] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">

                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Edit Profile
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Update your account information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
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

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="profile-name"
                            className="mb-2 block text-xs font-medium text-zinc-400"
                        >
                            Full Name
                        </label>

                        <input
                            id="profile-name"
                            type="text"
                            value={formName}
                            onChange={(event) =>
                                setFormName(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your name"
                            disabled={loading}
                            className="w-full rounded-xl border border-zinc-800 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="profile-email"
                            className="mb-2 block text-xs font-medium text-zinc-400"
                        >
                            Email Address
                        </label>

                        <input
                            id="profile-email"
                            type="email"
                            value={formEmail}
                            onChange={(event) =>
                                setFormEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                            disabled={loading}
                            className="w-full rounded-xl border border-zinc-800 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                            <p className="text-xs text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5">

                        <button
                            type="button"
                            onClick={onClose}
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
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;