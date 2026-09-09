const express = require("express");

const router = express.Router();

const {
    createClient,
    getClients,
    updateClient,
    deleteClient,
} = require("../controllers/clientController");

const protect = require("../middleware/authMiddleware");

/* =========================
   CLIENT ROUTES
========================= */

// GET all clients
router.get(
    "/",
    protect,
    getClients
);

// CREATE client
router.post(
    "/",
    protect,
    createClient
);

// UPDATE client
router.patch(
    "/:id",
    protect,
    updateClient
);

// DELETE client
router.delete(
    "/:id",
    protect,
    deleteClient
);

module.exports = router;