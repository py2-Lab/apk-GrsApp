
const Admin = require("../models/Admin");

async function getRegistrations(req, res) {
    try {
        const users = await Admin.find({
            role: "admin",
            status: "pending",
        })
            .select("username email status createdAt")
            .sort({ createdAt: 1 });

        return res.json({ users });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Gagal mengambil daftar pendaftaran.",
        });
    }
}

async function reviewRegistration(req, res) {
    try {
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status harus approved atau rejected.",
            });
        }

        const admin = await Admin.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "admin",
                status: "pending",
            },
            {
                status,
                reviewedAt: new Date(),
                reviewedBy: req.auth.sub,
            },
            {
                new: true,
            }
        ).select("username email role status reviewedAt");

        if (!admin) {
            return res.status(404).json({
                message: "Pendaftaran tidak ditemukan atau sudah ditinjau.",
            });
        }

        return res.json({
            message:
                status === "approved"
                    ? "Akun berhasil disetujui."
                    : "Akun berhasil ditolak.",
            user: admin,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Gagal memperbarui status akun.",
        });
    }
}

async function getAdmins(req, res) {
    try {
        const users = await Admin.find({
            role: "admin",
        })
            .select("username email role status createdAt")
            .sort({ createdAt: -1 });

        return res.json({ users });
    } catch (error) {
        console.error("Get Admins error:", error);

        return res.status(500).json({
            message: "Gagal mengambil daftar akun Admin.",
        });
    }
}

async function deleteAdmin(req, res) {
    try {
        const admin = await Admin.findOne({
            _id: req.params.id,
            role: "admin",
        });

        if (!admin) {
            return res.status(404).json({
                message: "Akun Admin tidak ditemukan.",
            });
        }

        await Admin.deleteOne({
            _id: admin._id,
            role: "admin",
        });

        return res.json({
            message: "Akun Admin berhasil dihapus.",
            deletedId: admin._id,
        });
    } catch (error) {
        console.error("Delete Admin error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "ID akun tidak valid.",
            });
        }

        return res.status(500).json({
            message: "Gagal menghapus akun Admin.",
        });
    }
}

module.exports = {
    getRegistrations,
    reviewRegistration,
    getAdmins,
    deleteAdmin,
};
