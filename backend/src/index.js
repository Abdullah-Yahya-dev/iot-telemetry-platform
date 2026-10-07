const mqtt = require("mqtt");
require("dotenv").config();
const Telemetry = require("./models/Telemetry");
const connectDB = require("./config/db");
const { getOrCreateDevice } = require("./services/deviceService");

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
    console.log("Connected to MQTT broker");

    client.subscribe("iot/device/esp32-01/#", (error) => {
        if (error) {
            console.error("Subscription error:", error);
            return;
        }

        console.log("Subscribed to telemetry / status topic");
    });
});

client.on("message", async (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const parts = topic.split("/");
        
        if (parts.length !== 4 || parts[0] !== "iot" || parts[1] !== "device") {
            console.log("Invalid topic format:", topic);
            return;
        }

        if (!parts[2] || !parts[3]) {
            console.log("Invalid topic format: deviceId or messageType is missing");
            return;
        }

        const deviceId = parts[2];
        const messageType = parts[3];

        if (messageType === "telemetry") {

            if ((data.temperature === undefined || data.humidity === undefined) || typeof data.temperature !== "number" || typeof data.humidity !== "number") {
            console.log("Invalid telemetry: temperature or humidity is missing or invalid");
            return;
        }

            console.log("Valid telemetry received:");
            console.log(data);
            console.log("Telemetry message received:", data);

            try{
                const device = await getOrCreateDevice(deviceId);
                await Telemetry.create({
                    temperature: data.temperature,
                    humidity: data.humidity,
                    receivedAt: new Date(),
                    device: device._id
                });
                console.log("Telemetry saved to MongoDB");

            } catch(err){
            console.error("Error saving telemetry to MongoDB:", err.message);
            }

        }

        else if (messageType === "status") {
            if (!data.status || !(data.status === "online" || data.status === "offline")) {
                console.log("status is missing or Invalid status value:", data.status);
                return;
            }

            const status = data.status;
            console.log("Device:", deviceId);
            console.log("Status:", status);
            
            try {
                const device = await getOrCreateDevice(deviceId);
                device.status = data.status;
                device.lastSeen = new Date();
                await device.save();
                console.log("Device status updated in MongoDB");
            } catch(err){
                console.error("Error updating device status in MongoDB:", err.message);
            }
        }

        else{
            console.log("Unknown message type received:", messageType);
        }


    } catch (error) {
        console.error("Invalid JSON received:", error.message);
    }
});

connectDB();