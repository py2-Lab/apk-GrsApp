
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function authenticate(req, res, next) {
    const header = req.headers.authorization || "";

    const token = header.startsWith("Bearer ")
        ? header.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({
            message: "Token autentikasi diperlukan.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.sub);

        if (!admin) {
            return res.status(401).json({
                message: "Akun sudah tidak tersedia.",
            });
        }

        if (admin.status !== "approved") {
            return res.status(403).json({
                message: "Akun tidak memiliki akses aktif.",
            });
        }

        if (admin.role !== decoded.role) {
            return res.status(403).json({
                message: "Hak akses akun tidak valid.",
            });
        }

        req.auth = {
            sub: admin._id.toString(),
            role: admin.role,
        };

        return next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Sesi tidak valid atau sudah kedaluwarsa.",
            });
        }

        console.error("Authentication error:", error);

        return res.status(500).json({
            message: "Gagal memverifikasi autentikasi.",
        });
    }
}

module.exports = authenticate;
