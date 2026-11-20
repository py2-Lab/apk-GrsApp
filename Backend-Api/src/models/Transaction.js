
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            index: true,
        },

        userName: {
            type: String,
            required: true,
            trim: true,
        },

        userEmail: {
            type: String,
            default: "",
            trim: true,
        },

        paymentMethod: {
            type: String,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["paid", "pending", "failed", "refunded"],
            default: "pending",
        },

        transactionDate: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
