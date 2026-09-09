import {
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    Lock,
    Mail,
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // -----------------------------
    // Validation Regex
    // -----------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // -----------------------------
    // Form Submit
    // -----------------------------

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Required fields
        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        // Email validation
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid email or password."
                );
            }
            if (data.token && data.user) {
                login(data.token, data.user);
            }
            setSuccess("Login successful!");

            // Redirect to dashboard
            setTimeout(() => {
                navigate("/dashboard");
            }, 700);
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
        <main className="min-h-screen bg-[#080808] text-white overflow-hidden">
            <div className="min-h-screen grid lg:grid-cols-2">

                {/* =====================================================
                    LEFT SIDE
                ====================================================== */}

                <section className="relative hidden lg:flex flex-col justify-between px-16 xl:px-[68px] py-16 border-r border-white/[0.08] overflow-hidden">

                    {/* Orange Glow */}
                    <div className="absolute top-[25%] left-[20%] w-[500px] h-[500px] rounded-full bg-orange-500/[0.07] blur-[150px]" />

                    {/* Background Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                            backgroundSize: "50px 50px",
                        }}
                    />

                    {/* Logo */}
                    <div className="relative z-10">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2.5"
                        >
                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="text-black font-black text-xl">
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
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-[570px]">
                        <p className="text-orange-500 text-sm font-semibold tracking-[0.28em] mb-7">
                            WELCOME BACK
                        </p>

                        <h2 className="text-6xl xl:text-[64px] leading-[1.02] font-bold tracking-[-0.045em]">
                            Get back to
                            <br />
                            <span className="text-orange-500">
                                progress.
                            </span>
                        </h2>

                        <p className="mt-7 max-w-[500px] text-[17px] leading-8 text-white/45">
                            Continue managing your projects, tasks and team
                            workflow from one powerful workspace.
                        </p>

                        {/* Benefits */}
                        <div className="mt-9 space-y-4">

                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Check
                                        size={13}
                                        className="text-orange-500"
                                    />
                                </div>

                                <span className="text-sm text-white/75">
                                    Everything in one workspace
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Check
                                        size={13}
                                        className="text-orange-500"
                                    />
                                </div>

                                <span className="text-sm text-white/75">
                                    Stay focused on what matters
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Check
                                        size={13}
                                        className="text-orange-500"
                                    />
                                </div>

                                <span className="text-sm text-white/75">
                                    Keep your projects moving
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10">
                        <p className="text-xs text-white/25">
                            © {new Date().getFullYear()} DEVFLOW. Built for
                            teams that move fast.
                        </p>
                    </div>
                </section>

                {/* =====================================================
                    RIGHT SIDE
                ====================================================== */}

                <section className="relative min-h-screen flex items-center justify-center px-6 py-12">

                    {/* Mobile Glow */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500/[0.05] blur-[130px] lg:hidden" />

                    <div className="relative z-10 w-full max-w-[474px]">

                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-12">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2.5"
                            >
                                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                                    <span className="text-black font-black text-xl">
                                        D
                                    </span>
                                </div>

                                <span className="text-xl font-bold">
                                    DEV
                                    <span className="text-orange-500">
                                        FLOW
                                    </span>
                                </span>
                            </Link>
                        </div>

                        {/* Heading */}
                        <div className="mb-9">
                            <p className="text-orange-500 text-sm font-semibold mb-4">
                                WELCOME BACK
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.035em]">
                                Sign in to DEVFLOW
                            </h1>

                            <p className="mt-3 text-sm text-white/40">
                                Continue where you left off.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm leading-5 text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3.5 text-sm text-green-400 flex items-center gap-2">
                                <Check size={17} />
                                {success}
                            </div>
                        )}

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-white/80 mb-2.5"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
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
                                        className="w-full h-[52px] rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-2.5">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-white/80"
                                    >
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setError(
                                                "Forgot password functionality will be added soon."
                                            );
                                        }}
                                        className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div className="relative">
                                    <Lock
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
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
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                        className="w-full h-[52px] rounded-xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
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
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full h-[52px] rounded-xl bg-orange-500 text-black font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-500/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in

                                        <ArrowRight
                                            size={18}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-white/40">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-orange-500 font-medium hover:text-orange-400 transition-colors"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
};

export default Login;