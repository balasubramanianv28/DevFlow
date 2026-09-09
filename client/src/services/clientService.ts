import axios from "axios";
const API_URL =
    `${import.meta.env.VITE_API_URL}/api/clients`;

export interface Client {
    _id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    status: "active" | "inactive";
    owner: string;
    createdAt: string;
    updatedAt: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem("devflow_token");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

/* =========================
   GET CLIENTS
========================= */

export const getClients = async (): Promise<Client[]> => {
    const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
    });

    return response.data.clients;
};

/* =========================
   CREATE CLIENT
========================= */

export const createClient = async (
    clientData: {
        name: string;
        email: string;
        phone?: string;
        company?: string;
        address?: string;
        status?: "active" | "inactive";
    }
): Promise<Client> => {
    const response = await axios.post(
        API_URL,
        clientData,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data.client;
};

/* =========================
   UPDATE CLIENT
========================= */

export const updateClient = async (
    clientId: string,
    clientData: {
        name?: string;
        email?: string;
        phone?: string;
        company?: string;
        address?: string;
        status?: "active" | "inactive";
    }
): Promise<Client> => {
    const response = await axios.patch(
        `${API_URL}/${clientId}`,
        clientData,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data.client;
};

/* =========================
   DELETE CLIENT
========================= */

export const deleteClient = async (
    clientId: string
): Promise<void> => {
    await axios.delete(
        `${API_URL}/${clientId}`,
        {
            headers: getAuthHeaders(),
        }
    );
};