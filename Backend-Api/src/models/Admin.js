// ========================================
// ADMIN MODEL
// ========================================

const mongoose = require("mongoose");

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

        fullName: {
            type: String,
            trim: true,
            default: "",
        },

        location: {
            type: String,
            trim: true,
            default: "",
        },

        education: {
            type: String,
            trim: true,
            default: "",
        },

        monitoring: {
            type: String,
            default: "Admin Sistem",
        },

        dailyFeedback: {
            type: String,
            default: "5 - 10 Feedback",
        },

        crudCount: {
            type: String,
            default: "10 - 30 Data",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Admin", adminSchema);
