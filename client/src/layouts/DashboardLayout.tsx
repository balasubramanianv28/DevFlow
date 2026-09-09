import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {

    const [
        collapsed,
        setCollapsed,
    ] = useState(false);

    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] = useState(false);


    return (
        <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">


            {/* =====================================================
                MOBILE OVERLAY
            ====================================================== */}

            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() =>
                        setMobileMenuOpen(false)
                    }
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/70
                        backdrop-blur-sm
                        lg:hidden
                    "
                />
            )}


            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={
                    setMobileMenuOpen
                }
            />

            {/* MOBILE MENU BUTTON */}

            <button
                type="button"
                onClick={() =>
                    setMobileMenuOpen(true)
                }
                aria-label="Open navigation"
                className="
        fixed
        left-3
        top-14
        z-[100]
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        border
        border-white/10
        bg-[#111111]
        text-white/70
        shadow-xl
        shadow-black/40
        transition-all
        duration-200
        hover:border-orange-500/30
        hover:bg-[#161616]
        hover:text-orange-400
        active:scale-95
        lg:hidden
    "
            >
                <Menu
                    size={20}
                    strokeWidth={1.8}
                />
            </button>


            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <main
                className={`
                    min-h-screen
                    min-w-0
                    overflow-x-hidden
                    transition-all
                    duration-300

                    ${collapsed
                        ? "lg:pl-[76px]"
                        : "lg:pl-[260px]"
                    }
                `}
            >

                <Topbar />

                <Outlet />

            </main>

        </div>
    );
};

export default DashboardLayout;