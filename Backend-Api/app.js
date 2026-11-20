
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const corsConfig = require("./src/config/cors");

const app = express();

// Global middleware
app.use(helmet());
app.use(corsConfig);
app.use(express.json({ limit: "20kb" }));
app.use(morgan("dev"));

// API Routes
app.use("/api/health", require("./src/routes/health.routes"));
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/superadmin", require("./src/routes/superAdmin.routes"));

// Route tidak ditemukan
app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint API tidak ditemukan.",
    });
});

module.exports = app;
