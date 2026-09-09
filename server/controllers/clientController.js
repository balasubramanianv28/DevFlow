const Client = require("../models/Client");

/* =========================
   CREATE CLIENT
========================= */

const createClient = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            company,
            address,
            status,
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required",
            });
        }

        const client = await Client.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || "",
            company: company?.trim() || "",
            address: address?.trim() || "",
            status: status || "active",
            owner: req.userId,
        });

        res.status(201).json({
            message: "Client created successfully",
            client,
        });
    } catch (error) {
        console.error(
            "Create client error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while creating client",
        });
    }
};

/* =========================
   GET CLIENTS
========================= */

const getClients = async (req, res) => {
    try {
        const clients = await Client.find({
            owner: req.userId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            clients,
        });
    } catch (error) {
        console.error(
            "Get clients error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching clients",
        });
    }
};

/* =========================
   UPDATE CLIENT
========================= */

const updateClient = async (req, res) => {
    try {
        const client =
            await Client.findOne({
                _id: req.params.id,
                owner: req.userId,
            });

        if (!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        const {
            name,
            email,
            phone,
            company,
            address,
            status,
        } = req.body;

        if (name !== undefined) {
            client.name = name.trim();
        }

        if (email !== undefined) {
            client.email = email
                .trim()
                .toLowerCase();
        }

        if (phone !== undefined) {
            client.phone = phone.trim();
        }

        if (company !== undefined) {
            client.company = company.trim();
        }

        if (address !== undefined) {
            client.address = address.trim();
        }

        if (status !== undefined) {
            client.status = status;
        }

        const updatedClient =
            await client.save();

        res.status(200).json({
            message:
                "Client updated successfully",
            client: updatedClient,
        });
    } catch (error) {
        console.error(
            "Update client error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while updating client",
        });
    }
};

/* =========================
   DELETE CLIENT
========================= */

const deleteClient = async (req, res) => {
    try {
        const client =
            await Client.findOneAndDelete({
                _id: req.params.id,
                owner: req.userId,
            });

        if (!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        res.status(200).json({
            message:
                "Client deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete client error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while deleting client",
        });
    }
};

module.exports = {
    createClient,
    getClients,
    updateClient,
    deleteClient,
};