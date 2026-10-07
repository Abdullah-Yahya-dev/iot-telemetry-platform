const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const telemetrySchema = new Schema(
    {
        temperature: {
            type: Number,
            required: true
        },

        humidity: {
            type: Number,
            required: true
        },

        receivedAt: {
            type: Date,
            required: true
        },

        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("Telemetry", telemetrySchema);