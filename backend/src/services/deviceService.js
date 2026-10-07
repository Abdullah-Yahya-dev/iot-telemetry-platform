const Device = require("../models/Device");


async function getOrCreateDevice(deviceId){
    let device = await Device.findOne({ deviceId: deviceId });
    if (!device) {
        console.log("Device not found for deviceId Creating it:", deviceId);
        device = await Device.create({ deviceId: deviceId, status: "online" });
        console.log("Device created with deviceId:", deviceId);
    }
    return device;
};

module.exports = {
    getOrCreateDevice
};
