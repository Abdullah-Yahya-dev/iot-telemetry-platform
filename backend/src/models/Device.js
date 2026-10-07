const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const deviceSchema = new Schema({

    deviceId: {
        type: String,
        required: true,
        unique: true
    },

    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },

    lastSeen: {
        type: Date,
        default: null,
    },

}, {
        timestamps: true
    }
);

module.exports = model("Device", deviceSchema);