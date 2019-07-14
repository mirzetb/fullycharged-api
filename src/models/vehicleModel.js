const mongoose = require('mongoose')

const vehicleModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    batteryCapacity: {
        type: Number,
        required: true
    },
    maxChargingPower: {
        type: Number,
        required: true
    },
    supportedChargerTypes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChargerType',
            required: true
        }
    ]
}, {
    timestamps: true,
    versionKey: false
})

const VehicleModel = mongoose.model('VehicleModel', vehicleModelSchema)

module.exports = VehicleModel