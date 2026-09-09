import {
    Bell,
    ChevronDown,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useAuth,
} from "../context/useAuth";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../services/notificationService";

import type {
    Notification,
} from "../services/notificationService";

import {
    formatRelativeTime,
} from "../utils/formatRelativeTime";


const API_BASE_URL =
    "http://localhost:5000";


const Topbar = () => {

    const [
        profileOpen,
        setProfileOpen,
    ] = useState(false);

    const [
        notificationsOpen,
        setNotificationsOpen,
    ] = useState(false);

    const [
        notifications,
        setNotifications,
    ] = useState<Notification[]>([]);


    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        logout,
        user,
    } = useAuth();


    // USER DATA

    const userName =
        user?.name || "User";

    const firstName =
        userName.split(" ")[0];


    // PROFILE IMAGE

    const profileImageUrl =
        user?.profileImage
            ? `${API_BASE_URL}${user.profileImage}`
            : "";


    // INITIALS

    const initials =
        userName
            .split(" ")
            .map((name) =>
                name.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();


    // PAGE TITLE

    const pageTitle =
        location.pathname === "/projects"
            ? "Projects"
            : location.pathname === "/tasks"
                ? "Tasks"
                : location.pathname === "/clients"
                    ? "Clients"
                    : location.pathname === "/invoices"
                        ? "Invoices"
                        : location.pathname === "/analytics"
                            ? "Analytics"
                            : location.pathname === "/profile"
                                ? "Profile"
                                : "Overview";


    // MARK NOTIFICATION AS READ

    const markAsRead = async (
        notificationId: string
    ) => {

        try {

            await markNotificationAsRead(
                notificationId
            );

            setNotifications(
                (prev) =>
                    prev.filter(
                        (notification) =>
                            notification._id !==
                            notificationId
                    )
            );

        } catch (error) {

            console.error(
                "Mark notification as read error:",
                error
            );

        }

    };


    // MARK ALL AS READ

    const markAllAsRead = async () => {

        try {

            await markAllNotificationsAsRead();

            setNotifications([]);

        } catch (error) {

            console.error(
                "Mark all notifications as read error:",
                error
            );

        }

    };


    // OUTSIDE CLICK

    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {

            const target =
                event.target as HTMLElement;


            if (
                !target.closest(
                    "[data-profile-menu]"
                )
            ) {

                setProfileOpen(false);

            }


            if (
                !target.closest(
                    "[data-notification-menu]"
                )
            ) {

                setNotificationsOpen(
                    false
                );

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // FETCH NOTIFICATIONS

    useEffect(() => {

        const fetchNotifications =
            async () => {

                try {

                    const data =
                        await getNotifications();

                    setNotifications(
                        data
                    );

                } catch (error) {

                    console.error(
                        "Fetch notifications error:",
                        error
                    );

                }

            };


        fetchNotifications();


        const interval =
            setInterval(
                () => {
                    fetchNotifications();
                },
                30000
            );


        return () => {

            clearInterval(interval);

        };

    }, []);


    return (
        <header className="sticky top-0 z-30 h-[78px] border-b border-white/[0.08] bg-[#080808]/90 backdrop-blur-xl">

            <div className="flex h-full items-center justify-between px-5 sm:px-7 lg:px-9">


                {/* PAGE TITLE */}

                <div>

                    <p className="text-sm font-medium text-white/80">
                        {pageTitle}
                    </p>

                    <p className="mt-0.5 text-xs text-white/25">

                        {location.pathname === "/projects"
                            ? "Manage and organize your projects"
                            : location.pathname === "/tasks"
                                ? "Manage and track your project tasks"
                                : location.pathname === "/clients"
                                    ? "Manage your clients"
                                    : location.pathname === "/invoices"
                                        ? "Manage your invoices"
                                        : location.pathname === "/analytics"
                                            ? "View your business analytics"
                                            : location.pathname === "/profile"
                                                ? "Manage your account and profile"
                                                : "Your workspace at a glance"}

                    </p>

                </div>


                {/* RIGHT SECTION */}

                <div className="ml-auto flex items-center gap-3">


                    {/* NOTIFICATIONS */}

                    <div
                        className="relative"
                        data-notification-menu
                    >

                        <button
                            type="button"
                            onClick={() => {

                                setNotificationsOpen(
                                    (prev) =>
                                        !prev
                                );

                                setProfileOpen(
                                    false
                                );

                            }}
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/45 transition-all hover:bg-white/[0.05] hover:text-white"
                        >

                            <Bell size={18} />


                            {/* NOTIFICATION DOT */}

                            {notifications.some(
                                (
                                    notification
                                ) =>
                                    !notification.isRead
                            ) && (

                                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />

                                )}

                        </button>


                        {/* NOTIFICATION DROPDOWN */}

                        {notificationsOpen && (

                            <div className="absolute right-0 top-[52px] z-50 w-72 rounded-xl border border-white/[0.08] bg-[#111111] p-4 shadow-2xl shadow-black/50">

                                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">

                                    <p className="text-sm font-medium text-white/80">
                                        Notifications
                                    </p>


                                    <div className="flex items-center gap-3">

                                        <span className="text-[10px] text-orange-500/80">

                                            {
                                                notifications.filter(
                                                    (
                                                        notification
                                                    ) =>
                                                        !notification.isRead
                                                ).length
                                            }{" "}
                                            new

                                        </span>


                                        {notifications.length >
                                            0 && (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        markAllAsRead
                                                    }
                                                    className="text-[10px] text-white/30 transition-colors hover:text-orange-500"
                                                >
                                                    Mark all as read
                                                </button>

                                            )}

                                    </div>

                                </div>


                                {notifications.length ===
                                    0 ? (

                                    <div className="py-6 text-center">

                                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">

                                            <Bell
                                                size={16}
                                                className="text-white/25"
                                            />

                                        </div>

                                        <p className="mt-3 text-xs text-white/40">
                                            No new notifications
                                        </p>

                                        <p className="mt-1 text-[11px] text-white/20">
                                            You're all caught up.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="py-2">

                                        {notifications.map(
                                            (
                                                notification
                                            ) => (

                                                <div
                                                    key={
                                                        notification._id
                                                    }
                                                    onClick={() => {

                                                        if (
                                                            !notification.isRead
                                                        ) {

                                                            markAsRead(
                                                                notification._id
                                                            );

                                                        }

                                                    }}
                                                    className={`cursor-pointer rounded-lg px-3 py-3 transition-all ${notification.isRead
                                                        ? "opacity-50 hover:bg-white/[0.04]"
                                                        : "bg-orange-500/[0.05] hover:bg-orange-500/[0.08]"
                                                        }`}
                                                >

                                                    <div className="flex items-center justify-between gap-3">

                                                        <p className="text-xs font-medium text-white/80">
                                                            {
                                                                notification.title
                                                            }
                                                        </p>


                                                        {!notification.isRead && (

                                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />

                                                        )}

                                                    </div>


                                                    <p className="mt-1 text-[11px] text-white/40">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>


                                                    <p className="mt-1.5 text-[10px] text-white/20">
                                                        {formatRelativeTime(
                                                            notification.createdAt
                                                        )}
                                                    </p>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* DIVIDER */}

                    <div className="hidden h-7 w-px bg-white/[0.08] sm:block" />


                    {/* USER PROFILE MENU */}

                    <div
                        className="relative flex items-center"
                        data-profile-menu
                    >

                        {/* PROFILE AREA */}

                        <button
                            type="button"
                            onClick={() => {

                                navigate(
                                    "/profile"
                                );

                                setNotificationsOpen(
                                    false
                                );

                                setProfileOpen(
                                    false
                                );

                            }}
                            className="group flex items-center gap-3"
                            title="View Profile"
                        >

                            {/* PROFILE AVATAR */}

                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-orange-500/20 bg-orange-500/10">

                                {profileImageUrl ? (

                                    <img
                                        src={
                                            profileImageUrl
                                        }
                                        alt={
                                            user?.name ||
                                            "Profile"
                                        }
                                        className="h-full w-full object-cover"
                                    />

                                ) : (

                                    <span className="text-sm font-semibold text-orange-500">
                                        {initials}
                                    </span>

                                )}

                            </div>


                            {/* USER INFO */}

                            <div className="hidden text-left sm:block">

                                <p className="text-sm font-medium text-white/80">
                                    {firstName}
                                </p>

                                <p className="text-[11px] text-white/25">
                                    Workspace owner
                                </p>

                            </div>

                        </button>


                        {/* CHEVRON */}

                        <button
                            type="button"
                            onClick={() => {

                                setProfileOpen(
                                    (prev) =>
                                        !prev
                                );

                                setNotificationsOpen(
                                    false
                                );

                            }}
                            className="ml-1 hidden h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.05] sm:flex"
                            title="Open account menu"
                        >

                            <ChevronDown
                                size={15}
                                className={`text-white/25 transition-transform hover:text-white/50 ${profileOpen
                                    ? "rotate-180"
                                    : ""
                                    }`}
                            />

                        </button>


                        {/* PROFILE DROPDOWN */}

                        {profileOpen && (

                            <div className="absolute right-0 top-[52px] z-50 w-56 rounded-xl border border-white/[0.08] bg-[#111111] p-1.5 shadow-2xl shadow-black/50">


                                {/* DROPDOWN USER */}

                                <div className="border-b border-white/[0.06] px-3 py-3">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-500/20 bg-orange-500/10">

                                            {profileImageUrl ? (

                                                <img
                                                    src={
                                                        profileImageUrl
                                                    }
                                                    alt={
                                                        user?.name ||
                                                        "Profile"
                                                    }
                                                    className="h-full w-full object-cover"
                                                />

                                            ) : (

                                                <span className="text-xs font-semibold text-orange-500">
                                                    {initials}
                                                </span>

                                            )}

                                        </div>


                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-medium text-white/80">
                                                {userName}
                                            </p>

                                            <p className="mt-0.5 truncate text-[11px] text-white/30">
                                                {user?.email ||
                                                    ""}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* VIEW PROFILE */}

                                <button
                                    type="button"
                                    onClick={() => {

                                        setProfileOpen(
                                            false
                                        );

                                        navigate(
                                            "/profile"
                                        );

                                    }}
                                    className="mt-1 flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-white/60 transition-all hover:bg-orange-500/10 hover:text-orange-400"
                                >
                                    View Profile
                                </button>


                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    onClick={() => {

                                        setProfileOpen(
                                            false
                                        );

                                        logout();

                                        navigate(
                                            "/login"
                                        );

                                    }}
                                    className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-white/50 transition-all hover:bg-red-500/10 hover:text-red-400"
                                >
                                    Logout
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </header>
    );
};


export default Topbar;