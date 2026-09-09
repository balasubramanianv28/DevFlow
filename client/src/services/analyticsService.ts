import axios from "axios";

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/analytics`;

/* =========================================================
   TYPES
========================================================= */

export interface AnalyticsProjectStats {
    total: number;
    planning: number;
    active: number;
    completed: number;
    archived: number;
}

export interface AnalyticsTaskStats {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    completionRate: number;
}

export interface AnalyticsClientStats {
    total: number;
    active: number;
    inactive: number;
}

export interface AnalyticsInvoiceStats {
    total: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    draftAmount: number;
    overdueAmount: number;
    draft: number;
    sent: number;
    paid: number;
    overdue: number;
    cancelled: number;
}

export interface MonthlyRevenue {
    month: number;
    revenue: number;
}

export interface Analytics {
    year: number;

    projects: AnalyticsProjectStats;

    tasks: AnalyticsTaskStats;

    clients: AnalyticsClientStats;

    invoices: AnalyticsInvoiceStats;

    monthlyRevenue: MonthlyRevenue[];

    yearlyRevenue: number;
}

/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = () => {
    const token =
        localStorage.getItem(
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

/* =========================================================
   GET ANALYTICS
========================================================= */

export const getAnalytics = async (
    year?: number
): Promise<Analytics> => {
    const response =
        await axios.get(
            API_URL,
            {
                headers:
                    getAuthHeaders(),

                params:
                    year
                        ? {
                              year,
                          }
                        : undefined,
            }
        );

    return response.data.analytics;
};