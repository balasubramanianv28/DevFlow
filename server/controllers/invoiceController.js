const Invoice = require("../models/Invoice");
const Client = require("../models/Client");

/* =========================
   CREATE INVOICE
========================= */

const createInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            client,
            amount,
            status,
            issueDate,
            dueDate,
            notes,
        } = req.body;

        if (
            !invoiceNumber ||
            !client ||
            amount === undefined ||
            !dueDate
        ) {
            return res.status(400).json({
                message:
                    "Invoice number, client, amount and due date are required",
            });
        }

        const clientExists =
            await Client.findOne({
                _id: client,
                owner: req.userId,
            });

        if (!clientExists) {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        const invoiceExists =
            await Invoice.findOne({
                invoiceNumber,
                owner: req.userId,
            });

        if (invoiceExists) {
            return res.status(400).json({
                message:
                    "Invoice number already exists",
            });
        }

        const invoice =
            await Invoice.create({
                invoiceNumber,
                client,
                amount,
                status,
                issueDate,
                dueDate,
                notes,
                owner: req.userId,
            });

        const populatedInvoice =
            await Invoice.findById(
                invoice._id
            ).populate(
                "client",
                "name email company"
            );

        res.status(201).json({
            message:
                "Invoice created successfully",
            invoice: populatedInvoice,
        });
    } catch (error) {
        console.error(
            "Create invoice error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while creating invoice",
        });
    }
};

/* =========================
   GET INVOICES
========================= */

const getInvoices = async (req, res) => {
    try {
        const invoices =
            await Invoice.find({
                owner: req.userId,
            })
                .populate(
                    "client",
                    "name email company"
                )
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            invoices,
        });
    } catch (error) {
        console.error(
            "Get invoices error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching invoices",
        });
    }
};

/* =========================
   UPDATE INVOICE
========================= */

const updateInvoice = async (req, res) => {
    try {
        const invoice =
            await Invoice.findOne({
                _id: req.params.id,
                owner: req.userId,
            });

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found",
            });
        }

        const {
            invoiceNumber,
            client,
            amount,
            status,
            issueDate,
            dueDate,
            notes,
        } = req.body;

        if (
            client !== undefined &&
            client.toString() !==
            invoice.client.toString()
        ) {
            const clientExists =
                await Client.findOne({
                    _id: client,
                    owner: req.userId,
                });

            if (!clientExists) {
                return res.status(404).json({
                    message:
                        "Client not found",
                });
            }

            invoice.client = client;
        }

        if (
            invoiceNumber !== undefined &&
            invoiceNumber !==
            invoice.invoiceNumber
        ) {
            const duplicate =
                await Invoice.findOne({
                    invoiceNumber,
                    owner: req.userId,
                    _id: {
                        $ne: invoice._id,
                    },
                });

            if (duplicate) {
                return res.status(400).json({
                    message:
                        "Invoice number already exists",
                });
            }

            invoice.invoiceNumber =
                invoiceNumber;
        }

        if (amount !== undefined) {
            invoice.amount = amount;
        }

        if (status !== undefined) {
            invoice.status = status;
        }

        if (issueDate !== undefined) {
            invoice.issueDate = issueDate;
        }

        if (dueDate !== undefined) {
            invoice.dueDate = dueDate;
        }

        if (notes !== undefined) {
            invoice.notes = notes;
        }

        const updatedInvoice =
            await invoice.save();

        const populatedInvoice =
            await Invoice.findById(
                updatedInvoice._id
            ).populate(
                "client",
                "name email company"
            );

        res.status(200).json({
            message:
                "Invoice updated successfully",
            invoice: populatedInvoice,
        });
    } catch (error) {
        console.error(
            "Update invoice error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while updating invoice",
        });
    }
};

/* =========================
   DELETE INVOICE
========================= */

const deleteInvoice = async (req, res) => {
    try {
        const invoice =
            await Invoice.findOneAndDelete({
                _id: req.params.id,
                owner: req.userId,
            });

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found",
            });
        }

        res.status(200).json({
            message:
                "Invoice deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete invoice error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while deleting invoice",
        });
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    updateInvoice,
    deleteInvoice,
};