
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

async function seedSuperAdmin() {
    const username = String(
        process.env.SUPER_ADMIN_USERNAME || "superadmin"
    ).trim();

    const email = String(
        process.env.SUPER_ADMIN_EMAIL || ""
    ).trim().toLowerCase();

    const password = String(
        process.env.SUPER_ADMIN_PASSWORD || ""
    );

    if (!username || !email || !password) {
        console.warn(
            "Kredensial Super Admin belum lengkap di .env."
        );
        return;
    }

    if (password.length < 12) {
        throw new Error(
            "SUPER_ADMIN_PASSWORD wajib minimal 12 karakter."
        );
    }

    const existing = await Admin.findOne({
        role: "superadmin",
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    if (existing) {
        existing.username = username;
        existing.email = email;
        existing.password = hashedPassword;
        existing.status = "approved";

        await existing.save();

        console.log("Kredensial Super Admin berhasil diperbarui.");
        return;
    }

    await Admin.create({
        username,
        email,
        password: hashedPassword,
        role: "superadmin",
        status: "approved",
    });

    console.log("Akun Super Admin awal berhasil dibuat.");
}

module.exports = seedSuperAdmin;
