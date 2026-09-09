import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#080808]/80 backdrop-blur-xl">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

                {/* Logo */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6b2c]">
                        <span className="text-lg font-black text-black">
                            D
                        </span>
                    </div>

                    <span className="text-xl font-bold tracking-tight">
                        DEV
                        <span className="text-[#ff6b2c]">
                            FLOW
                        </span>
                    </span>
                </button>

                {/* Navigation */}
                <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">

                    <button
                        type="button"
                        onClick={() =>
                            scrollToSection("features")
                        }
                        className="transition hover:text-white"
                    >
                        Features
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            scrollToSection("workflow")
                        }
                        className="transition hover:text-white"
                    >
                        Workflow
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            scrollToSection("pricing")
                        }
                        className="transition hover:text-white"
                    >
                        Pricing
                    </button>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {/* Sign In */}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="hidden text-sm text-zinc-300 transition hover:text-white sm:block"
                    >
                        Sign in
                    </button>

                    {/* Get Started */}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="group flex items-center gap-2 rounded-full bg-[#ff6b2c] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ff8a4c]"
                    >
                        Get started

                        <ArrowUpRight
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </button>

                </div>

            </nav>
        </header>
    );
};

export default Navbar;