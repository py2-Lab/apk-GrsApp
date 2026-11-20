
require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");
const seedSuperAdmin = require("./src/services/superAdminSeeder");

const PORT = process.env.PORT || 5000;

async function start() {
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error(
      "JWT_SECRET wajib diisi dan minimal 32 karakter."
    );
  }

  await connectDB();

  await seedSuperAdmin();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GrsApp API berjalan di port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Gagal menjalankan server:", error);
  process.exit(1);
});
