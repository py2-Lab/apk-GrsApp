require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(morgan("dev"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Terlalu banyak percobaan. Coba lagi beberapa saat.",
  },
});

// ========================================
// ADMIN MODEL
// ========================================

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Admin = mongoose.model("Admin", adminSchema);

// ========================================
// TOKEN
// ========================================

function createToken(admin) {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      role: admin.role,
    },
    JWT_SECRET,
    {
      expiresIn: "12h",
    },
  );
}

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================


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
    const decoded = jwt.verify(token, JWT_SECRET);

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
    if (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError") {
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

// ========================================
// SUPER ADMIN AUTHORIZATION MIDDLEWARE
// ========================================

function requireSuperAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== "superadmin") {
    return res.status(403).json({
      message: "Akses hanya untuk Super Admin.",
    });
  }

  return next();
}

// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "GrsApp Admin API",
  });
});

// ========================================
// REGISTER
// ========================================


app.post(
  "/api/auth/register",
  authLimiter,
  async (req, res) => {
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
          message: "Username hanya boleh berisi huruf, angka, titik, garis, dan underscore.",
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

      const existing = await Admin.findOne({
        $or: [
          { email },
          {
            username: {
              $regex: `^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
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
  },
);


// ========================================
// LOGIN
// ========================================


app.post(
  "/api/auth/login",
  authLimiter,
  async (req, res) => {
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
  },
);


// ========================================
// SUPER ADMIN: DAFTAR PENDAFTARAN PENDING
// ========================================

app.get(
  "/api/superadmin/registrations",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const users = await Admin.find({
        role: "admin",
        status: "pending",
      })
        .select("username email status createdAt")
        .sort({ createdAt: 1 });

      return res.json({
        users,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Gagal mengambil daftar pendaftaran.",
      });
    }
  },
);

// ========================================
// SUPER ADMIN: APPROVE / REJECT
// ========================================

app.patch(
  "/api/superadmin/registrations/:id",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
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
        },
      ).select("username email role status reviewedAt");

      if (!admin) {
        return res.status(404).json({
          message:
            "Pendaftaran tidak ditemukan atau sudah ditinjau.",
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
  },
);


// ========================================
// SUPER ADMIN: SEMUA AKUN ADMIN
// ========================================

app.get(
  "/api/superadmin/admins",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
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
  },
);

// ========================================
// SUPER ADMIN: HAPUS AKUN ADMIN
// ========================================

app.delete(
  "/api/superadmin/admins/:id",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
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
  },
);


// ========================================
// CREATE INITIAL SUPER ADMIN
// ========================================


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


// ========================================
// START SERVER
// ========================================

async function start() {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error(
      "JWT_SECRET wajib diisi dan minimal 32 karakter.",
    );
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI wajib diisi.");
  }

  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB berhasil terhubung.");

  await seedSuperAdmin();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `GrsApp API berjalan di port ${PORT}`,
    );
  });
}

start().catch((error) => {
  console.error("Gagal menjalankan server:", error);
  process.exit(1);
});