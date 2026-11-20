
const Admin = require("../models/Admin");
const Transaction = require("../models/Transaction");

async function getProfile(req, res) {
    try {
        const admin = await Admin.findById(req.auth.sub).select(
            "username email fullName location education monitoring dailyFeedback crudCount role"
        );

        if (!admin) {
            return res.status(404).json({
                message: "Profil Admin tidak ditemukan.",
            });
        }

        return res.json({ profile: admin });
    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            message: "Gagal mengambil profil Admin.",
        });
    }
}

async function updateProfile(req, res) {
    try {
        const allowedFields = [
            "username",
            "fullName",
            "location",
            "education",
            "monitoring",
            "dailyFeedback",
            "crudCount",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (typeof req.body[field] !== "string") {
                    return res.status(400).json({
                        message: `Format ${field} tidak valid.`,
                    });
                }

                updates[field] = req.body[field].trim();
            }
        }

        if (
            updates.username !== undefined &&
            (
                updates.username.length < 3 ||
                updates.username.length > 30 ||
                !/^[a-zA-Z0-9_.-]+$/.test(updates.username)
            )
        ) {
            return res.status(400).json({
                message: "Format username tidak valid.",
            });
        }

        if (updates.username) {
            const escapedUsername = updates.username.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const existing = await Admin.findOne({
                username: {
                    $regex: `^${escapedUsername}$`,
                    $options: "i",
                },
                _id: { $ne: req.auth.sub },
            });

            if (existing) {
                return res.status(409).json({
                    message: "Username sudah digunakan.",
                });
            }
        }

        const admin = await Admin.findByIdAndUpdate(
            req.auth.sub,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        ).select(
            "username email fullName location education monitoring dailyFeedback crudCount role"
        );

        if (!admin) {
            return res.status(404).json({
                message: "Akun Admin tidak ditemukan.",
            });
        }

        return res.json({
            message: "Profil berhasil diperbarui.",
            profile: admin,
        });
    } catch (error) {
        console.error("Update Profile Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Username sudah digunakan.",
            });
        }

        return res.status(500).json({
            message: "Gagal memperbarui profil Admin.",
        });
    }
}

async function getTransactions(req, res) {
    try {
        const page = Math.max(
            1,
            parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 10)
        );

        const period = req.query.period || "7d";
        const search = String(req.query.search || "").trim();

        const now = new Date();
        let startDate = null;
        let previousStart = null;

        if (period === "7d") {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);

            previousStart = new Date(startDate);
            previousStart.setDate(startDate.getDate() - 7);
        } else if (period === "30d") {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 30);

            previousStart = new Date(startDate);
            previousStart.setDate(startDate.getDate() - 30);
        } else if (period !== "all") {
            return res.status(400).json({
                message: "Filter periode tidak valid.",
            });
        }

        const filter = {};

        if (startDate) {
            filter.transactionDate = {
                $gte: startDate,
                $lte: now,
            };
        }

        if (search) {
            const escaped = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { userName: { $regex: escaped, $options: "i" } },
                { userEmail: { $regex: escaped, $options: "i" } },
                { reference: { $regex: escaped, $options: "i" } },
            ];
        }

        const [transactions, total, aggregation] = await Promise.all([
            Transaction.find(filter)
                .sort({ transactionDate: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

            Transaction.countDocuments(filter),

            Transaction.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "paid"] },
                                    "$amount",
                                    0,
                                ],
                            },
                        },
                        totalTransactions: { $sum: 1 },
                    },
                },
            ]),
        ]);

        let previousAmount = 0;

        if (previousStart && startDate) {
            const previousFilter = {
                transactionDate: {
                    $gte: previousStart,
                    $lt: startDate,
                },
            };

            const previousResult = await Transaction.aggregate([
                { $match: previousFilter },
                {
                    $group: {
                        _id: null,
                        amount: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "paid"] },
                                    "$amount",
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]);

            previousAmount = previousResult[0]?.amount || 0;
        }

        const summary = aggregation[0] || {
            totalAmount: 0,
            totalTransactions: 0,
        };

        const growth =
            previousAmount === 0
                ? summary.totalAmount > 0 ? 100 : 0
                : (
                    (summary.totalAmount - previousAmount) /
                    previousAmount
                ) * 100;

        return res.json({
            transactions,
            total,
            page,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            summary: {
                totalTransactions: summary.totalTransactions,
                totalAmount: summary.totalAmount,
                previousAmount,
                growth: Number(growth.toFixed(2)),
            },
        });
    } catch (error) {
        console.error("Get Transactions Error:", error);

        return res.status(500).json({
            message: "Gagal mengambil data transaksi.",
        });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    getTransactions,
};
