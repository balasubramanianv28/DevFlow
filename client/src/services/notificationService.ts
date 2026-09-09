import axios from "axios";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/notifications`;
export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: "project" | "task" | "client" | "invoice" | "system";
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        return [];
    }

    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.notifications;
};

export const markNotificationAsRead = async (
    notificationId: string
): Promise<void> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        return;
    }

    await axios.patch(
        `${API_URL}/${notificationId}/read`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        return;
    }

    await axios.patch(
        `${API_URL}/read-all`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};