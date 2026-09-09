import {
    CalendarDays,
    Camera,
    Eye,
    KeyRound,
    LogOut,
    Mail,
    Pencil,
    RefreshCw,
    ShieldCheck,
    Trash2,
    User,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";

import {
    getProfile,
    uploadProfileImage,
    removeProfileImage,
} from "../../services/profileService";

import EditProfileModal from "../../components/Profile/EditProfileModal";
import ChangePasswordModal from "../../components/Profile/ChangePasswordModal";


const API_BASE_URL =
    "http://localhost:5000";


function Profile() {

    const navigate = useNavigate();

    const {
        user,
        updateUser,
        logout,
    } = useAuth();


    // FILE INPUT

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);


    // MODALS

    const [
        editProfileOpen,
        setEditProfileOpen,
    ] = useState(false);

    const [
        changePasswordOpen,
        setChangePasswordOpen,
    ] = useState(false);


    // STATES

    const [loading, setLoading] =
        useState(true);

    const [uploadingImage, setUploadingImage] =
        useState(false);

    const [error, setError] =
        useState("");

    const [imageError, setImageError] =
        useState("");


    // LOAD PROFILE

    const loadProfile = async () => {

        try {

            setError("");
            setLoading(true);

            const profile =
                await getProfile();

            updateUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                profileImage:
                    profile.profileImage,
                createdAt:
                    profile.createdAt,
                updatedAt:
                    profile.updatedAt,
            });

        } catch (error) {

            console.error(
                "Failed to load profile:",
                error
            );

            setError(
                "We couldn't load your profile. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadProfile();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // USER DATA

    const userName =
        user?.name || "User";

    const userEmail =
        user?.email || "No email";


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


    // PROFILE IMAGE URL

    const profileImageUrl =
        user?.profileImage
            ? `${API_BASE_URL}${user.profileImage}`
            : "";


    // LOGOUT

    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    // PROFILE UPDATED

    const handleProfileUpdated = (
        name: string,
        email: string
    ) => {

        if (!user) {
            return;
        }

        updateUser({
            ...user,
            name,
            email,
        });

    };


    // OPEN FILE SELECTOR

    const handleImageClick = () => {

        fileInputRef.current?.click();

    };


    // UPLOAD PROFILE IMAGE

    const handleImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        setImageError("");


        // FILE TYPE VALIDATION

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            setImageError(
                "Only JPG, PNG and WEBP images are allowed."
            );

            event.target.value = "";

            return;
        }


        // FILE SIZE VALIDATION

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {

            setImageError(
                "Image size must be less than 5 MB."
            );

            event.target.value = "";

            return;
        }


        try {

            setUploadingImage(true);

            const response =
                await uploadProfileImage(
                    file
                );


            if (user) {

                updateUser({
                    ...user,
                    profileImage:
                        response.profileImage,
                });

            }


            setImageError("");

        } catch (error) {

            console.error(
                "Profile image upload failed:",
                error
            );

            setImageError(
                "Failed to upload profile image. Please try again."
            );

        } finally {

            setUploadingImage(false);

            event.target.value = "";

        }
    };


    // REMOVE PROFILE IMAGE

    const handleRemoveImage = async () => {

        if (!user?.profileImage) {
            return;
        }


        try {

            setImageError("");

            setUploadingImage(true);


            const response =
                await removeProfileImage();


            updateUser({
                ...user,
                profileImage:
                    response.profileImage,
            });


            setImageError("");

        } catch (error) {

            console.error(
                "Profile image removal failed:",
                error
            );

            setImageError(
                "Failed to remove profile image. Please try again."
            );

        } finally {

            setUploadingImage(false);

        }
    };


    // VIEW PROFILE IMAGE

    const handleViewImage = () => {

        if (!profileImageUrl) {
            return;
        }

        window.open(
            profileImageUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // LOADING STATE

    if (loading) {

        return (
            <div className="flex min-h-full items-center justify-center bg-[#0a0a0a] text-white">

                <div className="flex flex-col items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-[#111111]">

                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />

                    </div>


                    <div className="text-center">

                        <p className="text-sm font-medium text-zinc-200">
                            Loading profile
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                            Please wait a moment...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // ERROR STATE

    if (error) {

        return (
            <div className="flex min-h-full items-center justify-center bg-[#0a0a0a] px-4 text-white">

                <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111111] p-8 text-center shadow-2xl">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">

                        <RefreshCw size={24} />

                    </div>


                    <h1 className="mt-5 text-lg font-semibold">
                        Unable to load profile
                    </h1>


                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={loadProfile}
                        disabled={loading}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                        className="mt-3 block w-full rounded-xl border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-full bg-[#0a0a0a] pb-10 text-white">

            <div className="mx-auto max-w-5xl space-y-4 pt-2">


                {/* PROFILE CARD */}

                <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-5">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">


                        {/* USER INFO */}

                        <div className="flex items-center gap-5">


                            {/* AVATAR AREA */}

                            <div className="shrink-0">


                                {/* AVATAR WRAPPER */}

                                <div className="group relative">


                                    {/* PROFILE IMAGE */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleImageClick
                                        }
                                        disabled={
                                            uploadingImage
                                        }
                                        className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-orange-500 text-2xl font-bold text-black shadow-lg shadow-orange-500/20 disabled:cursor-not-allowed"
                                    >

                                        {profileImageUrl ? (

                                            <img
                                                src={
                                                    profileImageUrl
                                                }
                                                alt={`${userName} profile`}
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <span>
                                                {initials}
                                            </span>

                                        )}


                                        {/* IMAGE HOVER OVERLAY */}

                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">

                                            {uploadingImage ? (

                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                            ) : (

                                                <Camera
                                                    size={20}
                                                    className="text-white"
                                                />

                                            )}

                                        </div>

                                    </button>


                                    {/* CAMERA BADGE */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleImageClick
                                        }
                                        disabled={
                                            uploadingImage
                                        }
                                        title="Change profile photo"
                                        className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border border-[#111111] bg-orange-500 text-black shadow-lg transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {uploadingImage ? (

                                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />

                                        ) : (

                                            <Camera
                                                size={14}
                                            />

                                        )}

                                    </button>


                                    {/* PHOTO ACTION MENU */}

                                    {user?.profileImage && (
                                        <div className="pointer-events-none absolute left-1/2 top-full z-30 -translate-x-1/2 pt-1 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">

                                            <div className="flex items-center gap-0.5 rounded-lg border border-zinc-700 bg-[#111111] p-1 shadow-xl">


                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleImageClick
                                                    }
                                                    disabled={
                                                        uploadingImage
                                                    }
                                                    title="Change photo"
                                                    className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition hover:bg-orange-500/10 hover:text-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                >

                                                    <Pencil
                                                        size={12}
                                                        strokeWidth={1.8}
                                                    />

                                                </button>


                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleViewImage
                                                    }
                                                    title="View photo"
                                                    className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                                                >

                                                    <Eye
                                                        size={12}
                                                        strokeWidth={1.8}
                                                    />

                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleRemoveImage
                                                    }
                                                    disabled={
                                                        uploadingImage
                                                    }
                                                    title="Remove photo"
                                                    className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                >

                                                    {uploadingImage ? (

                                                        <div className="h-3 w-3 animate-spin rounded-full border border-red-400/30 border-t-red-400" />

                                                    ) : (

                                                        <Trash2
                                                            size={12}
                                                            strokeWidth={1.8}
                                                        />

                                                    )}

                                                </button>

                                            </div>

                                        </div>
                                    )}


                                    {/* FILE INPUT */}

                                    <input
                                        ref={
                                            fileInputRef
                                        }
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="hidden"
                                    />

                                </div>


                                {/* IMAGE ERROR */}

                                {imageError && (
                                    <p className="mt-2 max-w-24 text-center text-[10px] leading-4 text-red-400">
                                        {imageError}
                                    </p>
                                )}

                            </div>


                            {/* NAME / EMAIL */}

                            <div>

                                <h2 className="text-xl font-semibold">
                                    {userName}
                                </h2>


                                <p className="mt-1 text-sm text-zinc-400">
                                    {userEmail}
                                </p>


                                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-400">

                                    <ShieldCheck
                                        size={14}
                                    />

                                    DEVFLOW Account

                                </div>

                            </div>

                        </div>


                        {/* EDIT PROFILE */}

                        <button
                            type="button"
                            onClick={() =>
                                setEditProfileOpen(
                                    true
                                )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500 hover:text-orange-400"
                        >

                            <Pencil size={16} />

                            Edit Profile

                        </button>

                    </div>

                </div>


                {/* ACCOUNT INFORMATION */}

                <div className="rounded-2xl border border-zinc-800 bg-[#111111]">


                    {/* SECTION HEADER */}

                    <div className="border-b border-zinc-800 px-5 py-4">

                        <h2 className="text-base font-semibold">
                            Account Information
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Your basic account details
                        </p>

                    </div>


                    <div className="grid gap-4 p-5 md:grid-cols-2">


                        {/* NAME */}

                        <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-5">

                            <div className="mb-3 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">

                                    <User
                                        size={17}
                                    />

                                </div>

                                <span className="text-xs text-zinc-500">
                                    Full Name
                                </span>

                            </div>


                            <p className="text-sm font-medium text-zinc-200">
                                {userName}
                            </p>

                        </div>


                        {/* EMAIL */}

                        <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-5">

                            <div className="mb-3 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">

                                    <Mail
                                        size={17}
                                    />

                                </div>

                                <span className="text-xs text-zinc-500">
                                    Email Address
                                </span>

                            </div>


                            <p className="break-all text-sm font-medium text-zinc-200">
                                {userEmail}
                            </p>

                        </div>


                        {/* ACCOUNT CREATED */}

                        <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-5">

                            <div className="mb-3 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">

                                    <CalendarDays
                                        size={17}
                                    />

                                </div>

                                <span className="text-xs text-zinc-500">
                                    Account Created
                                </span>

                            </div>


                            <p className="text-sm font-medium text-zinc-200">

                                {user?.createdAt
                                    ? new Date(
                                        user.createdAt
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )
                                    : "—"}

                            </p>

                        </div>


                        {/* LAST UPDATED */}

                        <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-5">

                            <div className="mb-3 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">

                                    <CalendarDays
                                        size={17}
                                    />

                                </div>

                                <span className="text-xs text-zinc-500">
                                    Last Updated
                                </span>

                            </div>


                            <p className="text-sm font-medium text-zinc-200">

                                {user?.updatedAt
                                    ? new Date(
                                        user.updatedAt
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )
                                    : "—"}

                            </p>

                        </div>


                        {/* SECURITY */}

                        <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-5">

                            <div className="mb-3 flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">

                                    <KeyRound
                                        size={17}
                                    />

                                </div>

                                <span className="text-xs text-zinc-500">
                                    Password
                                </span>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setChangePasswordOpen(
                                        true
                                    )
                                }
                                className="text-sm font-medium text-orange-400 transition hover:text-orange-300"
                            >
                                Change Password
                            </button>

                        </div>

                    </div>

                </div>


                {/* SESSION */}

                <div className="rounded-2xl border border-red-500/20 bg-[#111111] p-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h2 className="text-base font-semibold text-zinc-200">
                                Session
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Sign out from your DEVFLOW account
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                        >

                            <LogOut
                                size={16}
                            />

                            Logout

                        </button>

                    </div>

                </div>

            </div>


            {/* EDIT PROFILE MODAL */}

            <EditProfileModal
                open={
                    editProfileOpen
                }
                onClose={() =>
                    setEditProfileOpen(
                        false
                    )
                }
                name={userName}
                email={userEmail}
                onUpdated={
                    handleProfileUpdated
                }
            />


            {/* CHANGE PASSWORD MODAL */}

            <ChangePasswordModal
                open={
                    changePasswordOpen
                }
                onClose={() =>
                    setChangePasswordOpen(
                        false
                    )
                }
            />

        </div>
    );
}


export default Profile;