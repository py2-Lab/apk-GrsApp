
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const createToken = require("../utils/createToken");

async function register(req, res) {
    try {
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, dan password wajib diisi.",
            });
        }

        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({
                message: "Username harus 3–30 karakter.",
            });
        }

        if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
            return res.status(400).json({
                message: "Format username tidak valid.",
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Format email tidak valid.",
            });
        }

        if (
            password.length < 8 ||
            !/[A-Za-z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {
            return res.status(400).json({
                message: "Password minimal 8 karakter dan harus mengandung huruf serta angka.",
            });
        }

        const escapedUsername = username.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const existing = await Admin.findOne({
            $or: [
                { email },
                {
                    username: {
                        $regex: `^${escapedUsername}$`,
                        $options: "i",
                    },
                },
            ],
        });

        if (existing) {
            return res.status(409).json({
                message: "Email atau username sudah terdaftar.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await Admin.create({
            username,
            email,
            password: hashedPassword,
            role: "admin",
            status: "pending",
        });

        return res.status(201).json({
            message: "Pendaftaran berhasil. Akun Anda menunggu persetujuan Super Admin.",
            status: "pending",
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email atau username sudah digunakan.",
            });
        }

        console.error("Register error:", error);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server.",
        });
    }
}

async function login(req, res) {
    try {
        const identifier = String(
            req.body.identifier || req.body.email || ""
        ).trim();

        const password = String(req.body.password || "");

        if (!identifier || !password) {
            return res.status(400).json({
                message: "Email atau username dan password wajib diisi.",
            });
        }

        const escapedIdentifier = identifier.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const admin = await Admin.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                {
                    username: {
                        $regex: `^${escapedIdentifier}$`,
                        $options: "i",
                    },
                },
            ],
        }).select("+password");

        if (
            !admin ||
            !(await bcrypt.compare(password, admin.password))
        ) {
            return res.status(401).json({
                message: "Email/username atau password salah.",
            });
        }

        if (admin.status === "pending") {
            return res.status(403).json({
                message: "Akun Anda masih menunggu persetujuan Super Admin.",
            });
        }

        if (admin.status === "rejected") {
            return res.status(403).json({
                message: "Pendaftaran akun Anda ditolak. Hubungi Super Admin.",
            });
        }

        return res.json({
            message: "Login berhasil.",
            token: createToken(admin),
            user: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                status: admin.status,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server.",
        });
    }
}

module.exports = {
    register,
    login,
};
