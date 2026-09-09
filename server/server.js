const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const taskRoutes = require("./routes/taskRoutes");
const clientRoutes = require("./routes/clientRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();

const app = express();


// DATABASE

connectDB();


// MIDDLEWARE

app.use(cors());

app.use(express.json());


// DYNAMIC UPLOAD DIRECTORY

const uploadsPath = path.join(
    __dirname,
    "uploads"
);

app.use(
    "/uploads",
    express.static(uploadsPath)
);


// API ROUTES

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/projects",
    projectRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.use(
    "/api/tasks",
    taskRoutes
);

app.use(
    "/api/clients",
    clientRoutes
);

app.use(
    "/api/invoices",
    invoiceRoutes
);

app.use(
    "/api/analytics",
    analyticsRoutes
);


// ROOT API

app.get("/", (req, res) => {
    res.json({
        success: true,
        message:
            "DEVFLOW API is running successfully",
    });
});


// SERVER

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});