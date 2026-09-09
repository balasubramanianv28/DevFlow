import {
    ArrowLeft,
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // -----------------------------
    // Validation Regex
    // -----------------------------

    const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    // -----------------------------
    // Form Submit
    // -----------------------------

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Required fields
        if (!name.trim() || !email.trim() || !password) {
            setError("Please fill in all fields.");
            return;
        }

        // Name validation
        if (!nameRegex.test(name.trim())) {
            setError("Please enter a valid name.");
            return;
        }

        // Email validation
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        // Password validation
        if (!passwordRegex.test(password)) {
            setError(
                "Password must be 8+ characters with uppercase, lowercase, number and special character."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed. Please try again."
                );
            }

            setSuccess("Account created successfully!");

            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#080808] text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[140px]" />

            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[140px]" />

            {/* Background Grid */}
            <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-[460px]">

                    {/* Back */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>

                    {/* Card */}
                    <div className="rounded-3xl border border-white/10 bg-[#101010]/90 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-black/40">

                        {/* Brand */}
                        <div className="mb-8">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 mb-7"
                            >
                                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                    <span className="text-black font-black text-lg">
                                        D
                                    </span>
                                </div>

                                <span className="text-xl font-bold tracking-tight">
                                    DEV
                                    <span className="text-orange-500">
                                        FLOW
                                    </span>
                                </span>
                            </Link>

                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Create your account
                            </h1>

                            <p className="text-white/45 mt-3 text-sm leading-6">
                                Start managing your projects with a workflow
                                built for modern teams.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
                                <Check size={16} />
                                {success}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-white/75 mb-2"
                                >
                                    Full name
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                                    />

                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        disabled={loading}
                                        className="w-full h-13 rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-white/75 mb-2"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        disabled={loading}
                                        className="w-full h-13 rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-white/75 mb-2"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    {/* Lock Icon */}
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                                    />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        className="w-full h-13 rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                                    />

                                    {/* Eye Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        disabled={loading}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-white/30 leading-5">
                                    Use 8+ characters with uppercase,
                                    lowercase, number and special character.
                                </p>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 pt-1">
                                <div className="mt-0.5 w-4 h-4 rounded border border-white/15 bg-white/[0.03] flex items-center justify-center shrink-0">
                                    <Check
                                        size={11}
                                        className="text-orange-500"
                                    />
                                </div>

                                <p className="text-xs text-white/35 leading-5">
                                    By creating an account, you agree to our{" "}
                                    <span className="text-white/60">
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span className="text-white/60">
                                        Privacy Policy
                                    </span>
                                    .
                                </p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full h-13 rounded-xl bg-orange-500 text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account

                                        <ArrowRight
                                            size={17}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login */}
                        <div className="mt-7 pt-6 border-t border-white/10 text-center">
                            <p className="text-sm text-white/40">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-white/20 mt-6">
                        © {new Date().getFullYear()} DEVFLOW. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Register;