
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const corsConfig = require("./config/cors");

const app = express();

// Global middleware
app.use(helmet());
app.use(corsConfig);
app.use(express.json({ limit: "20kb" }));
app.use(morgan("dev"));

// API Routes
app.use("/api/health", require("./routes/health.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/superadmin", require("./routes/superAdmin.routes"));

// Route tidak ditemukan
app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint API tidak ditemukan.",
    });
});

module.exports = app;
