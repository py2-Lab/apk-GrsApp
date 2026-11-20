
const mongoose = require("mongoose");

async function connectDB() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI wajib diisi.");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB berhasil terhubung.");
}

module.exports = connectDB;
