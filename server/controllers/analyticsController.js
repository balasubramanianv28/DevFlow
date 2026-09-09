const Project = require("../models/Project");
const Task = require("../models/Task");
const Client = require("../models/Client");
const Invoice = require("../models/Invoice");

const getAnalytics = async (req, res) => {
    try {
        const ownerId = req.userId;

        /* =====================================================
           SELECT YEAR
        ===================================================== */

        const currentYear =
            new Date().getFullYear();

        const requestedYear = Number(
            req.query.year
        );

        const selectedYear =
            Number.isInteger(requestedYear) &&
                requestedYear >= 2000 &&
                requestedYear <= 2100
                ? requestedYear
                : currentYear;

        /* =====================================================
           FETCH DATA
        ===================================================== */

        const [
            projects,
            tasks,
            clients,
            invoices,
        ] = await Promise.all([
            Project.find({
                owner: ownerId,
            }),

            Task.find({
                owner: ownerId,
            }),

            Client.find({
                owner: ownerId,
            }),

            Invoice.find({
                owner: ownerId,
            }),
        ]);

        /* =====================================================
           PROJECT ANALYTICS
        ===================================================== */

        const projectStats = {
            total: projects.length,

            planning: projects.filter(
                (project) =>
                    project.status === "planning"
            ).length,

            active: projects.filter(
                (project) =>
                    project.status === "active"
            ).length,

            completed: projects.filter(
                (project) =>
                    project.status === "completed"
            ).length,

            archived: projects.filter(
                (project) =>
                    project.status === "archived"
            ).length,
        };

        /* =====================================================
           TASK ANALYTICS
        ===================================================== */

        const taskStats = {
            total: tasks.length,

            todo: tasks.filter(
                (task) =>
                    task.status === "todo"
            ).length,

            inProgress: tasks.filter(
                (task) =>
                    task.status === "in-progress"
            ).length,

            completed: tasks.filter(
                (task) =>
                    task.status === "completed"
            ).length,
        };

        const completedTasks =
            taskStats.completed;

        const taskCompletionRate =
            taskStats.total > 0
                ? Math.round(
                    (completedTasks /
                        taskStats.total) *
                    100
                )
                : 0;

        /* =====================================================
           CLIENT ANALYTICS
        ===================================================== */

        const clientStats = {
            total: clients.length,

            active: clients.filter(
                (client) =>
                    client.status === "active"
            ).length,

            inactive: clients.filter(
                (client) =>
                    client.status === "inactive"
            ).length,
        };

        /* =====================================================
           INVOICE ANALYTICS
        ===================================================== */

        const totalInvoiceAmount =
            invoices.reduce(
                (total, invoice) =>
                    total +
                    Number(
                        invoice.amount || 0
                    ),
                0
            );

        const paidAmount =
            invoices
                .filter(
                    (invoice) =>
                        invoice.status ===
                        "paid"
                )
                .reduce(
                    (total, invoice) =>
                        total +
                        Number(
                            invoice.amount || 0
                        ),
                    0
                );

        const pendingAmount =
            invoices
                .filter(
                    (invoice) =>
                        invoice.status ===
                        "sent" ||
                        invoice.status ===
                        "overdue"
                )
                .reduce(
                    (total, invoice) =>
                        total +
                        Number(
                            invoice.amount || 0
                        ),
                    0
                );

        const draftAmount =
            invoices
                .filter(
                    (invoice) =>
                        invoice.status ===
                        "draft"
                )
                .reduce(
                    (total, invoice) =>
                        total +
                        Number(
                            invoice.amount || 0
                        ),
                    0
                );

        const overdueAmount =
            invoices
                .filter(
                    (invoice) =>
                        invoice.status ===
                        "overdue"
                )
                .reduce(
                    (total, invoice) =>
                        total +
                        Number(
                            invoice.amount || 0
                        ),
                    0
                );

        const invoiceStats = {
            total: invoices.length,

            totalAmount:
                totalInvoiceAmount,

            paidAmount,

            pendingAmount,

            draftAmount,

            overdueAmount,

            draft: invoices.filter(
                (invoice) =>
                    invoice.status ===
                    "draft"
            ).length,

            sent: invoices.filter(
                (invoice) =>
                    invoice.status ===
                    "sent"
            ).length,

            paid: invoices.filter(
                (invoice) =>
                    invoice.status ===
                    "paid"
            ).length,

            overdue: invoices.filter(
                (invoice) =>
                    invoice.status ===
                    "overdue"
            ).length,

            cancelled: invoices.filter(
                (invoice) =>
                    invoice.status ===
                    "cancelled"
            ).length,
        };

        /* =====================================================
           MONTHLY REVENUE
           Selected Year + Paid Invoices
        ===================================================== */

        const monthlyRevenue =
            Array.from(
                { length: 12 },
                (_, index) => ({
                    month: index + 1,
                    revenue: 0,
                })
            );

        invoices.forEach((invoice) => {
            if (
                invoice.status !== "paid" ||
                !invoice.issueDate
            ) {
                return;
            }

            const date = new Date(
                invoice.issueDate
            );

            if (
                date.getFullYear() !==
                selectedYear
            ) {
                return;
            }

            const month =
                date.getMonth();

            monthlyRevenue[
                month
            ].revenue += Number(
                invoice.amount || 0
            );
        });

        /* =====================================================
           YEAR SUMMARY
        ===================================================== */

        const yearlyRevenue =
            monthlyRevenue.reduce(
                (total, item) =>
                    total + item.revenue,
                0
            );

        /* =====================================================
           RESPONSE
        ===================================================== */

        return res.status(200).json({
            success: true,

            analytics: {
                year: selectedYear,

                projects:
                    projectStats,

                tasks: {
                    ...taskStats,

                    completionRate:
                        taskCompletionRate,
                },

                clients:
                    clientStats,

                invoices:
                    invoiceStats,

                monthlyRevenue,

                yearlyRevenue,
            },
        });
    } catch (error) {
        console.error(
            "Get analytics error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to load analytics",
        });
    }
};

module.exports = {
    getAnalytics,
};