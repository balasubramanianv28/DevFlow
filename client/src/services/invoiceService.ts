import axios from "axios";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/invoices`;
export interface InvoiceClient {
    _id: string;
    name: string;
    email: string;
    company: string;
}

export interface Invoice {
    _id: string;
    invoiceNumber: string;
    client: InvoiceClient;
    amount: number;
    status:
        | "draft"
        | "sent"
        | "paid"
        | "overdue"
        | "cancelled";
    issueDate: string;
    dueDate: string;
    notes: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem(
        "devflow_token"
    );

    if (!token) {
        throw new Error(
            "Authentication token not found"
        );
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

/* =========================
   GET INVOICES
========================= */

export const getInvoices = async (): Promise<
    Invoice[]
> => {
    const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
    });

    return response.data.invoices;
};

/* =========================
   CREATE INVOICE
========================= */

export const createInvoice = async (
    invoiceData: {
        invoiceNumber: string;
        client: string;
        amount: number;
        status?:
            | "draft"
            | "sent"
            | "paid"
            | "overdue"
            | "cancelled";
        issueDate?: string;
        dueDate: string;
        notes?: string;
    }
): Promise<Invoice> => {
    const response = await axios.post(
        API_URL,
        invoiceData,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data.invoice;
};

/* =========================
   UPDATE INVOICE
========================= */

export const updateInvoice = async (
    invoiceId: string,
    invoiceData: {
        invoiceNumber?: string;
        client?: string;
        amount?: number;
        status?:
            | "draft"
            | "sent"
            | "paid"
            | "overdue"
            | "cancelled";
        issueDate?: string;
        dueDate?: string;
        notes?: string;
    }
): Promise<Invoice> => {
    const response = await axios.patch(
        `${API_URL}/${invoiceId}`,
        invoiceData,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data.invoice;
};

/* =========================
   DELETE INVOICE
========================= */

export const deleteInvoice = async (
    invoiceId: string
): Promise<void> => {
    await axios.delete(
        `${API_URL}/${invoiceId}`,
        {
            headers: getAuthHeaders(),
        }
    );
};