const express = require("express");

const router = express.Router();

const {
    createInvoice,
    getInvoices,
    updateInvoice,
    deleteInvoice,
} = require("../controllers/invoiceController");

const protect = require("../middleware/authMiddleware");

/* =========================
   INVOICE ROUTES
========================= */

// GET all invoices
router.get(
    "/",
    protect,
    getInvoices
);

// CREATE invoice
router.post(
    "/",
    protect,
    createInvoice
);

// UPDATE invoice
router.patch(
    "/:id",
    protect,
    updateInvoice
);

// DELETE invoice
router.delete(
    "/:id",
    protect,
    deleteInvoice
);

module.exports = router;