import {
    BarChart3,
    CheckSquare,
    CircleDollarSign,
    FolderKanban,
    LayoutDashboard,
    LogOut,
    Users,
    X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;

    mobileMenuOpen: boolean;
    setMobileMenuOpen: (value: boolean) => void;
}

const Sidebar = ({
    collapsed,
    setCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
}: SidebarProps) => {

    const navigate = useNavigate();

    const { user, logout } = useAuth();


    // =========================================================
    // PROFILE IMAGE
    // =========================================================

    const API_BASE_URL =
        import.meta.env.VITE_API_URL;

    const profileImageUrl =
        user?.profileImage
            ? `${API_BASE_URL}${user.profileImage}`
            : "";

    const userName =
        user?.name || "User";

    const initials =
        userName
            .split(" ")
            .map(
                (name) =>
                    name.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();


    // =========================================================
    // NAVIGATION
    // =========================================================

    const navItems = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            label: "Projects",
            icon: FolderKanban,
            path: "/projects",
        },
        {
            label: "Tasks",
            icon: CheckSquare,
            path: "/tasks",
        },
        {
            label: "Clients",
            icon: Users,
            path: "/clients",
        },
        {
            label: "Invoices",
            icon: CircleDollarSign,
            path: "/invoices",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            path: "/analytics",
        },
    ];


    // =========================================================
    // NAVIGATION HANDLER
    // =========================================================

    const handleNavigation = (
        path: string
    ) => {

        navigate(path);

        // Close mobile drawer
        setMobileMenuOpen(false);
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        logout();

        setMobileMenuOpen(false);

        navigate("/login");
    };


    // =========================================================
    // PROFILE
    // =========================================================

    const handleProfileClick = () => {

        navigate("/profile");

        setMobileMenuOpen(false);
    };


    return (
        <aside
            className={`
                fixed
                left-0
                top-0
                z-50
                flex
                h-screen
                flex-col
                border-r
                border-white/[0.08]
                bg-[#0c0c0c]
                shadow-2xl
                transition-all
                duration-300

                ${mobileMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }

                lg:translate-x-0

                ${collapsed
                    ? "lg:w-[76px]"
                    : "lg:w-[260px]"
                }

                w-[260px]
            `}
        >

            {/* =================================================
                LOGO
            ================================================== */}

            <div
                className={`
                    flex
                    h-[78px]
                    shrink-0
                    items-center
                    border-b
                    border-white/[0.06]

                    ${collapsed
                        ? "lg:justify-center lg:px-3"
                        : "justify-between px-5"
                    }
                `}
            >

                <button
                    type="button"
                    onClick={() =>
                        handleNavigation(
                            "/dashboard"
                        )
                    }
                    className="flex items-center gap-3"
                >

                    {/* LOGO MARK */}

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-orange-500
                            shadow-lg
                            shadow-orange-500/20
                        "
                    >
                        <span
                            className="
                                text-lg
                                font-black
                                text-black
                            "
                        >
                            D
                        </span>
                    </div>


                    {/* LOGO TEXT */}

                    <span
                        className={`
                            text-lg
                            font-bold
                            tracking-tight

                            ${collapsed
                                ? "lg:hidden"
                                : ""
                            }
                        `}
                    >
                        DEV
                        <span className="text-orange-500">
                            FLOW
                        </span>
                    </span>

                </button>


                {/* MOBILE CLOSE */}

                <button
                    type="button"
                    onClick={() =>
                        setMobileMenuOpen(false)
                    }
                    aria-label="Close navigation"
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-white/40
                        transition
                        hover:bg-white/[0.05]
                        hover:text-white
                        lg:hidden
                    "
                >
                    <X size={18} />
                </button>


                {/* DESKTOP COLLAPSE */}

                <button
                    type="button"
                    onClick={() =>
                        setCollapsed(
                            !collapsed
                        )
                    }
                    aria-label={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                    className="
                        absolute
                        -right-3
                        top-[22px]
                        hidden
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/10
                        bg-[#111111]
                        text-white/40
                        shadow-md
                        transition
                        hover:border-orange-500/30
                        hover:text-orange-400
                        lg:flex
                    "
                >
                    <span
                        className={`
                            text-xs
                            transition-transform
                            ${collapsed
                                ? "rotate-180"
                                : ""
                            }
                        `}
                    >
                        ‹
                    </span>
                </button>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================== */}

            <nav
                className="
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    px-3
                    py-5
                "
            >

                {/* SECTION LABEL */}

                <p
                    className={`
                        mb-3
                        px-3
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-white/25

                        ${collapsed
                            ? "lg:hidden"
                            : ""
                        }
                    `}
                >
                    Workspace
                </p>


                {/* NAV ITEMS */}

                <div className="space-y-1">

                    {navItems.map(
                        (item) => {

                            const Icon =
                                item.icon;

                            const isActive =
                                window.location.pathname ===
                                item.path;

                            return (
                                <button
                                    key={
                                        item.label
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleNavigation(
                                            item.path
                                        )
                                    }
                                    title={
                                        collapsed
                                            ? item.label
                                            : undefined
                                    }
                                    className={`
                                        group
                                        relative
                                        flex
                                        w-full
                                        items-center
                                        rounded-xl
                                        transition-all
                                        duration-200

                                        ${collapsed
                                            ? "lg:justify-center lg:px-0"
                                            : "gap-3 px-3"
                                        }

                                        h-11

                                        ${isActive
                                            ? "bg-orange-500/10 text-orange-400"
                                            : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                                        }
                                    `}
                                >

                                    <Icon
                                        size={18}
                                        strokeWidth={
                                            isActive
                                                ? 2
                                                : 1.8
                                        }
                                        className="shrink-0"
                                    />


                                    <span
                                        className={`
                                            truncate
                                            text-sm
                                            font-medium

                                            ${collapsed
                                                ? "lg:hidden"
                                                : ""
                                            }
                                        `}
                                    >
                                        {
                                            item.label
                                        }
                                    </span>


                                    {/* ACTIVE DOT */}

                                    {isActive && (
                                        <span
                                            className={`
                                                ml-auto
                                                h-1.5
                                                w-1.5
                                                shrink-0
                                                rounded-full
                                                bg-orange-500
                                                shadow-sm
                                                shadow-orange-500/50

                                                ${collapsed
                                                    ? "lg:hidden"
                                                    : ""
                                                }
                                            `}
                                        />
                                    )}


                                    {/* COLLAPSED TOOLTIP */}

                                    {collapsed && (
                                        <span
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-full
                                                ml-3
                                                hidden
                                                whitespace-nowrap
                                                rounded-lg
                                                border
                                                border-white/10
                                                bg-[#151515]
                                                px-2.5
                                                py-1.5
                                                text-xs
                                                text-white
                                                opacity-0
                                                shadow-xl
                                                transition
                                                group-hover:opacity-100
                                                lg:block
                                            "
                                        >
                                            {
                                                item.label
                                            }
                                        </span>
                                    )}

                                </button>
                            );
                        }
                    )}

                </div>

            </nav>


            {/* =================================================
                BOTTOM AREA
            ================================================== */}

            <div
                className="
                    shrink-0
                    border-t
                    border-white/[0.06]
                    p-3
                "
            >

                {/* =================================================
                    PROFILE
                ================================================== */}

                <button
                    type="button"
                    onClick={
                        handleProfileClick
                    }
                    className={`
                        group
                        mb-2
                        flex
                        w-full
                        items-center
                        rounded-xl
                        transition-all
                        hover:bg-white/[0.04]

                        ${collapsed
                            ? "lg:justify-center lg:px-0"
                            : "gap-3 px-2.5"
                        }

                        py-2
                    `}
                >

                    {/* AVATAR */}

                    <div
                        className="
                            relative
                            h-9
                            w-9
                            shrink-0
                            overflow-hidden
                            rounded-xl
                            border
                            border-white/10
                            bg-[#1a1a1a]
                        "
                    >

                        {profileImageUrl ? (
                            <img
                                src={
                                    profileImageUrl
                                }
                                alt={
                                    userName
                                }
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />
                        ) : (
                            <div
                                className="
                                    flex
                                    h-full
                                    w-full
                                    items-center
                                    justify-center
                                    text-xs
                                    font-semibold
                                    text-orange-400
                                "
                            >
                                {
                                    initials
                                }
                            </div>
                        )}

                    </div>


                    {/* USER DETAILS */}

                    <div
                        className={`
                            min-w-0
                            flex-1
                            text-left

                            ${collapsed
                                ? "lg:hidden"
                                : ""
                            }
                        `}
                    >

                        <p
                            className="
                                truncate
                                text-sm
                                font-medium
                                text-white
                            "
                        >
                            {
                                userName
                            }
                        </p>

                        <p
                            className="
                                mt-0.5
                                truncate
                                text-[11px]
                                text-white/30
                            "
                        >
                            Workspace Owner
                        </p>

                    </div>

                </button>


                {/* LOGOUT */}

                <button
                    type="button"
                    onClick={
                        handleLogout
                    }
                    title={
                        collapsed
                            ? "Sign out"
                            : undefined
                    }
                    className={`
                        flex
                        h-10
                        w-full
                        items-center
                        rounded-xl
                        text-sm
                        text-white/40
                        transition-all
                        hover:bg-red-500/5
                        hover:text-red-400

                        ${collapsed
                            ? "lg:justify-center lg:px-0"
                            : "gap-3 px-3"
                        }
                    `}
                >

                    <LogOut
                        size={17}
                        className="shrink-0"
                    />

                    <span
                        className={
                            collapsed
                                ? "lg:hidden"
                                : ""
                        }
                    >
                        Sign out
                    </span>

                </button>

            </div>

        </aside>
    );
};

export default Sidebar;