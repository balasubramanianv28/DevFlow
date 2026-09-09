import axios from "axios";

const API_URL =
    "http://localhost:5000/api/auth/profile";

const AUTH_API_URL =
    "http://localhost:5000/api/auth";

const getAuthHeaders = () => {
    const token =
        localStorage.getItem("devflow_token");

    if (!token) {
        throw new Error(
            "Authentication token not found"
        );
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};


// PROFILE USER

export interface ProfileUser {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    profileImage: string;
}


// CHANGE PASSWORD RESPONSE

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}


// PROFILE IMAGE RESPONSE

export interface UploadProfileImageResponse {
    success: boolean;
    message: string;
    profileImage: string;
}


// GET PROFILE

export const getProfile =
    async (): Promise<ProfileUser> => {
        const response = await axios.get(
            API_URL,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data.user;
    };


// UPDATE PROFILE

export const updateProfile = async (
    name: string,
    email: string
): Promise<ProfileUser> => {
    const response = await axios.patch(
        API_URL,
        {
            name,
            email,
        },
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data.user;
};


// CHANGE PASSWORD

export const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
): Promise<ChangePasswordResponse> => {
    const response = await axios.patch(
        `${AUTH_API_URL}/change-password`,
        {
            currentPassword,
            newPassword,
            confirmPassword,
        },
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// UPLOAD PROFILE IMAGE

export const uploadProfileImage = async (
    file: File
): Promise<UploadProfileImageResponse> => {
    const formData = new FormData();

    formData.append(
        "profileImage",
        file
    );

    const response = await axios.patch(
        `${API_URL}/image`,
        formData,
        {
            headers: {
                ...getAuthHeaders(),
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const removeProfileImage =
    async (): Promise<{
        success: boolean;
        message: string;
        profileImage: string;
    }> => {

        const response =
            await axios.delete(
                `${API_URL}/image`,
                {
                    headers:
                        getAuthHeaders(),
                }
            );

        return response.data;
    };